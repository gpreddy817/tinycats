import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import { streamRecommendations } from '@/services/geminiService';
import { addMessage } from '@/features/chat/chatSlice';
import type { RecommendationsState, BreedRecommendation, GeminiRecommendationResponse } from '@/types/recommendations';
import type { QuizAnswers } from '@/types/quiz';
import type { RootState, AppDispatch } from '@/app/store';

const initialState: RecommendationsState = {
  results: [],
  status: 'idle',
  error: null,
  generatedAt: null,
};

export const fetchRecommendations = createAsyncThunk<
  BreedRecommendation[],
  QuizAnswers,
  { dispatch: AppDispatch; rejectValue: string }
>(
  'recommendations/fetch',
  async (answers, { dispatch, rejectWithValue }) => {
    try {
      // Accumulate the full streamed response — never store generators in state
      let accumulated = '';
      const generator = streamRecommendations(answers);

      for await (const chunk of generator) {
        accumulated += chunk;
      }

      // Strip markdown code fences if Gemini wraps response in them
      const cleaned = accumulated
        .replace(/^```json\s*/i, '')
        .replace(/^```\s*/i, '')
        .replace(/\s*```$/i, '')
        .trim();

      const parsed = JSON.parse(cleaned) as GeminiRecommendationResponse;

      // Dispatch the intro message to chat
      dispatch(
        addMessage({
          role: 'assistant',
          content: parsed.intro,
        })
      );

      // Map to BreedRecommendation with rank
      const results: BreedRecommendation[] = parsed.recommendations.map(
        (rec, index) => ({
          breedId: rec.breedId,
          breedName: formatBreedName(rec.breedId),
          matchScore: rec.matchScore,
          matchReasons: rec.matchReasons,
          aiSummary: rec.aiSummary,
          rank: index + 1,
        })
      );

      return results;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Failed to get recommendations';
      return rejectWithValue(message);
    }
  }
);

function formatBreedName(id: string): string {
  return id
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

const recommendationsSlice = createSlice({
  name: 'recommendations',
  initialState,
  reducers: {
    clearRecommendations() {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRecommendations.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchRecommendations.fulfilled, (state, action: PayloadAction<BreedRecommendation[]>) => {
        state.status = 'succeeded';
        state.results = action.payload;
        state.generatedAt = new Date().toISOString();
      })
      .addCase(fetchRecommendations.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload ?? 'Unknown error';
      });
  },
});

export const { clearRecommendations } = recommendationsSlice.actions;

// Selectors
export const selectRecommendations = (state: RootState) => state.recommendations.results;
export const selectRecommendationsStatus = (state: RootState) => state.recommendations.status;
export const selectRecommendationsError = (state: RootState) => state.recommendations.error;

export default recommendationsSlice.reducer;
