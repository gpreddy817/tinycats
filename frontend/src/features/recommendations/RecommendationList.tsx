import React from 'react';
import { useAppSelector } from '@/app/hooks';
import { selectRecommendations, selectRecommendationsStatus, selectRecommendationsError } from './recommendationsSlice';
import { selectAllBreeds } from '@/features/breeds/breedsSlice';
import { BreedCard } from '../breeds/BreedCard';
import { Skeleton } from '@/components/ui/skeleton';
import { Frown, Sparkles } from 'lucide-react';

export const RecommendationList: React.FC = () => {
  const recommendations = useAppSelector(selectRecommendations);
  const status = useAppSelector(selectRecommendationsStatus);
  const error = useAppSelector(selectRecommendationsError);
  const allBreeds = useAppSelector(selectAllBreeds);

  if (status === 'loading') {
    return (
      <div className="space-y-6">
        <div className="h-10 w-2/3 bg-stone-200 animate-pulse rounded-lg" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white rounded-3xl overflow-hidden shadow-sm h-96 flex flex-col">
              <Skeleton className="h-48 w-full" />
              <div className="p-6 space-y-4 flex-grow">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-8 w-full mt-auto" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (status === 'failed') {
    return (
      <div className="text-center py-12 bg-white rounded-3xl border border-stone-100 shadow-sm p-8 max-w-md mx-auto">
        <Frown className="mx-auto text-primary mb-4" size={48} />
        <h3 className="font-display font-bold text-lg text-stone-900 mb-2">Something went wrong</h3>
        <p className="text-sm text-stone-600 mb-6">{error || 'Could not load matches.'}</p>
      </div>
    );
  }

  if (recommendations.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-3xl border border-stone-100 shadow-sm p-8 max-w-md mx-auto">
        <Frown className="mx-auto text-stone-400 mb-4" size={48} />
        <h3 className="font-display font-bold text-lg text-stone-900 mb-2">No recommendations yet</h3>
        <p className="text-sm text-stone-600 mb-6">Complete the personality quiz to get tailored recommendations from Gemini AI.</p>
      </div>
    );
  }

  // Combine recommendations with the full breed traits from Redux
  const matchedBreeds = recommendations.map((rec) => {
    const breedDetail = allBreeds.find((b) => b.id === rec.breedId);
    return {
      rec,
      breedDetail,
    };
  }).filter((item) => item.breedDetail !== undefined);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <div className="bg-accent/20 p-2 rounded-xl text-primary">
          <Sparkles size={20} />
        </div>
        <div>
          <h2 className="font-display font-bold text-2xl text-stone-900">Your Top Matches</h2>
          <p className="text-xs text-stone-500">Curated specifically for you by Gemini AI</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {matchedBreeds.map(({ rec, breedDetail }, index) => (
          <BreedCard
            key={rec.breedId}
            breed={breedDetail!}
            matchScore={rec.matchScore}
            matchReasons={rec.matchReasons}
            rank={index + 1}
          />
        ))}
      </div>
    </div>
  );
};
