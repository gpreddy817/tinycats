import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { streamChatReply } from '@/services/geminiService';
import {
  addStreamingMessage,
  appendToken,
  finishStreaming,
  setError,
  selectMessages,
  selectIsStreaming,
  addMessage,
} from '@/features/chat/chatSlice';

export function useGemini() {
  const dispatch = useAppDispatch();
  const messages = useAppSelector(selectMessages);
  const isStreaming = useAppSelector(selectIsStreaming);

  const sendMessage = useCallback(
    async (userText: string) => {
      if (isStreaming) return;

      // Sanitize user input — strip HTML tags before sending to Gemini
      const sanitized = userText.replace(/<[^>]*>/g, '').trim();
      if (!sanitized) return;

      // 1. Add user message
      dispatch(addMessage({ role: 'user', content: sanitized }));

      // 2. Generate a stable id for the AI streaming response
      const aiMsgId = crypto.randomUUID();

      // 3. Add the AI message shell (with explicit id) and mark as streaming
      dispatch(addStreamingMessage({ id: aiMsgId }));

      try {
        // 4. Stream tokens into the message
        const generator = streamChatReply(messages, sanitized);
        for await (const token of generator) {
          dispatch(appendToken({ id: aiMsgId, token }));
        }
        dispatch(finishStreaming(aiMsgId));
      } catch (err) {
        const message =
          err instanceof Error ? err.message : 'Failed to reach AI';
        dispatch(setError(message));
      }
    },
    [dispatch, messages, isStreaming]
  );

  return { sendMessage, isStreaming };
}
