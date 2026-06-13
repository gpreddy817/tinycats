import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { toggleSaveBreed, addToCompare, selectSavedBreeds, selectCompareList } from '@/features/breeds/breedsSlice';
import { TraitBar } from '@/components/TraitBar';
import { MatchBadge } from '@/components/MatchBadge';
import { Button } from '@/components/ui/button';
import { Heart, GitCompare, ExternalLink, ArrowLeft } from 'lucide-react';
import type { Breed } from '@/types/breed';
import type { BreedRecommendation } from '@/types/recommendations';

interface BreedDetailProps {
  breed: Breed;
  recommendation?: BreedRecommendation;
}

const TRAIT_LABELS: Array<{ key: keyof import('@/types/breed').BreedTraits; label: string; inverted?: boolean }> = [
  { key: 'energy', label: 'Energy' },
  { key: 'grooming', label: 'Grooming Needs', inverted: true },
  { key: 'sociability', label: 'Sociability' },
  { key: 'intelligence', label: 'Intelligence' },
  { key: 'vocalness', label: 'Vocalness' },
  { key: 'allergenLevel', label: 'Allergen Level', inverted: true },
  { key: 'childFriendly', label: 'Child Friendly' },
  { key: 'dogFriendly', label: 'Dog Friendly' },
  { key: 'strangerFriendly', label: 'Stranger Friendly' },
];

const GROOMING_LABELS: Record<string, string> = {
  'daily': 'Daily',
  '2-3x/week': '2–3× per week',
  'weekly': 'Weekly',
  'monthly': 'Monthly',
};

