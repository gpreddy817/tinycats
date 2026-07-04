import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { QuizState, QuizAnswers } from '@/types/quiz';
import type { RootState } from '@/app/store';

const TOTAL_STEPS = 7;

const initialState: QuizState = {
  currentStep: 0,
  totalSteps: TOTAL_STEPS,
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
      if (!state.startedAt) {
        state.startedAt = new Date().toISOString();
      }
    },
    setAnswer(state, action: PayloadAction<{ key: keyof QuizAnswers; value: QuizAnswers[keyof QuizAnswers] }>) {
      (state.answers as Record<string, unknown>)[action.payload.key] = action.payload.value;
    },
    nextStep(state) {
      if (state.currentStep < state.totalSteps - 1) {
        state.currentStep += 1;
      }
    },
    prevStep(state) {
      if (state.currentStep > 0) {
        state.currentStep -= 1;
      }
    },
    completeQuiz(state) {
      state.completed = true;
      state.completedAt = new Date().toISOString();
    },
    resetQuiz() {
      return { ...initialState };
    },
  },
});

export const { startQuiz, setAnswer, nextStep, prevStep, completeQuiz, resetQuiz } = quizSlice.actions;

export const selectCurrentStep = (s: RootState) => s.quiz.currentStep;
export const selectTotalSteps = (s: RootState) => s.quiz.totalSteps;
export const selectQuizAnswers = (s: RootState) => s.quiz.answers;
export const selectQuizCompleted = (s: RootState) => s.quiz.completed;

export default quizSlice.reducer;
