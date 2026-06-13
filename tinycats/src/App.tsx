import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAppSelector } from '@/app/hooks';
import { selectQuizCompleted } from '@/features/quiz/quizSlice';
import { selectCompareList } from '@/features/breeds/breedsSlice';

// Lazy-load all pages
const HomePage = lazy(() => import('@/pages/HomePage'));
const QuizPage = lazy(() => import('@/pages/QuizPage'));
const ResultsPage = lazy(() => import('@/pages/ResultsPage'));
const BreedPage = lazy(() => import('@/pages/BreedPage'));
const ComparePage = lazy(() => import('@/pages/ComparePage'));
const BrowsePage = lazy(() => import('@/pages/BrowsePage'));

// Paw spinner loading fallback
function PawSpinner() {
  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ backgroundColor: 'var(--color-surface)' }}
      aria-label="Loading…"
    >
      <div className="flex flex-col items-center gap-3">
        <span className="text-5xl paw-spinner" aria-hidden="true">🐾</span>
        <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
          Loading…
        </p>
      </div>
    </div>
  );
}

// Route guard: /results requires completed quiz
function ProtectedResults() {
  const completed = useAppSelector(selectQuizCompleted);
  return completed ? <ResultsPage /> : <Navigate to="/quiz" replace />;
}

// Route guard: /compare requires at least 1 breed
function ProtectedCompare() {
  const compareList = useAppSelector(selectCompareList);
  return compareList.length > 0 ? <ComparePage /> : <Navigate to="/browse" replace />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<PawSpinner />}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/quiz" element={<QuizPage />} />
          <Route path="/results" element={<ProtectedResults />} />
          <Route path="/breed/:breedId" element={<BreedPage />} />
          <Route path="/compare" element={<ProtectedCompare />} />
          <Route path="/browse" element={<BrowsePage />} />
          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
