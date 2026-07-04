import React, { useEffect } from 'react';
import { QuizWizard } from '@/features/quiz/QuizWizard';
import { useAppDispatch } from '@/app/hooks';
import { startQuiz } from '@/features/quiz/quizSlice';
import { fetchBreeds } from '@/features/breeds/breedsSlice';

export const QuizPage: React.FC = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(startQuiz());
    dispatch(fetchBreeds()); // Make sure breeds are loaded for the live matches sidebar
  }, [dispatch]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 text-left">
      <div className="mb-8">
        <h1 className="font-display font-black text-3xl sm:text-5xl text-stone-900 tracking-tight mb-2">
          Purrfect Partner Quiz
        </h1>
        <p className="text-stone-500 text-sm max-w-xl">
          Answer a few questions about your living space, allergy sensitivities, and social habits, and we'll use Gemini AI to find your ideal cat matches.
        </p>
      </div>

      <QuizWizard />
    </div>
  );
};
