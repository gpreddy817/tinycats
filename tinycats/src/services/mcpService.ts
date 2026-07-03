import type { Breed } from '@/types/breed';
import { BREEDS } from '@/data/breedsData';

export const fetchAllBreeds = async (): Promise<Breed[]> => {
  try {
    const res = await fetch('/api/breeds');
    if (!res.ok) throw new Error('Failed to fetch breeds from server');
    return await res.json();
  } catch (error) {
    console.warn('MCP Server breed API failed, falling back to local static data:', error);
    return BREEDS;
  }
};

export const fetchBreedById = async (id: string): Promise<Breed> => {
  try {
    const res = await fetch(`/api/breeds/${id}`);
    if (!res.ok) throw new Error(`Failed to fetch breed details for ${id}`);
    return await res.json();
  } catch (error) {
    console.warn(`MCP Server breed detail API failed for ${id}, falling back to local static data`);
    const breed = BREEDS.find((b) => b.id === id || b.slug === id);
    if (!breed) throw new Error(`Breed with ID ${id} not found`);
    return breed;
  }
};

export const searchBreeds = async (query: string): Promise<Breed[]> => {
  try {
    const res = await fetch('/api/breeds/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query }),
    });
    if (!res.ok) throw new Error('Search failed on server');
    return await res.json();
  } catch (error) {
    console.warn('MCP Server breed search API failed, falling back to local client search:', error);
    const term = query.toLowerCase();
    return BREEDS.filter(
      (b) =>
        b.name.toLowerCase().includes(term) ||
        b.description.toLowerCase().includes(term) ||
        b.tags.some((t) => t.toLowerCase().includes(term))
    );
  }
};
