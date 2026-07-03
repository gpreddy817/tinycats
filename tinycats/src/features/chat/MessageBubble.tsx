import React from 'react';
import type { Message } from '@/types/chat';
import { Bot, User } from 'lucide-react';

interface MessageBubbleProps {
  message: Message;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isAssistant = message.role === 'assistant';

  return (
    <div
      className={`flex items-start gap-3 w-full animate-fade-in ${
        isAssistant ? 'justify-start' : 'justify-end'
      }`}
    >
      {/* Icon for Assistant */}
      {isAssistant && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center border border-primary/20">
          <Bot size={16} />
        </div>
      )}

      {/* Bubble text */}
      <div
        className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed shadow-sm ${
          isAssistant
            ? 'bg-stone-100 text-stone-800 rounded-tl-none border border-stone-200/50'
            : 'bg-primary text-white rounded-tr-none'
        }`}
      >
        {message.content ? (
          <p className="whitespace-pre-line">{message.content}</p>
        ) : message.isStreaming ? (
          <div className="flex items-center gap-1 py-1">
            <span className="w-1.5 h-1.5 rounded-full bg-stone-500 animate-bounce" />
            <span className="w-1.5 h-1.5 rounded-full bg-stone-500 animate-bounce [animation-delay:0.2s]" />
            <span className="w-1.5 h-1.5 rounded-full bg-stone-500 animate-bounce [animation-delay:0.4s]" />
          </div>
        ) : null}
      </div>

      {/* Icon for User */}
      {!isAssistant && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-sage/10 text-sage flex items-center justify-center border border-sage/20">
          <User size={16} />
        </div>
      )}
    </div>
  );
};
