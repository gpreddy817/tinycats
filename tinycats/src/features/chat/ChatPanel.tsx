import React, { useState, useRef, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import {
  selectMessages,
  selectIsStreaming,
  selectChatError,
  sendChatMessage,
  clearChat,
  selectChatContext,
} from './chatSlice';
import { MessageBubble } from './MessageBubble';
import { Send, Trash2, HelpCircle } from 'lucide-react';

export const ChatPanel: React.FC = () => {
  const dispatch = useAppDispatch();
  const messages = useAppSelector(selectMessages);
  const isStreaming = useAppSelector(selectIsStreaming);
  const error = useAppSelector(selectChatError);
  const context = useAppSelector(selectChatContext);

  const [input, setInput] = useState('');
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = (textToSend?: string) => {
    const finalMsg = (textToSend || input).trim();
    if (!finalMsg || isStreaming) return;

    dispatch(sendChatMessage({ userMessage: finalMsg, context }));
    setInput('');
  };

  const handleClear = () => {
    if (window.confirm('Clear your chat history?')) {
      dispatch(clearChat());
    }
  };

  const suggestions = [
    'Which of these is best for kids?',
    'Are any of these hypoallergenic?',
    'What is their typical lifespan?',
  ];

  return (
    <div className="flex flex-col h-full bg-white rounded-3xl shadow-premium border border-stone-100 overflow-hidden">
      {/* Chat Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-stone-100 bg-stone-50/50">
        <div>
          <h3 className="font-display font-bold text-base text-stone-900 flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-sage animate-pulse" />
            <span>TinyCats AI Assistant</span>
          </h3>
          <p className="text-[10px] text-stone-500">Ask about breed matches, care guides, and diets</p>
        </div>
        
        {messages.length > 0 && (
          <button
            onClick={handleClear}
            className="text-stone-400 hover:text-primary transition-colors p-1.5 hover:bg-stone-100 rounded-lg cursor-pointer"
            title="Clear Chat"
          >
            <Trash2 size={16} />
          </button>
        )}
      </div>

      {/* Messages List */}
      <div className="flex-grow overflow-y-auto p-6 space-y-4 no-scrollbar min-h-[300px]">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center px-4 space-y-4 py-8">
            <div className="w-12 h-12 bg-primary/5 text-primary rounded-2xl flex items-center justify-center border border-primary/10">
              <HelpCircle size={24} />
            </div>
            <div className="max-w-xs">
              <h4 className="font-semibold text-stone-800 text-sm mb-1">Ask anything about your matches</h4>
              <p className="text-xs text-stone-500 leading-normal">
                Ask about grooming needs, health risks, kid friendliness, or compare their temperaments.
              </p>
            </div>

            {/* Suggestions list */}
            <div className="pt-4 flex flex-col gap-2 w-full max-w-xs">
              {suggestions.map((sug) => (
                <button
                  key={sug}
                  onClick={() => handleSend(sug)}
                  className="text-left text-xs bg-stone-50 hover:bg-stone-100 border border-stone-200/50 rounded-xl px-3 py-2 text-stone-600 font-medium transition-all duration-200 cursor-pointer hover:border-primary/20"
                >
                  {sug}
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((msg) => <MessageBubble key={msg.id} message={msg} />)
        )}
        <div ref={chatBottomRef} />
      </div>

      {/* Error state */}
      {error && (
        <div className="px-6 py-2 bg-primary/10 border-t border-primary/20 text-xs text-primary-hover font-semibold">
          Error: {error}
        </div>
      )}

      {/* Chat Input */}
      <div className="p-4 border-t border-stone-100 bg-white">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            placeholder="Type your question..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isStreaming}
            className="flex-grow text-sm text-stone-700 placeholder-stone-400 bg-stone-50 border border-stone-200 rounded-full px-5 py-3 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all"
          />
          <button
            type="submit"
            disabled={!input.trim() || isStreaming}
            className={`p-3 rounded-full flex items-center justify-center transition-all cursor-pointer ${
              input.trim() && !isStreaming
                ? 'bg-primary text-white hover:bg-primary-hover shadow-md'
                : 'bg-stone-100 text-stone-400'
            }`}
          >
            <Send size={18} />
          </button>
        </form>
      </div>
    </div>
  );
};