export function BreedDetail({ breed, recommendation }: BreedDetailProps) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const savedBreeds = useAppSelector(selectSavedBreeds);
  const compareList = useAppSelector(selectCompareList);
  const isSaved = savedBreeds.includes(breed.id);
  const isInCompare = compareList.includes(breed.id);
  const isCompareFull = compareList.length >= 3 && !isInCompare;

  const [imgError, setImgError] = useState(false);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 animate-fade-in">
      {/* Back Button */}
      <button
        id="breed-back-btn"
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 mb-6 text-sm font-medium transition-colors duration-150"
        style={{ color: 'var(--color-text-secondary)' }}
      >
        <ArrowLeft size={16} />
        Back
      </button>

      {/* Above-fold: Hero Image + Quick Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 mb-10">
        {/* Hero Image */}
        <div
          className="lg:col-span-3 rounded-2xl overflow-hidden"
          style={{ aspectRatio: '16/9', backgroundColor: 'var(--color-surface)' }}
        >
          {!imgError ? (
            <img
              src={breed.images.hero}
              alt={`${breed.name} cat`}
              width={960}
              height={540}
              onError={() => setImgError(true)}
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-6xl">🐱</span>
            </div>
          )}
        </div>

        {/* Quick Stats */}
        <div className="lg:col-span-2 flex flex-col justify-between gap-4">
          <div>
            <div className="flex items-start justify-between gap-3 mb-1">
              <h1
                className="text-3xl font-bold leading-tight"
                style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text-primary)' }}
              >
                {breed.name}
              </h1>
              {recommendation && <MatchBadge score={recommendation.matchScore} size="lg" />}
            </div>
            <p className="text-base italic mb-4" style={{ color: 'var(--color-text-secondary)' }}>
              {breed.tagline}
            </p>

            {/* Quick facts grid */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              {[
                { label: 'Origin', value: breed.origin },
                { label: 'Size', value: breed.size },
                { label: 'Coat', value: breed.coatLength },
                { label: 'Lifespan', value: `${breed.care.lifespan.min}–${breed.care.lifespan.max} yrs` },
                { label: 'Grooming', value: GROOMING_LABELS[breed.care.groomingFrequency] ?? breed.care.groomingFrequency },
              ].map(({ label, value }) => (
                <div key={label} className="rounded-xl p-3" style={{ backgroundColor: 'var(--color-surface)' }}>
                  <div className="text-xs font-medium mb-0.5" style={{ color: 'var(--color-text-secondary)' }}>{label}</div>
                  <div className="text-sm font-semibold capitalize" style={{ color: 'var(--color-text-primary)' }}>{value}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-2">
            <Button
              id={`save-detail-${breed.id}`}
              variant={isSaved ? 'secondary' : 'outline'}
              size="default"
              onClick={() => dispatch(toggleSaveBreed(breed.id))}
              aria-label={isSaved ? 'Remove from saved breeds' : 'Save this breed'}
              aria-pressed={isSaved}
            >
              <Heart size={16} fill={isSaved ? 'currentColor' : 'none'} />
              {isSaved ? 'Saved' : 'Save Breed'}
            </Button>
            <Button
              id={`compare-detail-${breed.id}`}
              variant={isInCompare ? 'secondary' : 'outline'}
              size="default"
              onClick={() => dispatch(addToCompare(breed.id))}
              disabled={isCompareFull}
              aria-label={isInCompare ? 'Already in compare' : 'Add to compare'}
              aria-pressed={isInCompare}
            >
              <GitCompare size={16} />
              {isInCompare ? 'In Compare List' : '+ Add to Compare'}
            </Button>
            {compareList.length >= 2 && (
              <Button
                id="go-to-compare-btn"
                variant="default"
                size="default"
                onClick={() => navigate('/compare')}
              >
                View Comparison →
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: About + Care */}
        <div className="lg:col-span-2 flex flex-col gap-8">
          {/* About */}
          <section aria-labelledby="about-heading">
            <h2 id="about-heading" className="text-xl font-semibold mb-4" style={{ color: 'var(--color-text-primary)' }}>
              About the {breed.name}
            </h2>
            <div className="flex flex-col gap-3">
              {breed.description.split('\n\n').map((para, i) => (
                <p key={i} className="text-sm leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
                  {para}
                </p>
              ))}
            </div>
          </section>

          {/* Care Guide */}
          <section
            aria-labelledby="care-heading"
            className="rounded-2xl p-6"
            style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)' }}
          >
            <h2 id="care-heading" className="text-xl font-semibold mb-5" style={{ color: 'var(--color-text-primary)' }}>
              Care Guide
            </h2>
            <div className="flex flex-col gap-4">
              <div>
                <div className="text-xs font-semibold uppercase tracking-wide mb-1" style={{ color: 'var(--color-text-secondary)' }}>
                  Diet
                </div>
                <p className="text-sm" style={{ color: 'var(--color-text-primary)' }}>{breed.care.dietNotes}</p>
              </div>
              <div>
                <div className="text-xs font-semibold uppercase tracking-wide mb-1" style={{ color: 'var(--color-text-secondary)' }}>
                  Exercise
                </div>
                <p className="text-sm" style={{ color: 'var(--color-text-primary)' }}>{breed.care.exerciseNeeds}</p>
              </div>
              <div>
                <div className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: 'var(--color-text-secondary)' }}>
                  Common Health Issues
                </div>
                <ul className="flex flex-col gap-1">
                  {breed.care.commonHealthIssues.map((issue) => (
                    <li key={issue} className="flex items-center gap-2 text-sm" style={{ color: 'var(--color-text-primary)' }}>
                      <span style={{ color: 'var(--color-warning)' }}>⚠</span> {issue}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          {/* Adoption Links */}
          {breed.adoptionLinks.length > 0 && (
            <section aria-labelledby="adopt-heading">
              <h2 id="adopt-heading" className="text-xl font-semibold mb-4" style={{ color: 'var(--color-text-primary)' }}>
                Find a {breed.name}
              </h2>
              <div className="flex flex-col gap-2">
                {breed.adoptionLinks.map((link) => (
                  <a
                    key={link.url}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-4 rounded-xl border transition-all duration-150 hover:border-[var(--color-primary)] hover:bg-[var(--color-primary-light)]"
                    style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-card)' }}
                    aria-label={`${link.label} — opens in new tab`}
                  >
                    <div>
                      <div className="text-sm font-semibold" style={{ color: 'var(--color-text-primary)' }}>{link.label}</div>
                      <div className="text-xs capitalize" style={{ color: 'var(--color-text-secondary)' }}>{link.type.replace('-', ' ')}</div>
                    </div>
                    <ExternalLink size={14} style={{ color: 'var(--color-text-secondary)' }} />
                  </a>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Right Column: Trait Bars */}
        <div>
          <section
            aria-labelledby="traits-heading"
            className="rounded-2xl p-6 sticky top-6"
            style={{ backgroundColor: 'var(--color-card)', border: '1px solid var(--color-border)' }}
          >
            <h2 id="traits-heading" className="text-xl font-semibold mb-5" style={{ color: 'var(--color-text-primary)' }}>
              Traits
            </h2>
            <div className="flex flex-col gap-4">
              {TRAIT_LABELS.map(({ key, label, inverted }) => (
                <TraitBar
                  key={key}
                  label={label}
                  value={breed.traits[key]}
                  maxValue={key === 'allergenLevel' ? 5 : 10}
                  inverted={inverted}
                />
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

export default BreedDetail;
