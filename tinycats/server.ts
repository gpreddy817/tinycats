import express from 'express';
import cors from 'cors';
import { GoogleGenerativeAI, Tool, FunctionDeclaration } from '@google/generative-ai';
import { BREEDS } from './src/data/breedsData.js';
import type { Breed } from './src/types/breed.js';

const app = express();
const PORT = process.env.PORT ?? 3001;

app.use(cors());
app.use(express.json());

// ─── Gemini Setup ────────────────────────────────────────────────────────────
const GEMINI_API_KEY = process.env.GEMINI_API_KEY ?? '';
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

// ─── MCP-style Tool Definitions ───────────────────────────────────────────────
const breedTools: Tool[] = [
  {
    functionDeclarations: [
      {
        name: 'searchCatBreeds',
        description: 'Search for cat breeds matching specific criteria. Returns a list of matching breeds with their traits.',
        parameters: {
          type: 'OBJECT' as const,
          properties: {
            livingSpace: { type: 'STRING' as const, description: 'apartment | house | house-outdoor' },
            activityLevel: { type: 'STRING' as const, description: 'low | moderate | high' },
            allergySensitivity: { type: 'STRING' as const, description: 'none | mild | severe' },
            affectionPreference: { type: 'STRING' as const, description: 'independent | balanced | velcro' },
            hasKids: { type: 'BOOLEAN' as const, description: 'Whether household has children' },
            hasPets: { type: 'BOOLEAN' as const, description: 'Whether household has other pets' },
            limit: { type: 'NUMBER' as const, description: 'Max results (default 5)' },
          },
          required: [],
        },
      } as FunctionDeclaration,
      {
        name: 'getCatBreedDetails',
        description: 'Get detailed information about a specific cat breed by ID.',
        parameters: {
          type: 'OBJECT' as const,
          properties: {
            breedId: { type: 'STRING' as const, description: 'The breed ID e.g. ragdoll, maine-coon' },
          },
          required: ['breedId'],
        },
      } as FunctionDeclaration,
    ],
  },
];

// ─── Tool Implementations ─────────────────────────────────────────────────────
interface SearchCriteria {
  livingSpace?: string;
  activityLevel?: string;
  allergySensitivity?: string;
  affectionPreference?: string;
  hasKids?: boolean;
  hasPets?: boolean;
  limit?: number;
}

function searchCatBreeds(criteria: SearchCriteria): Breed[] {
  let results = [...BREEDS];

  if (criteria.allergySensitivity === 'severe') {
    results = results.filter((b) => b.traits.allergenLevel <= 1);
  } else if (criteria.allergySensitivity === 'mild') {
    results = results.filter((b) => b.traits.allergenLevel <= 2);
  }

  if (criteria.activityLevel === 'low') {
    results = results.filter((b) => b.traits.energy <= 4);
  } else if (criteria.activityLevel === 'high') {
    results = results.filter((b) => b.traits.energy >= 7);
  }

  if (criteria.affectionPreference === 'velcro') {
    results = results.filter((b) => b.traits.sociability >= 8);
  } else if (criteria.affectionPreference === 'independent') {
    results = results.filter((b) => b.traits.sociability <= 6);
  }

  if (criteria.hasKids) {
    results = results.filter((b) => b.traits.childFriendly >= 7);
  }

  if (criteria.hasPets) {
    results = results.filter((b) => b.traits.dogFriendly >= 7);
  }

  if (criteria.livingSpace === 'apartment') {
    results = results.filter((b) => b.tags.includes('apartment') || b.traits.energy <= 6);
  }

  return results.slice(0, criteria.limit ?? 8);
}

function getCatBreedDetails(breedId: string): Breed | null {
  return BREEDS.find((b) => b.id === breedId) ?? null;
}

// ─── Routes: Breeds ──────────────────────────────────────────────────────────
app.get('/api/breeds', (_req, res) => {
  res.json({ breeds: BREEDS.map(({ id, name, tags, traits, images, tagline, size, coatLength }) => ({ id, name, tags, traits, images, tagline, size, coatLength })) });
});

app.get('/api/breeds/:id', (req, res) => {
  const breed = getCatBreedDetails(req.params.id);
  if (!breed) return res.status(404).json({ error: 'Breed not found' });
  return res.json(breed);
});

app.post('/api/breeds/search', (req, res) => {
  const results = searchCatBreeds(req.body as SearchCriteria);
  res.json({ breeds: results, total: results.length });
});

