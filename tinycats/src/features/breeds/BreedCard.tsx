import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { toggleSaveBreed, addToCompare, selectSavedBreeds, selectCompareList } from '@/features/breeds/breedsSlice';
import { MatchBadge } from '@/components/MatchBadge';
import { Button } from '@/components/ui/button';
import { Heart, GitCompare, ArrowRight } from 'lucide-react';
import type { Breed } from '@/types/breed';
import type { BreedRecommendation } from '@/types/recommendations';
import { cn } from '@/lib/utils';
import { useState } from 'react';

interface BreedCardProps {
  breed: Breed;
  recommendation?: BreedRecommendation;
  className?: string;
}

export function BreedCard({ breed, recommendation, className }: BreedCardProps) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const savedBreeds = useAppSelector(selectSavedBreeds);
  const compareList = useAppSelector(selectCompareList);

  const isSaved = savedBreeds.includes(breed.id);
  const isInCompare = compareList.includes(breed.id);
  const isCompareFull = compareList.length >= 3 && !isInCompare;

  const [imgError, setImgError] = useState(false);

  // 3 key trait tags to display
  const keyTags = breed.tags.slice(0, 3);

  return (
    <article
      className={cn(
        'rounded-2xl border overflow-hidden card-hover cursor-default',
        className
      )}
      style={{
        borderColor: 'var(--color-border)',
        backgroundColor: 'var(--color-card)',
      }}
      aria-label={`${breed.name} breed card`}
    >
      {/* Hero Image */}
      <div className="relative" style={{ aspectRatio: '16/9', overflow: 'hidden', backgroundColor: 'var(--color-surface)' }}>
        {!imgError ? (
          <img
            src={breed.images.hero}
            alt={`${breed.name} cat`}
            loading="lazy"
            width={800}
            height={450}
            onError={() => setImgError(true)}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              display: 'block',
            }}
          />
        ) : (
          <div
            className="w-full h-full flex items-center justify-center"
            style={{ backgroundColor: 'var(--color-surface)' }}
          >
            <span className="text-4xl" aria-hidden="true">🐱</span>
          </div>
        )}

        {/* Match Badge overlay */}
        {recommendation && (
          <div className="absolute top-3 right-3">
            <MatchBadge score={recommendation.matchScore} size="md" />
          </div>
        )}

        {/* Save Heart */}
        <button
          id={`save-breed-${breed.id}`}
          onClick={() => dispatch(toggleSaveBreed(breed.id))}
          className="absolute top-3 left-3 rounded-full p-1.5 transition-all duration-150"
          style={{
            backgroundColor: 'rgba(255,255,255,0.9)',
            backdropFilter: 'blur(4px)',
          }}
          aria-label={isSaved ? `Remove ${breed.name} from saved` : `Save ${breed.name}`}
          aria-pressed={isSaved}
        >
          <Heart
            size={18}
            fill={isSaved ? 'var(--color-danger)' : 'none'}
            style={{ color: isSaved ? 'var(--color-danger)' : 'var(--color-text-secondary)' }}
          />
        </button>
      </div>

      {/* Card Body */}
      <div className="p-5">
        {/* Breed Name + Origin */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <div>
            <h3
              className="text-lg font-bold leading-tight"
              style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text-primary)' }}
            >
              {breed.name}
            </h3>
            <p className="text-xs mt-0.5" style={{ color: 'var(--color-text-secondary)' }}>
              {breed.origin} · {breed.size} · {breed.coatLength} coat
            </p>
          </div>
        </div>

        {/* Trait Tags */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {keyTags.map((tag) => (
            <span
              key={tag}
              className="text-xs px-2.5 py-1 rounded-full font-medium"
              style={{
                backgroundColor: 'var(--color-primary-light)',
                color: 'var(--color-primary)',
              }}
            >
              {tag.replace(/-/g, ' ')}
            </span>
          ))}
        </div>

        {/* AI Summary / Tagline */}
        {recommendation?.aiSummary ? (
          <p
            className="text-sm leading-relaxed mb-4 line-clamp-2"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            {recommendation.aiSummary}
          </p>
        ) : (
          <p
            className="text-sm leading-relaxed mb-4 line-clamp-2"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            {breed.tagline}
          </p>
        )}

        {/* Match Reasons */}
        {recommendation?.matchReasons && recommendation.matchReasons.length > 0 && (
          <ul className="mb-4 flex flex-col gap-1">
            {recommendation.matchReasons.slice(0, 2).map((reason) => (
              <li key={reason} className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--color-text-secondary)' }}>
                <span style={{ color: 'var(--color-success)' }} aria-hidden="true">✓</span>
                {reason}
              </li>
            ))}
          </ul>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button
            id={`view-breed-${breed.id}`}
            variant="default"
            size="sm"
            onClick={() => navigate(`/breed/${breed.id}`)}
            className="flex-1"
            aria-label={`View details for ${breed.name}`}
          >
            View Details
            <ArrowRight size={14} />
          </Button>
          <Button
            id={`compare-breed-${breed.id}`}
            variant={isInCompare ? 'secondary' : 'outline'}
            size="sm"
            onClick={() => dispatch(addToCompare(breed.id))}
            disabled={isCompareFull}
            aria-label={
              isInCompare
                ? `${breed.name} is in compare list`
                : isCompareFull
                ? 'Compare list is full (max 3)'
                : `Add ${breed.name} to compare`
            }
            aria-pressed={isInCompare}
            title={isCompareFull ? 'Remove a breed from compare to add more' : undefined}
          >
            <GitCompare size={14} />
            {isInCompare ? 'Added' : '+ Compare'}
          </Button>
        </div>
      </div>
    </article>
  );
}

export default BreedCard;
