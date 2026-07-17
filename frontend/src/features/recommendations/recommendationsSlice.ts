import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import type { RecommendationsState, BreedRecommendation } from '@/types/recommendations';
import type { QuizAnswers } from '@/types/quiz';
import type { RootState } from '@/app/store';

const initialState: RecommendationsState = {
  results: [],
  status: 'idle',
  error: null,
  generatedAt: null,
};

export const fetchRecommendations = createAsyncThunk(
  'recommendations/fetch',
  async (answers: Partial<QuizAnswers>, { rejectWithValue }) => {
    try {
      const res = await fetch('/api/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers }),
      });
      if (!res.ok) throw new Error('Server error');
      const data = (await res.json()) as {
        recommendations: BreedRecommendation[];
        intro: string;
      };
      return data;
    } catch (err) {
      return rejectWithValue((err as Error).message);
    }
  }
);

const recommendationsSlice = createSlice({
  name: 'recommendations',
  initialState,
  reducers: {
    clearRecommendations(state) {
      state.results = [];
      state.status = 'idle';
      state.error = null;
      state.generatedAt = null;
    },
    setRecommendations(state, action: PayloadAction<BreedRecommendation[]>) {
      state.results = action.payload;
      state.status = 'succeeded';
      state.generatedAt = new Date().toISOString();
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRecommendations.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchRecommendations.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.results = action.payload.recommendations;
        state.generatedAt = new Date().toISOString();
      })
      .addCase(fetchRecommendations.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      });
  },
});

export const { clearRecommendations, setRecommendations } = recommendationsSlice.actions;

export const selectRecommendations = (s: RootState) => s.recommendations.results;
export const selectRecommendationsStatus = (s: RootState) => s.recommendations.status;
export const selectRecommendationsError = (s: RootState) => s.recommendations.error;

export default recommendationsSlice.reducer;
