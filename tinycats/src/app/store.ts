import { configureStore } from '@reduxjs/toolkit';
import quizReducer from '@/features/quiz/quizSlice';
import chatReducer from '@/features/chat/chatSlice';
import breedsReducer, { loadSavedState } from '@/features/breeds/breedsSlice';
import recommendationsReducer from '@/features/recommendations/recommendationsSlice';
import { storageGet, storageSet } from '@/utils/storage';

const savedBreeds = storageGet<string[]>('savedBreeds') ?? [];
const compareList = storageGet<string[]>('compareList') ?? [];

export const store = configureStore({
  reducer: {
    quiz: quizReducer,
    chat: chatReducer,
    breeds: breedsReducer,
    recommendations: recommendationsReducer,
  },
});

// Preload localStorage state into Redux
store.dispatch(loadSavedState({ savedBreeds, compareList }));

// Persist savedBreeds and compareList to localStorage on every change
let prevSavedBreeds: string[] = savedBreeds;
let prevCompareList: string[] = compareList;

store.subscribe(() => {
  const state = store.getState();
  const nextSavedBreeds = state.breeds.savedBreeds;
  const nextCompareList = state.breeds.compareList;

  if (nextSavedBreeds !== prevSavedBreeds) {
    storageSet('savedBreeds', nextSavedBreeds);
    prevSavedBreeds = nextSavedBreeds;
  }
  if (nextCompareList !== prevCompareList) {
    storageSet('compareList', nextCompareList);
    prevCompareList = nextCompareList;
  }

  // Persist last quiz answers when quiz completes
  if (state.quiz.completed && state.quiz.answers) {
    storageSet('lastQuizAnswers', state.quiz.answers);
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
