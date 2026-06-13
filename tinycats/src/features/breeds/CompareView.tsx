import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { removeFromCompare, selectCompareBreeds } from '@/features/breeds/breedsSlice';
import { TraitBar } from '@/components/TraitBar';
import { Button } from '@/components/ui/button';
import { X, ArrowLeft } from 'lucide-react';
import type { BreedTraits } from '@/types/breed';

const TRAIT_LABELS: Array<{ key: keyof BreedTraits; label: string; inverted?: boolean; max?: number }> = [
  { key: 'energy', label: 'Energy Level' },
  { key: 'grooming', label: 'Grooming Needs', inverted: true },
  { key: 'sociability', label: 'Sociability' },
  { key: 'intelligence', label: 'Intelligence' },
  { key: 'vocalness', label: 'Vocalness' },
  { key: 'allergenLevel', label: 'Allergen Level', inverted: true, max: 5 },
  { key: 'childFriendly', label: 'Child Friendly' },
  { key: 'dogFriendly', label: 'Dog Friendly' },
  { key: 'strangerFriendly', label: 'Stranger Friendly' },
];

export function CompareView() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const breeds = useAppSelector(selectCompareBreeds);

  if (breeds.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-20 text-center px-4">
        <span className="text-5xl">🐱</span>
        <h2 className="text-xl font-semibold" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text-primary)' }}>
          No breeds to compare yet
        </h2>
        <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
          Add up to 3 breeds from the results or browse page.
        </p>
        <Button id="go-browse-btn" variant="default" onClick={() => navigate('/browse')}>
          Browse All Breeds
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button
          id="compare-back-btn"
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm font-medium"
          style={{ color: 'var(--color-text-secondary)' }}
        >
          <ArrowLeft size={16} />
          Back
        </button>
        <h1
          className="text-2xl font-bold"
          style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text-primary)' }}
        >
          Compare Breeds
        </h1>
      </div>

      {/* Comparison Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse" aria-label="Breed comparison table">
          <thead>
            <tr>
              <th
                className="text-left p-4 text-sm font-semibold"
                style={{
                  color: 'var(--color-text-secondary)',
                  borderBottom: '2px solid var(--color-border)',
                  minWidth: '140px',
                  position: 'sticky',
                  left: 0,
                  backgroundColor: 'var(--color-surface)',
                  zIndex: 1,
                }}
              >
                Trait
              </th>
              {breeds.map((breed) => (
                <th
                  key={breed.id}
                  className="text-center p-4"
                  style={{
                    borderBottom: '2px solid var(--color-border)',
                    minWidth: '200px',
                  }}
                >
                  <div className="flex flex-col items-center gap-2">
                    <div
                      className="w-16 h-16 rounded-xl overflow-hidden"
                      style={{ backgroundColor: 'var(--color-surface)' }}
                    >
                      <img
                        src={breed.images.hero}
                        alt={breed.name}
                        width={64}
                        height={64}
                        loading="lazy"
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    </div>
                    <span
                      className="font-bold text-base"
                      style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text-primary)' }}
                    >
                      {breed.name}
                    </span>
                    <Button
                      id={`remove-compare-${breed.id}`}
                      variant="ghost"
                      size="sm"
                      onClick={() => dispatch(removeFromCompare(breed.id))}
                      aria-label={`Remove ${breed.name} from comparison`}
                      className="text-xs"
                    >
                      <X size={12} />
                      Remove
                    </Button>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {/* Quick facts rows */}
            {[
              { label: 'Origin', render: (b: typeof breeds[number]) => b.origin },
              { label: 'Size', render: (b: typeof breeds[number]) => b.size },
              { label: 'Coat', render: (b: typeof breeds[number]) => b.coatLength },
              { label: 'Lifespan', render: (b: typeof breeds[number]) => `${b.care.lifespan.min}–${b.care.lifespan.max} yrs` },
            ].map(({ label, render }) => (
              <tr
                key={label}
                style={{ borderBottom: '1px solid var(--color-border)' }}
              >
                <td
                  className="p-4 text-sm font-semibold"
                  style={{
                    color: 'var(--color-text-secondary)',
                    position: 'sticky',
                    left: 0,
                    backgroundColor: 'var(--color-surface)',
                  }}
                >
                  {label}
                </td>
                {breeds.map((breed) => (
                  <td key={breed.id} className="p-4 text-center text-sm capitalize" style={{ color: 'var(--color-text-primary)' }}>
                    {render(breed)}
                  </td>
                ))}
              </tr>
            ))}

            {/* Trait bar rows */}
            {TRAIT_LABELS.map(({ key, label, inverted, max = 10 }) => (
              <tr
                key={key}
                style={{ borderBottom: '1px solid var(--color-border)' }}
              >
                <td
                  className="p-4 text-sm font-semibold"
                  style={{
                    color: 'var(--color-text-secondary)',
                    position: 'sticky',
                    left: 0,
                    backgroundColor: 'var(--color-surface)',
                  }}
                >
                  {label}
                </td>
                {breeds.map((breed) => (
                  <td key={breed.id} className="p-4">
                    <TraitBar
                      label=""
                      value={breed.traits[key]}
                      maxValue={max}
                      inverted={inverted}
                      showValue
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* View Details links */}
      <div className="flex gap-4 mt-8 justify-center flex-wrap">
        {breeds.map((breed) => (
          <Button
            key={breed.id}
            id={`compare-view-${breed.id}`}
            variant="outline"
            size="default"
            onClick={() => navigate(`/breed/${breed.id}`)}
            aria-label={`View full details for ${breed.name}`}
          >
            View {breed.name} Details
          </Button>
        ))}
      </div>
    </div>
  );
}

export default CompareView;
