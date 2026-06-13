import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '@/app/hooks';
import {
  selectRecommendations,
  selectRecommendationsStatus,
  selectRecommendationsError,
} from '@/features/recommendations/recommendationsSlice';
import { selectBreedById } from '@/features/breeds/breedsSlice';
import { BreedCard } from '@/features/breeds/BreedCard';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Sparkles, RefreshCw } from 'lucide-react';
import type { RootState } from '@/app/store';
import { useAppDispatch } from '@/app/hooks';
import { fetchRecommendations } from '@/features/recommendations/recommendationsSlice';
import { selectQuizAnswers } from '@/features/quiz/quizSlice';
import type { QuizAnswers } from '@/types/quiz';

function SkeletonCard() {
  return (
    <div className="rounded-2xl border overflow-hidden" style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-card)' }}>
      <Skeleton style={{ height: '200px', borderRadius: 0 }} />
      <div className="p-5 flex flex-col gap-3">
        <Skeleton style={{ height: '24px', width: '60%' }} />
        <Skeleton style={{ height: '16px', width: '40%' }} />
        <div className="flex gap-2">
          <Skeleton style={{ height: '22px', width: '70px', borderRadius: '9999px' }} />
          <Skeleton style={{ height: '22px', width: '80px', borderRadius: '9999px' }} />
        </div>
        <Skeleton style={{ height: '40px' }} />
        <div className="flex gap-2">
          <Skeleton style={{ height: '36px', flex: 1 }} />
          <Skeleton style={{ height: '36px', width: '100px' }} />
        </div>
      </div>
    </div>
  );
}

function BreedCardWithData({ breedId, ...rest }: { breedId: string } & Omit<Parameters<typeof BreedCard>[0], 'breed'>) {
  const breed = useAppSelector((state: RootState) => selectBreedById(breedId)(state));
  if (!breed) return null;
  return <BreedCard breed={breed} {...rest} />;
}

export function RecommendationList() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const recommendations = useAppSelector(selectRecommendations);
  const status = useAppSelector(selectRecommendationsStatus);
  const error = useAppSelector(selectRecommendationsError);
  const quizAnswers = useAppSelector(selectQuizAnswers);

  const handleRetry = () => {
    if (quizAnswers) {
      void dispatch(fetchRecommendations(quizAnswers as QuizAnswers));
    }
  };

  if (status === 'loading') {
    return (
      <div>
        <div className="flex items-center gap-2 mb-6">
          <Sparkles size={20} style={{ color: 'var(--color-primary)' }} />
          <h2 className="text-lg font-semibold" style={{ color: 'var(--color-text-primary)' }}>
            Finding your perfect matches…
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {[1, 2, 3, 4, 5].map((n) => <SkeletonCard key={n} />)}
        </div>
      </div>
    );
  }

  if (status === 'failed') {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
        <span className="text-5xl">😿</span>
        <h2 className="text-xl font-semibold" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text-primary)' }}>
          Couldn't load recommendations
        </h2>
        <p className="text-sm max-w-sm" style={{ color: 'var(--color-text-secondary)' }}>
          {error ?? 'Something went wrong. Please try again.'}
        </p>
        <Button id="retry-recommendations-btn" variant="default" onClick={handleRetry}>
          <RefreshCw size={16} />
          Try Again
        </Button>
      </div>
    );
  }

  if (status === 'succeeded' && recommendations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
        <span className="text-5xl">🔍</span>
        <h2 className="text-xl font-semibold" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text-primary)' }}>
          Let's broaden your search
        </h2>
        <p className="text-sm max-w-sm" style={{ color: 'var(--color-text-secondary)' }}>
          We couldn't find matches for your exact preferences. Try adjusting your allergy or activity preferences.
        </p>
        <Button id="retake-quiz-btn" variant="default" onClick={() => navigate('/quiz')}>
          Retake the Quiz
        </Button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center gap-2 mb-2">
        <Sparkles size={18} style={{ color: 'var(--color-primary)' }} />
        <h2
          className="text-lg font-semibold"
          style={{ color: 'var(--color-text-primary)' }}
        >
          Your Top Matches
        </h2>
      </div>
      <p className="text-sm mb-6" style={{ color: 'var(--color-text-secondary)' }}>
        {recommendations.length} breeds matched your profile, ranked by compatibility
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {recommendations.map((rec) => (
          <BreedCardWithData
            key={rec.breedId}
            breedId={rec.breedId}
            recommendation={rec}
          />
        ))}
      </div>
    </div>
  );
}

export default RecommendationList;
