import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import type { Breed } from '@/types/breed';
import type { RootState } from '@/app/store';
import { BREEDS } from '@/data/breedsData';

interface BreedsState {
  entities: Record<string, Breed>;
  ids: string[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  usingFallback: boolean;
  savedBreeds: string[];
  compareList: string[];
}

const initialState: BreedsState = {
  entities: {},
  ids: [],
  status: 'idle',
  usingFallback: false,
  savedBreeds: [],
  compareList: [],
};

export const fetchBreeds = createAsyncThunk('breeds/fetchAll', async () => {
  try {
    const res = await fetch('/api/breeds');
    if (!res.ok) throw new Error('Server unavailable');
    const data = (await res.json()) as { breeds: Breed[] };
    return data.breeds;
  } catch {
    return BREEDS; // fallback
  }
});

export const fetchBreedDetail = createAsyncThunk('breeds/fetchDetail', async (breedId: string) => {
  try {
    const res = await fetch(`/api/breeds/${breedId}`);
    if (!res.ok) throw new Error('Not found');
    return (await res.json()) as Breed;
  } catch {
    const fallback = BREEDS.find((b) => b.id === breedId);
    if (!fallback) throw new Error('Breed not found');
    return fallback;
  }
});

const breedsSlice = createSlice({
  name: 'breeds',
  initialState,
  reducers: {
    toggleSaveBreed(state, action: PayloadAction<string>) {
      const id = action.payload;
      if (state.savedBreeds.includes(id)) {
        state.savedBreeds = state.savedBreeds.filter((b) => b !== id);
      } else {
        state.savedBreeds.push(id);
      }
    },
    addToCompare(state, action: PayloadAction<string>) {
      if (state.compareList.length < 3 && !state.compareList.includes(action.payload)) {
        state.compareList.push(action.payload);
      }
    },
    removeFromCompare(state, action: PayloadAction<string>) {
      state.compareList = state.compareList.filter((id) => id !== action.payload);
    },
    clearCompare(state) {
      state.compareList = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBreeds.pending, (state) => { state.status = 'loading'; })
      .addCase(fetchBreeds.fulfilled, (state, action) => {
        state.status = 'succeeded';
        action.payload.forEach((b) => { state.entities[b.id] = b; });
        state.ids = action.payload.map((b) => b.id);
        state.usingFallback = !navigator.onLine;
      })
      .addCase(fetchBreeds.rejected, (state) => {
        state.status = 'failed';
        state.usingFallback = true;
        BREEDS.forEach((b) => { state.entities[b.id] = b; });
        state.ids = BREEDS.map((b) => b.id);
      })
      .addCase(fetchBreedDetail.fulfilled, (state, action) => {
        const b = action.payload;
        state.entities[b.id] = b;
        if (!state.ids.includes(b.id)) state.ids.push(b.id);
      });
  },
});

export const { toggleSaveBreed, addToCompare, removeFromCompare, clearCompare } = breedsSlice.actions;

export const selectAllBreeds = (s: RootState) => s.breeds.ids.map((id) => s.breeds.entities[id]).filter(Boolean) as Breed[];
export const selectBreedById = (id: string) => (s: RootState) => s.breeds.entities[id];
export const selectBreedsStatus = (s: RootState) => s.breeds.status;
export const selectSavedBreeds = (s: RootState) => s.breeds.savedBreeds;
export const selectCompareList = (s: RootState) => s.breeds.compareList;
export const selectUsingFallback = (s: RootState) => s.breeds.usingFallback;

export default breedsSlice.reducer;
