import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '@/app/hooks';
import { selectQuizCompleted, resetQuiz } from '@/features/quiz/quizSlice';
import { fetchBreeds } from '@/features/breeds/breedsSlice';
import { clearRecommendations } from '@/features/recommendations/recommendationsSlice';
import { clearMessages } from '@/features/chat/chatSlice';
import { QuizWizard } from '@/features/quiz/QuizWizard';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function QuizPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const isCompleted = useAppSelector(selectQuizCompleted);

  // Preload breed data in the background so it's ready for results
  useEffect(() => {
    void dispatch(fetchBreeds());
  }, [dispatch]);

  // If quiz was already completed, offer to restart or view results
  if (isCompleted) {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center gap-6 px-4 text-center"
        style={{ backgroundColor: 'var(--color-surface)' }}
      >
        <span className="text-5xl">🐾</span>
        <h2
          className="text-2xl font-bold"
          style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text-primary)' }}
        >
          Quiz already completed!
        </h2>
        <p style={{ color: 'var(--color-text-secondary)' }}>
          Would you like to view your results or start fresh?
        </p>
        <div className="flex gap-3 flex-wrap justify-center">
          <Button id="view-results-btn" variant="default" size="lg" onClick={() => navigate('/results')}>
            View My Results
          </Button>
          <Button
            id="retake-quiz-btn"
            variant="outline"
            size="lg"
            onClick={() => {
              dispatch(resetQuiz());
              dispatch(clearRecommendations());
              dispatch(clearMessages());
            }}
          >
            Retake Quiz
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--color-surface)' }}>
      {/* Top bar */}
      <header className="flex items-center px-4 py-4 max-w-2xl mx-auto">
        <button
          id="quiz-home-btn"
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-sm font-medium"
          style={{ color: 'var(--color-text-secondary)' }}
          aria-label="Go back to home"
        >
          <ArrowLeft size={16} />
          <span
            style={{ fontFamily: 'var(--font-display)', color: 'var(--color-primary)', fontWeight: 700 }}
          >
            TinyCats
          </span>
        </button>
      </header>

      <main className="flex flex-col items-center min-h-[calc(100vh-64px)]">
        <QuizWizard />
      </main>
    </div>
  );
}
