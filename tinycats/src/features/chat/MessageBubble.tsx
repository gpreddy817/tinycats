import { cn } from '@/lib/utils';
import type { Message } from '@/types/chat';

interface MessageBubbleProps {
  message: Message;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === 'user';
  const isSystem = message.role === 'system';

  if (isSystem) return null;

  return (
    <div
      className={cn(
        'flex items-end gap-2 animate-slide-up',
        isUser ? 'justify-end' : 'justify-start'
      )}
    >
      {!isUser && (
        <div
          className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
          style={{ backgroundColor: 'var(--color-primary)', color: 'white' }}
          aria-hidden="true"
        >
          🐾
        </div>
      )}

      <div
        className={cn(
          'max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed',
          isUser
            ? 'rounded-br-sm'
            : 'rounded-bl-sm'
        )}
        style={
          isUser
            ? {
                backgroundColor: 'var(--color-primary)',
                color: 'white',
              }
            : {
                backgroundColor: 'var(--color-primary-light)',
                color: 'var(--color-text-primary)',
              }
        }
      >
        <span style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
          {message.content}
        </span>
        {message.isStreaming && (
          <span
            className="animate-blink ml-0.5 font-bold"
            style={{ color: isUser ? 'white' : 'var(--color-primary)' }}
            aria-hidden="true"
          >
            _
          </span>
        )}
      </div>

      {isUser && (
        <div
          className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm"
          style={{ backgroundColor: 'var(--color-border)', color: 'var(--color-text-secondary)' }}
          aria-hidden="true"
        >
          👤
        </div>
      )}
    </div>
  );
}

export default MessageBubble;
