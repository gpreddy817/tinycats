import { configureStore } from '@reduxjs/toolkit';
import quizReducer from '@/features/quiz/quizSlice';
import breedsReducer from '@/features/breeds/breedsSlice';
import recommendationsReducer from '@/features/recommendations/recommendationsSlice';
import chatReducer from '@/features/chat/chatSlice';
import { storageGet, storageSet } from '@/utils/storage';

const preloadedState = {
  breeds: {
    entities: {},
    ids: [],
    status: 'idle' as const,
    usingFallback: false,
    savedBreeds: storageGet<string[]>('savedBreeds', []),
    compareList: storageGet<string[]>('compareList', []),
  },
};

export const store = configureStore({
  reducer: {
    quiz: quizReducer,
    breeds: breedsReducer,
    recommendations: recommendationsReducer,
    chat: chatReducer,
  },
  preloadedState,
});

// Sync state slices to localStorage
store.subscribe(() => {
  const state = store.getState();
  storageSet('savedBreeds', state.breeds.savedBreeds);
  storageSet('compareList', state.breeds.compareList);
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
