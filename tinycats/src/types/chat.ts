import type { QuizAnswers } from './quiz';

export type MessageRole = 'user' | 'assistant' | 'system';

export interface Message {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: string;
  isStreaming?: boolean;
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
