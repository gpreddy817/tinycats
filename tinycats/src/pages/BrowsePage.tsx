import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { fetchBreeds, selectAllBreeds, selectBreedsStatus, selectUsingFallback } from '@/features/breeds/breedsSlice';
import { BreedCard } from '@/features/breeds/BreedCard';
import { Skeleton } from '@/components/ui/skeleton';
import { Search } from 'lucide-react';
import type { Breed, SizeCategory, CoatLength } from '@/types/breed';

type FilterState = {
  search: string;
  size: SizeCategory | '';
  coatLength: CoatLength | '';
  maxAllergen: number;
  tags: string[];
};

const ALL_TAGS = [
  'apartment', 'calm', 'playful', 'active', 'independent', 'family-friendly',
  'dog-friendly', 'hypoallergenic', 'velcro-cat', 'intelligent', 'first-time-owner',
  'quiet', 'social', 'low-grooming', 'low-maintenance',
];

function applyFilters(breeds: Breed[], filters: FilterState): Breed[] {
  return breeds.filter((b) => {
    if (filters.search) {
      const q = filters.search.toLowerCase();
      if (!b.name.toLowerCase().includes(q) && !b.tagline.toLowerCase().includes(q)) {
        return false;
      }
    }
    if (filters.size && b.size !== filters.size) return false;
    if (filters.coatLength && b.coatLength !== filters.coatLength) return false;
    if (b.traits.allergenLevel > filters.maxAllergen) return false;
    if (filters.tags.length > 0 && !filters.tags.every((t) => b.tags.includes(t))) return false;
    return true;
  });
}

