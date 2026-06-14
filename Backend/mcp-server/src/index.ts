import express from 'express';
import cors from 'cors';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { SSEServerTransport } from '@modelcontextprotocol/sdk/server/sse.js';
import { z } from 'zod';
import { breeds } from './data/breeds.js';

// Create Express app
const app = express();

// Enable CORS and JSON parsing
app.use(cors());
app.use(express.json());

// Create MCP server
const mcpServer = new McpServer({
  name: 'tinycats-mcp-server',
  version: '1.0.0'
}, {
  capabilities: {
    tools: {}
  }
});

// Register get_breed_list tool
mcpServer.registerTool(
  'get_breed_list',
  {
    description: 'Returns the full list of all available cat breeds',
    inputSchema: z.object({})
  },
  async () => {
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(breeds)
        }
      ]
    };
  }
);

// Register get_breed_detail tool
mcpServer.registerTool(
  'get_breed_detail',
  {
    description: 'Returns the detailed profile of a specific cat breed by its ID',
    inputSchema: z.object({
      breedId: z.string().describe('The ID of the breed to retrieve, e.g. "ragdoll"')
    })
  },
  async ({ breedId }) => {
    const breed = breeds.find(b => b.id === breedId);
    if (!breed) {
      return {
        content: [
          {
            type: 'text',
            text: `Breed with ID "${breedId}" not found.`
          }
        ],
        isError: true
      };
    }
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(breed)
        }
      ]
    };
  }
);

// Register search_breeds tool
mcpServer.registerTool(
  'search_breeds',
  {
    description: 'Search and filter cat breeds based on traits, size, coat length, and tags',
    inputSchema: z.object({
      filters: z.object({
        search: z.string().optional().describe('Search query matching name, tagline, or description'),
        size: z.enum(['small', 'medium', 'large']).optional().describe('Breed size category'),
        coatLength: z.enum(['short', 'medium', 'long', 'hairless']).optional().describe('Breed coat length'),
        maxAllergenLevel: z.number().min(1).max(5).optional().describe('Maximum allergen rating (1 = hypoallergenic, 5 = heavy shedder)'),
        minChildFriendly: z.number().min(1).max(10).optional().describe('Minimum child friendliness score (1-10)'),
        tags: z.array(z.string()).optional().describe('Required tags (e.g. "apartment", "calm")')
      }).optional(),
      limit: z.number().optional().describe('Limit the number of results returned')
    })
  },
  async ({ filters, limit }) => {
    let filtered = [...breeds];

    if (filters) {
      const searchVal = filters.search;
      if (searchVal) {
        const q = searchVal.toLowerCase();
        filtered = filtered.filter(
          b => b.name.toLowerCase().includes(q) ||
               b.tagline.toLowerCase().includes(q) ||
               b.description.toLowerCase().includes(q)
        );
      }

      const sizeVal = filters.size;
      if (sizeVal) {
        filtered = filtered.filter(b => b.size === sizeVal);
      }

      const coatLengthVal = filters.coatLength;
      if (coatLengthVal) {
        filtered = filtered.filter(b => b.coatLength === coatLengthVal);
      }

      const maxAllergenVal = filters.maxAllergenLevel;
      if (maxAllergenVal !== undefined) {
        filtered = filtered.filter(b => b.traits.allergenLevel <= maxAllergenVal);
      }

      const minChildFriendlyVal = filters.minChildFriendly;
      if (minChildFriendlyVal !== undefined) {
        filtered = filtered.filter(b => b.traits.childFriendly >= minChildFriendlyVal);
      }

      const tagsVal = filters.tags;
      if (Array.isArray(tagsVal) && tagsVal.length > 0) {
        filtered = filtered.filter(b => tagsVal.every(t => b.tags.includes(t)));
      }
    }

    const total = filtered.length;

    if (limit !== undefined && limit > 0) {
      filtered = filtered.slice(0, limit);
    }

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({ breeds: filtered, total })
        }
      ]
    };
  }
);

// Transports store
const transports: Record<string, SSEServerTransport> = {};

// SSE route
app.get('/mcp', async (req, res) => {
  console.log(`[MCP] Connection requested from ${req.ip}`);
  try {
    const transport = new SSEServerTransport('/messages', res);
    const sessionId = transport.sessionId;
    transports[sessionId] = transport;

    transport.onclose = () => {
      console.log(`[MCP] Transport closed for session ${sessionId}`);
      delete transports[sessionId];
    };

    await mcpServer.connect(transport);
    console.log(`[MCP] SSE connection established for session ${sessionId}`);
  } catch (error) {
    console.error('[MCP] Error establishing SSE connection:', error);
    if (!res.headersSent) {
      res.status(500).send('SSE connection failed');
    }
  }
});

// Messages route
app.post('/messages', async (req, res) => {
  const sessionId = req.query.sessionId as string;
  if (!sessionId) {
    res.status(400).send('Missing sessionId query parameter');
    return;
  }

  const transport = transports[sessionId];
  if (!transport) {
    res.status(404).send('Session not found');
    return;
  }

  try {
    await transport.handlePostMessage(req, res, req.body);
  } catch (error) {
    console.error('[MCP] Error handling message:', error);
    if (!res.headersSent) {
      res.status(500).send('Error handling message');
    }
  }
});

// Health check route
app.get('/health', (req, res) => {
  res.json({ status: 'ok', server: 'tinycats-mcp-server', tools: 3, breeds: breeds.length });
});

// Start listening
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 TinyCats MCP Server listening on port ${PORT}`);
  console.log(`   - SSE connection: GET http://localhost:${PORT}/mcp`);
  console.log(`   - Client messages: POST http://localhost:${PORT}/messages`);
  console.log(`   - Health check: GET http://localhost:${PORT}/health`);
});

// Handle graceful shutdown
process.on('SIGINT', async () => {
  console.log('Stopping MCP server...');
  for (const sessionId in transports) {
    try {
      await transports[sessionId]?.close();
    } catch (error) {
      console.error(`Error closing transport ${sessionId}:`, error);
    }
  }
  process.exit(0);
});
