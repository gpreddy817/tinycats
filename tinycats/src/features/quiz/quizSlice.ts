import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { QuizState, QuizAnswers } from '@/types/quiz';
import type { RootState } from '@/app/store';

const initialState: QuizState = {
  currentStep: 0,
  totalSteps: 7,
  answers: {},
  completed: false,
  startedAt: null,
  completedAt: null,
};

const quizSlice = createSlice({
  name: 'quiz',
  initialState,
  reducers: {
    startQuiz(state) {
      state.startedAt = new Date().toISOString();
    },
    setAnswer(
      state,
      action: PayloadAction<{ key: keyof QuizAnswers; value: QuizAnswers[keyof QuizAnswers] }>
    ) {
      (state.answers as Record<string, unknown>)[action.payload.key] = action.payload.value;
    },
    nextStep(state) {
      if (state.currentStep < state.totalSteps - 1) {
        state.currentStep++;
      }
    },
    prevStep(state) {
      if (state.currentStep > 0) {
        state.currentStep--;
      }
    },
    completeQuiz(state) {
      state.completed = true;
      state.completedAt = new Date().toISOString();
    },
    resetQuiz() {
      return initialState;
    },
  },
});

export const { startQuiz, setAnswer, nextStep, prevStep, completeQuiz, resetQuiz } =
  quizSlice.actions;

// Selectors
export const selectCurrentStep = (state: RootState) => state.quiz.currentStep;
export const selectTotalSteps = (state: RootState) => state.quiz.totalSteps;
export const selectQuizAnswers = (state: RootState) => state.quiz.answers;
export const selectQuizCompleted = (state: RootState) => state.quiz.completed;
export const selectQuizStartedAt = (state: RootState) => state.quiz.startedAt;

export default quizSlice.reducer;