export default function BrowsePage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const breeds = useAppSelector(selectAllBreeds);
  const status = useAppSelector(selectBreedsStatus);
  const usingFallback = useAppSelector(selectUsingFallback);

  const [filters, setFilters] = useState<FilterState>({
    search: '',
    size: '',
    coatLength: '',
    maxAllergen: 5,
    tags: [],
  });

  useEffect(() => {
    if (status === 'idle') {
      void dispatch(fetchBreeds());
    }
  }, [dispatch, status]);

  const filtered = useMemo(() => applyFilters(breeds, filters), [breeds, filters]);

  const toggleTag = (tag: string) => {
    setFilters((f) => ({
      ...f,
      tags: f.tags.includes(tag) ? f.tags.filter((t) => t !== tag) : [...f.tags, tag],
    }));
  };

  const clearFilters = () => {
    setFilters({ search: '', size: '', coatLength: '', maxAllergen: 5, tags: [] });
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--color-surface)' }}>
      {/* Offline banner */}
      {usingFallback && (
        <div
          role="status"
          className="flex items-center justify-center gap-2 px-4 py-2 text-sm text-center"
          style={{ backgroundColor: '#FFFBEB', borderBottom: '1px solid #FDE68A', color: '#92400E' }}
        >
          📡 Using offline breed data
        </div>
      )}

      {/* Header */}
      <header
        className="border-b px-4 py-4 flex items-center justify-between flex-wrap gap-3"
        style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-card)' }}
      >
        <button
          id="browse-home-btn"
          onClick={() => navigate('/')}
          className="text-xl font-bold"
          style={{ fontFamily: 'var(--font-display)', color: 'var(--color-primary)' }}
        >
          🐾 TinyCats
        </button>
        <span className="text-lg font-semibold" style={{ color: 'var(--color-text-primary)' }}>
          Browse All Breeds
        </span>
        <button
          id="browse-quiz-btn"
          onClick={() => navigate('/quiz')}
          className="text-sm font-medium px-4 py-2 rounded-xl transition-all"
          style={{
            backgroundColor: 'var(--color-primary)',
            color: 'white',
          }}
        >
          Take the Quiz →
        </button>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col lg:flex-row gap-8">
        {/* Sidebar Filters */}
        <aside
          className="lg:w-64 flex-shrink-0"
          aria-label="Breed filters"
        >
          <div
            className="rounded-2xl p-5 border sticky top-6"
            style={{ backgroundColor: 'var(--color-card)', borderColor: 'var(--color-border)' }}
          >
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-semibold text-base" style={{ color: 'var(--color-text-primary)' }}>Filters</h2>
              {(filters.search || filters.size || filters.coatLength || filters.maxAllergen < 5 || filters.tags.length > 0) && (
                <button
                  id="clear-filters-btn"
                  onClick={clearFilters}
                  className="text-xs font-medium"
                  style={{ color: 'var(--color-primary)' }}
                >
                  Clear all
                </button>
              )}
            </div>

            {/* Search */}
            <div className="mb-5">
              <label className="block text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: 'var(--color-text-secondary)' }}>
                Search
              </label>
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--color-text-secondary)' }} />
                <input
                  id="breed-search-input"
                  type="text"
                  value={filters.search}
                  onChange={(e) => setFilters((f) => ({ ...f, search: e.target.value }))}
                  placeholder="Search breeds…"
                  className="w-full pl-8 pr-3 py-2 text-sm rounded-xl border focus:outline-none"
                  style={{
                    borderColor: 'var(--color-border)',
                    backgroundColor: 'var(--color-surface)',
                    color: 'var(--color-text-primary)',
                    outlineColor: 'var(--color-primary)',
                  }}
                  aria-label="Search breeds by name"
                />
              </div>
            </div>

            {/* Size */}
            <div className="mb-5">
              <label className="block text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: 'var(--color-text-secondary)' }}>
                Size
              </label>
              <div className="flex flex-col gap-1.5">
                {(['', 'small', 'medium', 'large'] as const).map((s) => (
                  <button
                    key={s}
                    id={`filter-size-${s || 'all'}`}
                    onClick={() => setFilters((f) => ({ ...f, size: s }))}
                    className="text-left text-sm px-3 py-2 rounded-lg transition-colors"
                    style={{
                      backgroundColor: filters.size === s ? 'var(--color-primary-light)' : 'transparent',
                      color: filters.size === s ? 'var(--color-primary)' : 'var(--color-text-secondary)',
                      fontWeight: filters.size === s ? 600 : 400,
                    }}
                  >
                    {s === '' ? 'Any size' : s.charAt(0).toUpperCase() + s.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Coat Length */}
            <div className="mb-5">
              <label className="block text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: 'var(--color-text-secondary)' }}>
                Coat Length
              </label>
              <div className="flex flex-col gap-1.5">
                {(['', 'short', 'medium', 'long', 'hairless'] as const).map((c) => (
                  <button
                    key={c}
                    id={`filter-coat-${c || 'all'}`}
                    onClick={() => setFilters((f) => ({ ...f, coatLength: c }))}
                    className="text-left text-sm px-3 py-2 rounded-lg transition-colors"
                    style={{
                      backgroundColor: filters.coatLength === c ? 'var(--color-primary-light)' : 'transparent',
                      color: filters.coatLength === c ? 'var(--color-primary)' : 'var(--color-text-secondary)',
                      fontWeight: filters.coatLength === c ? 600 : 400,
                    }}
                  >
                    {c === '' ? 'Any coat' : c.charAt(0).toUpperCase() + c.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Max Allergen */}
            <div className="mb-5">
              <label
                className="block text-xs font-semibold uppercase tracking-wide mb-2"
                style={{ color: 'var(--color-text-secondary)' }}
                htmlFor="allergen-slider"
              >
                Max Allergen Level: {filters.maxAllergen === 5 ? 'Any' : filters.maxAllergen}
              </label>
              <input
                id="allergen-slider"
                type="range"
                min={1}
                max={5}
                value={filters.maxAllergen}
                onChange={(e) => setFilters((f) => ({ ...f, maxAllergen: parseInt(e.target.value) }))}
                className="w-full"
                aria-label={`Maximum allergen level: ${filters.maxAllergen}`}
                style={{ accentColor: 'var(--color-primary)' }}
              />
              <div className="flex justify-between text-xs mt-1" style={{ color: 'var(--color-text-secondary)' }}>
                <span>Hypo</span>
                <span>Heavy shed</span>
              </div>
            </div>

            {/* Tags */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: 'var(--color-text-secondary)' }}>
                Tags
              </label>
              <div className="flex flex-wrap gap-1.5">
                {ALL_TAGS.map((tag) => {
                  const active = filters.tags.includes(tag);
                  return (
                    <button
                      key={tag}
                      id={`filter-tag-${tag}`}
                      onClick={() => toggleTag(tag)}
                      className="text-xs px-2.5 py-1 rounded-full transition-all"
                      style={{
                        backgroundColor: active ? 'var(--color-primary)' : 'var(--color-primary-light)',
                        color: active ? 'white' : 'var(--color-primary)',
                        fontWeight: active ? 600 : 400,
                      }}
                      aria-pressed={active}
                      aria-label={`Filter by ${tag.replace(/-/g, ' ')}`}
                    >
                      {tag.replace(/-/g, ' ')}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </aside>

        {/* Breed Grid */}
        <main className="flex-1" aria-label="Breed listings">
          {/* Result count */}
          <div className="flex items-center justify-between mb-5">
            <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
              {status === 'loading' ? 'Loading breeds…' : `${filtered.length} breed${filtered.length !== 1 ? 's' : ''} found`}
            </p>
          </div>

          {status === 'loading' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div key={n} className="rounded-2xl border overflow-hidden" style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-card)' }}>
                  <Skeleton style={{ height: '180px', borderRadius: 0 }} />
                  <div className="p-5 flex flex-col gap-3">
                    <Skeleton style={{ height: '22px', width: '55%' }} />
                    <Skeleton style={{ height: '14px', width: '35%' }} />
                    <Skeleton style={{ height: '36px' }} />
                    <div className="flex gap-2">
                      <Skeleton style={{ height: '32px', flex: 1 }} />
                      <Skeleton style={{ height: '32px', width: '90px' }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
              <span className="text-5xl">🔍</span>
              <h3 className="text-xl font-semibold" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text-primary)' }}>
                No breeds match your filters
              </h3>
              <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                Try broadening your search or clearing some filters.
              </p>
              <button
                id="clear-filters-empty-btn"
                onClick={clearFilters}
                className="text-sm font-semibold"
                style={{ color: 'var(--color-primary)' }}
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
              {filtered.map((breed) => (
                <BreedCard key={breed.id} breed={breed} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
