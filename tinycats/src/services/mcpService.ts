import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { SSEClientTransport } from '@modelcontextprotocol/sdk/client/sse.js';
import type { Breed } from '@/types/breed';

class BreedMCPClient {
  private client: Client | null = null;
  private connected = false;

  private async connect(): Promise<void> {
    const serverUrl = import.meta.env.VITE_MCP_SERVER_URL as string | undefined;
    if (!serverUrl) {
      throw new Error('VITE_MCP_SERVER_URL is not configured');
    }
    const transport = new SSEClientTransport(new URL(serverUrl));
    this.client = new Client({ name: 'tinycats', version: '1.0.0' }, {});
    await this.client.connect(transport);
    this.connected = true;
  }

  private async call<T>(toolName: string, args: Record<string, unknown>): Promise<T> {
    if (!this.connected || !this.client) {
      await this.connect();
    }
    const result = await this.client!.callTool({ name: toolName, arguments: args });
    const content = result.content as Array<{ type: string; text: string }>;
    const firstContent = content[0];
    if (!firstContent || firstContent.type !== 'text') {
      throw new Error(`Unexpected MCP response format for tool: ${toolName}`);
    }
    return JSON.parse(firstContent.text) as T;
  }

  async getBreedList(): Promise<Breed[]> {
    return this.call<Breed[]>('get_breed_list', {});
  }

  async getBreedDetail(breedId: string): Promise<Breed> {
    return this.call<Breed>('get_breed_detail', { breedId });
  }

  async searchBreeds(filters: Record<string, unknown>): Promise<{ breeds: Breed[]; total: number }> {
    return this.call<{ breeds: Breed[]; total: number }>('search_breeds', { filters });
  }
}

export const mcpClient = new BreedMCPClient();
