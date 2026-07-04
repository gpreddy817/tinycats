import type { QuizAnswers } from '@/types/quiz';
import type { BreedRecommendation } from '@/types/recommendations';

export const getRecommendations = async (
  answers: Partial<QuizAnswers>
): Promise<{ recommendations: BreedRecommendation[]; intro: string }> => {
  const res = await fetch('/api/recommend', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ answers }),
  });
  if (!res.ok) {
    throw new Error('Failed to get recommendations from Gemini AI');
  }
  return res.json();
};

export const chatWithGemini = async (
  userMessage: string,
  history: { role: string; content: string }[],
  context: { quizAnswers: any; topRecommendationIds: string[] } | null
): Promise<string> => {
  const res = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      messages: [...history, { role: 'user', content: userMessage }],
      userMessage,
      context,
    }),
  });
  if (!res.ok) {
    throw new Error('Failed to get response from Gemini AI chat');
  }
  const data = await res.json();
  return data.reply;
};
