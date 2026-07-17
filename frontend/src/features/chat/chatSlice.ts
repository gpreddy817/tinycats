import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import type { ChatState, Message, ChatContext } from '@/types/chat';
import type { RootState } from '@/app/store';
import { BREEDS } from '@/data/breedsData';
import { setRecommendations } from '@/features/recommendations/recommendationsSlice';
import type { BreedRecommendation } from '@/types/recommendations';

const initialState: ChatState = {
  messages: [],
  isStreaming: false,
  error: null,
  sessionId: crypto.randomUUID(),
  context: null,
};

export const sendChatMessage = createAsyncThunk(
  'chat/send',
  async (
    { userMessage, context }: { userMessage: string; context: ChatContext | null },
    { getState, dispatch, rejectWithValue }
  ) => {
    const state = getState() as RootState;
    const history = state.chat.messages
      .filter((m) => m.role !== 'system' && !m.isStreaming && m.content.trim() !== '')
      .map((m) => ({
        role: m.role,
        content: m.content,
      }));

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...history, { role: 'user', content: userMessage }],
          userMessage,
          context: context
            ? {
                quizAnswers: context.quizAnswers,
                topBreedIds: context.topRecommendationIds,
              }
            : null,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Chat service error');
      }

      // If recommendations are empty, parse the AI's reply to find mentioned breeds
      const currentRecs = state.recommendations.results;
      if (currentRecs.length === 0) {
        const mentionedBreeds: BreedRecommendation[] = [];
        
        BREEDS.forEach((breed) => {
          const escapedName = breed.name.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
          const regex = new RegExp(`\\b${escapedName}\\b`, 'i');
          if (regex.test(data.reply)) {
            mentionedBreeds.push({
              breedId: breed.id,
              breedName: breed.name,
              matchScore: Math.max(70, 95 - mentionedBreeds.length * 5),
              matchReasons: ['Recommended via AI Assistant Chat'],
              aiSummary: breed.tagline,
              rank: mentionedBreeds.length + 1,
            });
          }
        });

        if (mentionedBreeds.length > 0) {
          dispatch(setRecommendations(mentionedBreeds));
        }
      }

      return data.reply;
    } catch (err) {
      return rejectWithValue((err as Error).message);
    }
  }
);

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    addMessage(state, action: PayloadAction<{ role: Message['role']; content: string }>) {
      state.messages.push({
        id: crypto.randomUUID(),
        role: action.payload.role,
        content: action.payload.content,
        timestamp: new Date().toISOString(),
      });
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
    clearError(state) {
      state.error = null;
    },
    setChatContext(state, action: PayloadAction<ChatContext>) {
      state.context = action.payload;
    },
    clearChat(state) {
      state.messages = [];
      state.error = null;
      state.isStreaming = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendChatMessage.pending, (state, action) => {
        state.isStreaming = true;
        state.error = null;
        // Add user message
        const userMsg = action.meta.arg.userMessage;
        state.messages.push({
          id: crypto.randomUUID(),
          role: 'user',
          content: userMsg,
          timestamp: new Date().toISOString(),
        });
        // Add streaming placeholder
        state.messages.push({
          id: 'streaming-' + Date.now(),
          role: 'assistant',
          content: '',
          timestamp: new Date().toISOString(),
          isStreaming: true,
        });
      })
      .addCase(sendChatMessage.fulfilled, (state, action) => {
        state.isStreaming = false;
        const idx = state.messages.findLastIndex((m) => m.isStreaming);
        if (idx !== -1) {
          state.messages[idx].content = action.payload;
          state.messages[idx].isStreaming = false;
        }
      })
      .addCase(sendChatMessage.rejected, (state, action) => {
        state.isStreaming = false;
        const idx = state.messages.findLastIndex((m) => m.isStreaming);
        if (idx !== -1) {
          state.messages[idx].content = "I couldn't connect right now. Please try again.";
          state.messages[idx].isStreaming = false;
        }
        state.error = action.payload as string;
      });
  },
});

export const { addMessage, setError, clearError, setChatContext, clearChat } = chatSlice.actions;

export const selectMessages = (s: RootState) => s.chat.messages;
export const selectIsStreaming = (s: RootState) => s.chat.isStreaming;
export const selectChatError = (s: RootState) => s.chat.error;
export const selectChatContext = (s: RootState) => s.chat.context;

export default chatSlice.reducer;
