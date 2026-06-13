import { useRef, useEffect, useState, type KeyboardEvent } from 'react';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import {
  selectMessages,
  selectIsStreaming,
  selectChatError,
  clearError,
  addStreamingMessage,
  addMessage,
  appendToken,
  finishStreaming,
  setError,
} from '@/features/chat/chatSlice';
import { streamChatReply } from '@/services/geminiService';
import { MessageBubble } from '@/features/chat/MessageBubble';
import { Button } from '@/components/ui/button';
import { Send, AlertCircle, RefreshCw, Sparkles } from 'lucide-react';

export function ChatPanel() {
  const dispatch = useAppDispatch();
  const messages = useAppSelector(selectMessages);
  const isStreaming = useAppSelector(selectIsStreaming);
  const chatError = useAppSelector(selectChatError);

  const [inputValue, setInputValue] = useState('');
  const [lastUserText, setLastUserText] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll to latest message
  useEffect(() => {
    const el = scrollRef.current;
    if (el) {
      el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
    }
  }, [messages]);

  const handleSend = async (userText?: string) => {
    const text = (userText ?? inputValue).trim();
    if (!text || isStreaming) return;

    // Sanitize
    const sanitized = text.replace(/<[^>]*>/g, '');

    setInputValue('');
    setLastUserText(sanitized);
    dispatch(clearError());

    dispatch(addMessage({ role: 'user', content: sanitized }));

    const aiMsgId = crypto.randomUUID();
    dispatch(addStreamingMessage({ id: aiMsgId }));

    try {
      const generator = streamChatReply(messages, sanitized);
      for await (const token of generator) {
        dispatch(appendToken({ id: aiMsgId, token }));
      }
      dispatch(finishStreaming(aiMsgId));
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : 'Failed to reach AI';
      dispatch(setError(errMsg));
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      void handleSend();
    }
  };

  const handleRetry = () => {
    dispatch(clearError());
    void handleSend(lastUserText);
  };

  const visibleMessages = messages.filter((m) => m.role !== 'system');

  return (
    <div
      className="flex flex-col rounded-2xl overflow-hidden border"
      style={{
        backgroundColor: 'var(--color-card)',
        borderColor: 'var(--color-border)',
        height: '100%',
        minHeight: '480px',
      }}
    >
      {/* Header */}
      <div
        className="flex items-center gap-2 px-4 py-3 border-b"
        style={{
          borderColor: 'var(--color-border)',
          backgroundColor: 'var(--color-primary-light)',
        }}
      >
        <Sparkles size={16} style={{ color: 'var(--color-primary)' }} />
        <span className="font-semibold text-sm" style={{ color: 'var(--color-primary)' }}>
          TinyCats AI
        </span>
        {isStreaming && (
          <span className="ml-auto text-xs" style={{ color: 'var(--color-text-secondary)' }}>
            Thinking…
          </span>
        )}
      </div>

      {/* Message History */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 flex flex-col gap-4"
        aria-live="polite"
        aria-label="Chat messages"
        aria-relevant="additions"
        style={{ minHeight: 0 }}
      >
        {visibleMessages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full gap-3 text-center px-4">
            <span className="text-4xl">🐱</span>
            <p className="text-sm font-medium" style={{ color: 'var(--color-text-secondary)' }}>
              Complete the quiz to get your personalized recommendations, then ask me anything!
            </p>
          </div>
        )}
        {visibleMessages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} />
        ))}

        {/* Error state */}
        {chatError && (
          <div
            className="flex items-start gap-3 p-3 rounded-xl"
            style={{
              backgroundColor: '#FEF2F2',
              border: '1px solid #FECACA',
            }}
            role="alert"
          >
            <AlertCircle size={16} style={{ color: 'var(--color-danger)', flexShrink: 0, marginTop: '2px' }} />
            <div className="flex-1 min-w-0">
              <p className="text-sm" style={{ color: '#991B1B' }}>
                Couldn't reach AI, please try again.
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRetry}
              id="chat-retry-btn"
              aria-label="Retry last message"
              className="flex-shrink-0"
            >
              <RefreshCw size={14} />
              Retry
            </Button>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div
        className="border-t p-3 flex items-end gap-2"
        style={{ borderColor: 'var(--color-border)' }}
      >
        <textarea
          ref={inputRef}
          id="chat-input"
          aria-label="Ask a question about cat breeds"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask about a breed, or tell me more about your lifestyle…"
          disabled={isStreaming}
          rows={1}
          className="flex-1 resize-none rounded-xl border px-4 py-3 text-sm focus:outline-none"
          style={{
            borderColor: 'var(--color-border)',
            backgroundColor: 'var(--color-surface)',
            color: 'var(--color-text-primary)',
            fontFamily: 'var(--font-sans)',
            maxHeight: '100px',
            outlineColor: 'var(--color-primary)',
          }}
          maxLength={1000}
        />
        <Button
          id="chat-send-btn"
          variant="default"
          size="icon"
          onClick={() => void handleSend()}
          disabled={!inputValue.trim() || isStreaming}
          aria-label="Send message"
          className="flex-shrink-0 h-10 w-10"
        >
          <Send size={16} />
        </Button>
      </div>
    </div>
  );
}

export default ChatPanel;
