import type { QuizAnswers } from '@/types/quiz';

export const encodeQuizAnswers = (answers: QuizAnswers): string => {
  try {
    const jsonStr = JSON.stringify(answers);
    return btoa(encodeURIComponent(jsonStr));
  } catch (error) {
    console.error('Error encoding quiz answers:', error);
    return '';
  }
};

export const decodeQuizAnswers = (encoded: string): QuizAnswers | null => {
  try {
    const jsonStr = decodeURIComponent(atob(encoded));
    return JSON.parse(jsonStr) as QuizAnswers;
  } catch (error) {
    console.error('Error decoding quiz answers:', error);
    return null;
  }
};
