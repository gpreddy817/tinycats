import { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/layout/Navbar';
import { Cat } from 'lucide-react';

// Lazy load pages
const HomePage = lazy(() => import('./pages/HomePage').then(m => ({ default: m.HomePage })));
const QuizPage = lazy(() => import('./pages/QuizPage').then(m => ({ default: m.QuizPage })));
const ResultsPage = lazy(() => import('./pages/ResultsPage').then(m => ({ default: m.ResultsPage })));
const BreedPage = lazy(() => import('./pages/BreedPage').then(m => ({ default: m.BreedPage })));
const ComparePage = lazy(() => import('./pages/ComparePage').then(m => ({ default: m.ComparePage })));
const BrowsePage = lazy(() => import('./pages/BrowsePage').then(m => ({ default: m.BrowsePage })));

// Spinning loading fallback
const LoadingFallback = () => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-surface-bg text-stone-500">
    <Cat className="animate-bounce text-primary mb-3" size={40} />
    <span className="text-sm font-semibold tracking-wider animate-pulse">Loading TinyCats...</span>
  </div>
);

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-surface-bg antialiased text-stone-700">
        {/* Navigation */}
        <Navbar />

        {/* Main Content Spacer for fixed Navbar */}
        <main className="flex-grow pt-24 pb-12 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8">
          <Suspense fallback={<LoadingFallback />}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/quiz" element={<QuizPage />} />
              <Route path="/results" element={<ResultsPage />} />
              <Route path="/breed/:id" element={<BreedPage />} />
              <Route path="/compare" element={<ComparePage />} />
              <Route path="/browse" element={<BrowsePage />} />
            </Routes>
          </Suspense>
        </main>

        {/* Premium Footer */}
        <footer className="border-t border-stone-200/60 bg-white py-12 text-stone-400 text-xs">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2">
              <Cat size={20} className="text-primary" />
              <span className="font-display font-extrabold text-sm text-stone-800">
                Tiny<span className="text-primary-container">Cats</span>
              </span>
            </div>
            <p className="text-center sm:text-left">
              &copy; {new Date().getFullYear()} TinyCats breed recommender app. Powered by Gemini AI.
            </p>
            <div className="flex gap-4">
              <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
            </div>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;
