import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Sparkles, BookOpen } from 'lucide-react';

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: 'var(--color-surface)' }}
    >
      {/* Nav */}
      <header className="flex items-center justify-between px-6 py-5 max-w-6xl mx-auto w-full">
        <div className="flex items-center gap-2">
          <span className="text-2xl" aria-hidden="true">🐾</span>
          <span
            className="text-xl font-bold"
            style={{ fontFamily: 'var(--font-display)', color: 'var(--color-primary)' }}
          >
            TinyCats
          </span>
        </div>
        <nav>
          <Button id="nav-browse-btn" variant="ghost" size="sm" onClick={() => navigate('/browse')}>
            Browse All
          </Button>
        </nav>
      </header>

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-16 text-center">
        <div className="max-w-2xl mx-auto animate-slide-up">
          {/* Wordmark */}
          <div className="mb-6">
            <span className="text-6xl" aria-hidden="true">🐱</span>
          </div>
          <h1
            className="text-5xl sm:text-6xl font-bold leading-tight mb-4"
            style={{
              fontFamily: 'var(--font-display)',
              color: 'var(--color-text-primary)',
            }}
          >
            TinyCats
          </h1>
          <p
            className="text-xl sm:text-2xl mb-3 font-medium"
            style={{
              fontFamily: 'var(--font-display)',
              color: 'var(--color-primary)',
              fontStyle: 'italic',
            }}
          >
            Find the cat that fits your life.
          </p>
          <p
            className="text-base sm:text-lg mb-10 max-w-lg mx-auto leading-relaxed"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            Answer a short quiz and let AI match you with your perfect cat breed — personalized to your lifestyle, home, and heart.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              id="hero-start-quiz-btn"
              variant="default"
              size="xl"
              onClick={() => navigate('/quiz')}
              className="w-full sm:w-auto text-base"
            >
              <Sparkles size={20} />
              Find My Breed
            </Button>
            <Button
              id="hero-browse-btn"
              variant="outline"
              size="xl"
              onClick={() => navigate('/browse')}
              className="w-full sm:w-auto text-base"
            >
              <BookOpen size={20} />
              Browse All Breeds
            </Button>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto mt-20 text-left">
          {[
            {
              emoji: '🧠',
              title: 'AI-Powered Matching',
              desc: 'Google Gemini analyzes your personality and lifestyle to find your ideal feline companion.',
            },
            {
              emoji: '📊',
              title: 'Deep Breed Insights',
              desc: 'Detailed trait scores, care guides, and adoption links for every breed.',
            },
            {
              emoji: '💬',
              title: 'Ask Follow-up Questions',
              desc: 'Chat with TinyCats AI to dig deeper into any breed or refine your recommendations.',
            },
          ].map(({ emoji, title, desc }) => (
            <div
              key={title}
              className="rounded-2xl p-6 border"
              style={{
                backgroundColor: 'var(--color-card)',
                borderColor: 'var(--color-border)',
              }}
            >
              <div className="text-3xl mb-3" aria-hidden="true">{emoji}</div>
              <h3
                className="font-semibold mb-2"
                style={{ color: 'var(--color-text-primary)', fontFamily: 'var(--font-display)' }}
              >
                {title}
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
                {desc}
              </p>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer
        className="text-center py-6 text-xs"
        style={{ color: 'var(--color-text-secondary)' }}
      >
        TinyCats © 2025 — Built with Google Gemini AI 🐾
      </footer>
    </div>
  );
}
