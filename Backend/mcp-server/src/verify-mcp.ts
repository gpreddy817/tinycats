import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { SSEClientTransport } from '@modelcontextprotocol/sdk/client/sse.js';

async function test() {
  console.log('Connecting to MCP server at http://localhost:3001/mcp...');
  const transport = new SSEClientTransport(new URL('http://localhost:3001/mcp'));
  const client = new Client({ name: 'test-client', version: '1.0.0' }, {});

  await client.connect(transport);
  console.log('Connected!');

  console.log('Calling get_breed_list...');
  const breedsResult = await client.callTool({ name: 'get_breed_list', arguments: {} });
  const breedsContent = breedsResult.content as Array<{ type: string; text: string }>;
  const firstBreedText = breedsContent[0]?.text;
  if (!firstBreedText) throw new Error('No breed content found');
  const breeds = JSON.parse(firstBreedText);
  console.log(`Fetched ${breeds.length} breeds.`);

  console.log('Calling get_breed_detail for siberian...');
  const detailResult = await client.callTool({ name: 'get_breed_detail', arguments: { breedId: 'siberian' } });
  const detailContent = detailResult.content as Array<{ type: string; text: string }>;
  const firstDetailText = detailContent[0]?.text;
  if (!firstDetailText) throw new Error('No detail content found');
  const detail = JSON.parse(firstDetailText);
  console.log(`Detail for siberian tagline: "${detail.tagline}"`);

  console.log('Calling search_breeds with filter size=large...');
  const searchResult = await client.callTool({
    name: 'search_breeds',
    arguments: { filters: { size: 'large' } }
  });
  const searchContent = searchResult.content as Array<{ type: string; text: string }>;
  const firstSearchText = searchContent[0]?.text;
  if (!firstSearchText) throw new Error('No search content found');
  const search = JSON.parse(firstSearchText);
  console.log(`Found ${search.breeds.length} large breeds. (total: ${search.total})`);

  await client.close();
  console.log('Closed connection.');
}

test().catch(err => {
  console.error('Test failed:', err);
});
