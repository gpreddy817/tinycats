import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { ChatState, Message, ChatContext } from '@/types/chat';
import type { RootState } from '@/app/store';

const initialState: ChatState = {
  messages: [],
  isStreaming: false,
  error: null,
  sessionId: crypto.randomUUID(),
  context: null,
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    addMessage(
      state,
      action: PayloadAction<Omit<Message, 'id' | 'timestamp'>>
    ) {
      state.messages.push({
        ...action.payload,
        id: crypto.randomUUID(),
        timestamp: new Date().toISOString(),
      });
    },
    /** Adds an empty AI message shell with a pre-generated id and marks it as streaming. */
    addStreamingMessage(state, action: PayloadAction<{ id: string }>) {
      state.isStreaming = true;
      state.messages.push({
        id: action.payload.id,
        role: 'assistant',
        content: '',
        timestamp: new Date().toISOString(),
        isStreaming: true,
      });
    },
    startStreaming(state, action: PayloadAction<string /* message id */>) {
      state.isStreaming = true;
      const msg = state.messages.find((m) => m.id === action.payload);
      if (msg) msg.isStreaming = true;
    },
    appendToken(state, action: PayloadAction<{ id: string; token: string }>) {
      const msg = state.messages.find((m) => m.id === action.payload.id);
      if (msg) msg.content += action.payload.token;
    },
    finishStreaming(state, action: PayloadAction<string /* message id */>) {
      state.isStreaming = false;
      const msg = state.messages.find((m) => m.id === action.payload);
      if (msg) msg.isStreaming = false;
    },
    setError(state, action: PayloadAction<string>) {
      state.error = action.payload;
      state.isStreaming = false;
    },
    clearError(state) {
      state.error = null;
    },
    setChatContext(state, action: PayloadAction<ChatContext>) {
      state.context = action.payload;
    },
    clearMessages(state) {
      state.messages = [];
      state.error = null;
      state.isStreaming = false;
    },
  },
});

export const {
  addMessage,
  addStreamingMessage,
  startStreaming,
  appendToken,
  finishStreaming,
  setError,
  clearError,
  setChatContext,
  clearMessages,
} = chatSlice.actions;

// Selectors
export const selectMessages = (state: RootState) => state.chat.messages;
export const selectIsStreaming = (state: RootState) => state.chat.isStreaming;
export const selectChatError = (state: RootState) => state.chat.error;
export const selectChatContext = (state: RootState) => state.chat.context;
export const selectSessionId = (state: RootState) => state.chat.sessionId;

export default chatSlice.reducer;