// ─── Route: Recommendations ───────────────────────────────────────────────────
app.post('/api/recommend', async (req, res) => {
  if (!GEMINI_API_KEY) {
    // Return mock data when no API key
    const mockRecs = BREEDS.slice(0, 5).map((b, i) => ({
      breedId: b.id,
      breedName: b.name,
      matchScore: 95 - i * 8,
      matchReasons: ['Great temperament match', 'Fits your living space', 'Matches your activity level'],
      aiSummary: `The ${b.name} is an excellent match for your lifestyle. ${b.tagline}.`,
      rank: i + 1,
    }));
    return res.json({ recommendations: mockRecs, intro: 'Here are your top cat breed matches based on your answers!' });
  }

  try {
    const { answers } = req.body as { answers: Record<string, unknown> };

    // First search for matching breeds using our MCP tools
    const matchingBreeds = searchCatBreeds({
      livingSpace: answers.livingSpace as string,
      activityLevel: answers.activityLevel as string,
      allergySensitivity: answers.allergySensitivity as string,
      affectionPreference: answers.affectionPreference as string,
      hasKids: (answers.household as string[] | undefined)?.includes('kids'),
      hasPets: (answers.household as string[] | undefined)?.includes('other-pets'),
      limit: 10,
    });

    const breedContext = matchingBreeds.map((b) =>
      `${b.name} (ID: ${b.id}): energy=${b.traits.energy}/10, grooming=${b.traits.grooming}/10, sociability=${b.traits.sociability}/10, allergenLevel=${b.traits.allergenLevel}/5, childFriendly=${b.traits.childFriendly}/10, dogFriendly=${b.traits.dogFriendly}/10. Tags: ${b.tags.join(', ')}.`
    ).join('\n');

    const prompt = `You are TinyCats AI, an expert cat breed matchmaker.
    
User quiz answers:
- Living space: ${String(answers.livingSpace)}
- Activity level: ${String(answers.activityLevel)}
- Allergy sensitivity: ${String(answers.allergySensitivity)}
- Cat experience: ${String(answers.catExperience)}
- Affection preference: ${String(answers.affectionPreference)}
- Household: ${Array.isArray(answers.household) ? answers.household.join(', ') : String(answers.household)}
- Additional notes: ${String(answers.freeText ?? 'None')}

Available cat breeds matching initial criteria:
${breedContext}

Based on the user's quiz answers, select the TOP 5 most suitable cat breeds and respond ONLY with valid JSON in this exact format:
{
  "recommendations": [
    {
      "breedId": "string",
      "breedName": "string", 
      "matchScore": number,
      "matchReasons": ["reason1", "reason2", "reason3"],
      "aiSummary": "1-2 sentence personalized explanation",
      "rank": number
    }
  ],
  "intro": "A warm 1-sentence opening message for the chat panel"
}`;

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const result = await model.generateContent(prompt);
    const text = result.response.text();

    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('Invalid JSON from Gemini');

    const parsed = JSON.parse(jsonMatch[0]) as Record<string, unknown>;
    return res.json(parsed);
  } catch (err) {
    console.error('Recommend error:', err);
    // Return fallback mock data on error
    const mockRecs = BREEDS.slice(0, 5).map((b, i) => ({
      breedId: b.id,
      breedName: b.name,
      matchScore: 90 - i * 7,
      matchReasons: ['Good temperament match', 'Suits your lifestyle', 'Fits your home environment'],
      aiSummary: `${b.name}: ${b.tagline}`,
      rank: i + 1,
    }));
    return res.json({ recommendations: mockRecs, intro: 'Here are your personalized cat breed recommendations!' });
  }
});

// ─── Route: Chat ──────────────────────────────────────────────────────────────
app.post('/api/chat', async (req, res) => {
  if (!GEMINI_API_KEY) {
    return res.json({ reply: "I'm TinyCats AI! I'd love to help you find your perfect cat, but the AI service needs a GEMINI_API_KEY configured on the server. Please add your key to the .env file." });
  }

  try {
    const { messages, userMessage, context } = req.body as {
      messages: Array<{ role: string; content: string }>;
      userMessage: string;
      context?: { quizAnswers?: Record<string, unknown>; topBreedIds?: string[] };
    };

    const topBreeds = context?.topBreedIds
      ?.map((id) => BREEDS.find((b) => b.id === id))
      .filter(Boolean)
      .map((b) => `${b!.name}: ${b!.tagline}`)
      .join(', ');

    const systemPrompt = `You are TinyCats AI, a warm, knowledgeable cat breed expert. 
Help users find their perfect cat breed companion. Be friendly, concise, and helpful.
${context?.quizAnswers ? `User context: ${JSON.stringify(context.quizAnswers)}` : ''}
${topBreeds ? `User's top breed matches: ${topBreeds}` : ''}
Keep responses under 150 words. Use markdown sparingly.`;

    const history = messages.slice(0, -1).map((m) => ({
      role: m.role === 'user' ? 'user' : 'model',
      parts: [{ text: m.content }],
    }));

    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      systemInstruction: systemPrompt,
    });

    const chat = model.startChat({ history });
    const result = await chat.sendMessage(userMessage);
    const reply = result.response.text();

    return res.json({ reply });
  } catch (err) {
    console.error('Chat error:', err);
    return res.status(500).json({ error: 'Chat service unavailable', reply: "I'm having trouble connecting right now. Please try again in a moment." });
  }
});

// ─── Start ───────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`🐱 TinyCats server running on http://localhost:${PORT}`);
  if (!GEMINI_API_KEY) {
    console.warn('⚠️  GEMINI_API_KEY not set — AI features will use mock data');
  }
});

export default app;
