import { GoogleGenerativeAI } from '@google/generative-ai';
import type { QuizAnswers } from '@/types/quiz';
import type { Message } from '@/types/chat';
import type { GeminiRecommendationResponse } from '@/types/recommendations';

// TODO: move to serverless proxy before production deploy
// In production, never expose VITE_GEMINI_API_KEY in the browser bundle.
// Proxy all Gemini calls through a Vercel/Cloudflare Edge Function.
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY as string | undefined;

const SYSTEM_PROMPT = `You are TinyCats AI, a warm and knowledgeable cat breed expert.
When recommending breeds, respond ONLY with valid JSON matching this exact schema — no markdown, no preamble, no explanation:
{"recommendations":[{"breedId":"","matchScore":0,"matchReasons":[],"aiSummary":""}],"intro":""}

breedId must be one of these exact IDs: ragdoll, maine-coon, british-shorthair, siamese, bengal, persian, abyssinian, scottish-fold, sphynx, norwegian-forest-cat, burmese, birman, russian-blue, turkish-angora, devon-rex

matchScore is 0–100. matchReasons is 2–4 short bullet strings. aiSummary is 1–2 sentences. intro is a friendly opening message.
Return exactly 5 recommendations sorted by matchScore descending.`;

const MOCK_RESPONSE: GeminiRecommendationResponse = {
  recommendations: [
    {
      breedId: 'ragdoll',
      matchScore: 94,
      matchReasons: ['Perfect for apartment living', 'Gentle and calm temperament', 'Great with families', 'Low exercise demands'],
      aiSummary: 'The Ragdoll is your ideal match — a big, soft, laid-back cat that thrives in apartment life and loves nothing more than being your shadow.',
    },
    {
      breedId: 'british-shorthair',
      matchScore: 87,
      matchReasons: ['Calm and independent', 'Low grooming needs', 'Great for first-time owners', 'Adapts well to indoor life'],
      aiSummary: 'The British Shorthair\'s quiet dignity and easy-going nature make it a perfect fit for your lifestyle — minimal fuss, maximum charm.',
    },
    {
      breedId: 'birman',
      matchScore: 81,
      matchReasons: ['Gentle and affectionate', 'Good with other pets', 'Moderate energy level', 'Beautiful and family-friendly'],
      aiSummary: 'The Birman brings just the right amount of warmth and playfulness without being overwhelming — a truly balanced companion.',
    },
    {
      breedId: 'scottish-fold',
      matchScore: 76,
      matchReasons: ['Adaptable to any home', 'Calm and affectionate', 'Owl-like charm is irresistible', 'Good with children'],
      aiSummary: 'The Scottish Fold\'s gentle, adaptable personality and iconic look make it a wonderful addition to almost any household.',
    },
    {
      breedId: 'russian-blue',
      matchScore: 71,
      matchReasons: ['Very low allergen levels', 'Quiet and loyal', 'Low maintenance coat', 'Devoted to their person'],
      aiSummary: 'The Russian Blue is the perfect choice if you want a calm, hypoallergenic companion who will be quietly devoted to you.',
    },
  ],
  intro: 'Based on your quiz answers, I\'ve found 5 wonderful cat breeds that match your lifestyle! Here are your top picks, ranked by how well they fit your home and personality.',
};

/**
 * Streams breed recommendations from Gemini based on quiz answers.
 * Falls back to a mock response when no API key is configured.
 */
export async function* streamRecommendations(
  answers: QuizAnswers
): AsyncGenerator<string> {
  if (!API_KEY) {
    // Mock mode: yield the full JSON as a single chunk
    yield JSON.stringify(MOCK_RESPONSE);
    return;
  }

  const genAI = new GoogleGenerativeAI(API_KEY);
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  const userPrompt = buildRecommendationPrompt(answers);

  const result = await model.generateContentStream(
    SYSTEM_PROMPT + '\n\n' + userPrompt
  );

  for await (const chunk of result.stream) {
    yield chunk.text();
  }
}

/**
 * Streams a chat reply from Gemini, maintaining conversation history.
 * Falls back to a mock response when no API key is configured.
 */
export async function* streamChatReply(
  messages: Message[],
  userText: string
): AsyncGenerator<string> {
  if (!API_KEY) {
    const mockReplies = [
      'That\'s a great question! Based on your preferences, I\'d say the Ragdoll would be perfect for that situation too. They\'re incredibly adaptable and gentle.',
      'Absolutely! The breed you\'re asking about has some wonderful traits. Let me give you more details about what makes them special.',
      'Great follow-up! Here\'s what you should know about that breed...',
    ];
    const reply = mockReplies[messages.length % mockReplies.length] ?? mockReplies[0]!;
    // Simulate streaming with word-by-word chunks
    const words = reply.split(' ');
    for (const word of words) {
      yield word + ' ';
      await new Promise((resolve) => setTimeout(resolve, 40));
    }
    return;
  }

  const genAI = new GoogleGenerativeAI(API_KEY);
  const model = genAI.getGenerativeModel({
    model: 'gemini-1.5-flash',
    systemInstruction: 'You are TinyCats AI, a warm and knowledgeable cat breed expert. Be friendly, concise, and helpful. Keep responses under 150 words.',
  });

  const history = messages
    .filter((m) => m.role !== 'system')
    .map((m) => ({
      role: m.role === 'assistant' ? ('model' as const) : ('user' as const),
      parts: [{ text: m.content }],
    }));

  const chat = model.startChat({ history });
  const result = await chat.sendMessageStream(userText);

  for await (const chunk of result.stream) {
    yield chunk.text();
  }
}

function buildRecommendationPrompt(answers: QuizAnswers): string {
  return `
User quiz answers:
- Living space: ${answers.livingSpace}
- Activity level: ${answers.activityLevel}
- Allergy sensitivity: ${answers.allergySensitivity}
- Cat experience: ${answers.catExperience}
- Affection preference: ${answers.affectionPreference}
- Household: ${answers.household?.join(', ') ?? 'not specified'}
${answers.freeText ? `- Extra notes: ${answers.freeText}` : ''}

Recommend the top 5 cat breeds. Return JSON only.
  `.trim();
}
