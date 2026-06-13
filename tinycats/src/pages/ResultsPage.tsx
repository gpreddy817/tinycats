import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '@/app/hooks';
import { selectQuizCompleted } from '@/features/quiz/quizSlice';
import { selectUsingFallback, fetchBreeds, selectBreedsStatus } from '@/features/breeds/breedsSlice';
import { buildShareUrl } from '@/utils/shareUtils';
import { selectRecommendations } from '@/features/recommendations/recommendationsSlice';
import { selectQuizAnswers } from '@/features/quiz/quizSlice';
import { RecommendationList } from '@/features/recommendations/RecommendationList';
import { ChatPanel } from '@/features/chat/ChatPanel';
import { Button } from '@/components/ui/button';
import { Share2, ChevronDown, ChevronUp, GitCompare } from 'lucide-react';
import { selectCompareList } from '@/features/breeds/breedsSlice';
import type { QuizAnswers } from '@/types/quiz';

export default function ResultsPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const isCompleted = useAppSelector(selectQuizCompleted);
  const usingFallback = useAppSelector(selectUsingFallback);
  const recommendations = useAppSelector(selectRecommendations);
  const answers = useAppSelector(selectQuizAnswers);
  const compareList = useAppSelector(selectCompareList);
  const breedsStatus = useAppSelector(selectBreedsStatus);
  const [chatOpen, setChatOpen] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);

  // Guard: redirect if quiz not completed
  useEffect(() => {
    if (!isCompleted) {
      navigate('/quiz', { replace: true });
    }
  }, [isCompleted, navigate]);

  // Ensure breeds are loaded (for card renders)
  useEffect(() => {
    if (breedsStatus === 'idle') {
      void dispatch(fetchBreeds());
    }
  }, [dispatch, breedsStatus]);

  const handleShare = async () => {
    const url = buildShareUrl(answers as QuizAnswers, recommendations);
    try {
      await navigator.clipboard.writeText(url);
      setShareCopied(true);
      setTimeout(() => setShareCopied(false), 2000);
    } catch {
      // Fallback: open prompt
      window.prompt('Copy this share link:', url);
    }
  };

  if (!isCompleted) return null;

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--color-surface)' }}>
      {/* Offline Fallback Banner */}
      {usingFallback && (
        <div
          role="status"
          aria-live="polite"
          className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-center"
          style={{
            backgroundColor: '#FFFBEB',
            borderBottom: '1px solid #FDE68A',
            color: '#92400E',
          }}
        >
          📡 Using offline breed data — some breeds may not be available
        </div>
      )}

      {/* Page Header */}
      <header
        className="px-4 py-4 border-b flex items-center justify-between flex-wrap gap-3"
        style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-card)' }}
      >
        <div className="flex items-center gap-3">
          <button
            id="results-home-btn"
            onClick={() => navigate('/')}
            className="text-xl font-bold"
            style={{ fontFamily: 'var(--font-display)', color: 'var(--color-primary)' }}
          >
            🐾 TinyCats
          </button>
          <span
            className="text-sm hidden sm:inline"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            Your Results
          </span>
        </div>

        <div className="flex items-center gap-2">
          {compareList.length >= 2 && (
            <Button
              id="go-compare-btn"
              variant="secondary"
              size="sm"
              onClick={() => navigate('/compare')}
            >
              <GitCompare size={14} />
              Compare ({compareList.length})
            </Button>
          )}
          <Button
            id="share-results-btn"
            variant="outline"
            size="sm"
            onClick={() => void handleShare()}
          >
            <Share2 size={14} />
            {shareCopied ? 'Copied!' : 'Share'}
          </Button>
          <Button
            id="results-browse-btn"
            variant="ghost"
            size="sm"
            onClick={() => navigate('/browse')}
          >
            Browse All
          </Button>
        </div>
      </header>

      {/* Desktop: 2-column layout; Mobile: stacked */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="lg:grid lg:grid-cols-5 lg:gap-8">
          {/* Recommendations — 60% */}
          <main className="lg:col-span-3">
            <RecommendationList />
          </main>

          {/* Chat Panel — 40%, sticky desktop */}
          <aside
            className="lg:col-span-2 mt-6 lg:mt-0"
            style={{ position: 'relative' }}
          >
            {/* Mobile: collapsible chat */}
            <div className="lg:hidden mb-4">
              <button
                id="toggle-chat-mobile-btn"
                onClick={() => setChatOpen((o) => !o)}
                className="flex items-center justify-between w-full p-4 rounded-xl border text-sm font-semibold"
                style={{
                  backgroundColor: 'var(--color-primary-light)',
                  borderColor: 'var(--color-primary)',
                  color: 'var(--color-primary)',
                }}
                aria-expanded={chatOpen}
                aria-controls="chat-panel-mobile"
              >
                <span>💬 Chat with TinyCats AI</span>
                {chatOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>
            </div>

            {/* Mobile chat panel */}
            {chatOpen && (
              <div id="chat-panel-mobile" className="lg:hidden mb-6" style={{ height: '480px' }}>
                <ChatPanel />
              </div>
            )}

            {/* Desktop chat panel — sticky */}
            <div
              className="hidden lg:block"
              style={{
                position: 'sticky',
                top: '24px',
                height: 'calc(100vh - 120px)',
              }}
            >
              <ChatPanel />
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
