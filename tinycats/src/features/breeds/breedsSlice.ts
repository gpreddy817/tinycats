import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import { mcpClient } from '@/services/mcpService';
import type { Breed, BreedsState } from '@/types/breed';
import type { RootState } from '@/app/store';
import fallbackData from '@/data/breeds.fallback.json';

const fallbackBreeds = fallbackData as Breed[];

export const fetchBreeds = createAsyncThunk(
  'breeds/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      return await mcpClient.getBreedList();
    } catch (err) {
      console.error('[MCP] fetchBreeds failed, using fallback:', err);
      return rejectWithValue('MCP unavailable');
    }
  }
);

export const fetchBreedDetail = createAsyncThunk(
  'breeds/fetchDetail',
  async (breedId: string, { getState, rejectWithValue }) => {
    const state = getState() as RootState;
    // Return cached breed if already loaded
    const cached = state.breeds.entities[breedId];
    if (cached) return cached;

    try {
      return await mcpClient.getBreedDetail(breedId);
    } catch (err) {
      console.error('[MCP] fetchBreedDetail failed, trying fallback:', err);
      const fallback = fallbackBreeds.find((b) => b.id === breedId);
      if (fallback) return fallback;
      return rejectWithValue(`Breed not found: ${breedId}`);
    }
  }
);

const initialState: BreedsState = {
  entities: {},
  ids: [],
  status: 'idle',
  error: null,
  savedBreeds: [],
  compareList: [],
  usingFallback: false,
};

const breedsSlice = createSlice({
  name: 'breeds',
  initialState,
  reducers: {
    toggleSaveBreed(state, action: PayloadAction<string>) {
      const id = action.payload;
      const idx = state.savedBreeds.indexOf(id);
      if (idx === -1) {
        state.savedBreeds.push(id);
      } else {
        state.savedBreeds.splice(idx, 1);
      }
    },
    addToCompare(state, action: PayloadAction<string>) {
      if (
        state.compareList.length < 3 &&
        !state.compareList.includes(action.payload)
      ) {
        state.compareList.push(action.payload);
      }
    },
    removeFromCompare(state, action: PayloadAction<string>) {
      state.compareList = state.compareList.filter((id) => id !== action.payload);
    },
    loadSavedState(
      state,
      action: PayloadAction<{ savedBreeds: string[]; compareList: string[] }>
    ) {
      state.savedBreeds = action.payload.savedBreeds;
      state.compareList = action.payload.compareList;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchBreeds
      .addCase(fetchBreeds.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchBreeds.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.usingFallback = false;
        action.payload.forEach((breed) => {
          state.entities[breed.id] = breed;
          if (!state.ids.includes(breed.id)) state.ids.push(breed.id);
        });
      })
      .addCase(fetchBreeds.rejected, (state) => {
        state.status = 'succeeded'; // Still show data — from fallback
        state.usingFallback = true;
        state.error = null;
        // Load fallback breeds
        fallbackBreeds.forEach((breed) => {
          state.entities[breed.id] = breed;
          if (!state.ids.includes(breed.id)) state.ids.push(breed.id);
        });
      })
      // fetchBreedDetail
      .addCase(fetchBreedDetail.fulfilled, (state, action) => {
        const breed = action.payload;
        state.entities[breed.id] = breed;
        if (!state.ids.includes(breed.id)) state.ids.push(breed.id);
      })
      .addCase(fetchBreedDetail.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export const { toggleSaveBreed, addToCompare, removeFromCompare, loadSavedState } =
  breedsSlice.actions;

// Selectors
export const selectAllBreeds = (state: RootState): Breed[] =>
  state.breeds.ids.map((id) => state.breeds.entities[id]).filter((b): b is Breed => !!b);

export const selectBreedById = (id: string) => (state: RootState): Breed | undefined =>
  state.breeds.entities[id];

export const selectBreedsStatus = (state: RootState) => state.breeds.status;
export const selectUsingFallback = (state: RootState) => state.breeds.usingFallback;
export const selectSavedBreeds = (state: RootState) => state.breeds.savedBreeds;
export const selectCompareList = (state: RootState) => state.breeds.compareList;

export const selectCompareBreeds = (state: RootState): Breed[] =>
  state.breeds.compareList
    .map((id) => state.breeds.entities[id])
    .filter((b): b is Breed => !!b);

export default breedsSlice.reducer;
