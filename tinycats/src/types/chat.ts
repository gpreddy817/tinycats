import type { QuizAnswers } from '@/types/quiz';

export type MessageRole = 'user' | 'assistant' | 'system';

export interface Message {
  id: string;                   // crypto.randomUUID()
  role: MessageRole;
  content: string;
  timestamp: string;            // ISO 8601
  isStreaming?: boolean;        // true while chunk is being appended
}

export interface ChatContext {
  quizAnswers: QuizAnswers;
  topRecommendationIds: string[];
}

export interface ChatState {
  messages: Message[];
  isStreaming: boolean;
  error: string | null;
  sessionId: string;
  context: ChatContext | null;
}
