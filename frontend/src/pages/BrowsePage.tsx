import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { fetchBreeds, selectAllBreeds, selectSavedBreeds, selectBreedsStatus } from '@/features/breeds/breedsSlice';
import { BreedCard } from '@/features/breeds/BreedCard';
import { Button } from '@/components/ui/button';
import { Heart, Search, Filter, X } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export const BrowsePage: React.FC = () => {
  const dispatch = useAppDispatch();
  const [searchParams, setSearchParams] = useSearchParams();

  const breeds = useAppSelector(selectAllBreeds);
  const savedBreeds = useAppSelector(selectSavedBreeds);
  const status = useAppSelector(selectBreedsStatus);

  // Filters State
  const [search, setSearch] = useState('');
  const [size, setSize] = useState<string>('all');
  const [coat, setCoat] = useState<string>('all');
  const [allergen, setAllergen] = useState<number>(5);

  const showSavedOnly = searchParams.get('saved') === 'true';

  useEffect(() => {
    dispatch(fetchBreeds());
  }, [dispatch]);

  const handleToggleSaved = () => {
    if (showSavedOnly) {
      searchParams.delete('saved');
    } else {
      searchParams.set('saved', 'true');
    }
    setSearchParams(searchParams);
  };

  const handleResetFilters = () => {
    setSearch('');
    setSize('all');
    setCoat('all');
    setAllergen(5);
    searchParams.delete('saved');
    setSearchParams(searchParams);
  };

  // Filtered Breeds
  const filteredBreeds = useMemo(() => {
    return breeds.filter((breed) => {
      // 1. Text Search
      if (
        search.trim() &&
        !breed.name.toLowerCase().includes(search.toLowerCase()) &&
        !breed.tagline.toLowerCase().includes(search.toLowerCase()) &&
        !breed.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()))
      ) {
        return false;
      }

      // 2. Saved
      if (showSavedOnly && !savedBreeds.includes(breed.id)) {
        return false;
      }

      // 3. Size
      if (size !== 'all' && breed.size !== size) {
        return false;
      }

      // 4. Coat
      if (coat !== 'all' && breed.coatLength !== coat) {
        return false;
      }

      // 5. Allergen
      if (breed.traits.allergenLevel > allergen) {
        return false;
      }

      return true;
    });
  }, [breeds, savedBreeds, search, size, coat, allergen, showSavedOnly]);

  const isLoading = status === 'loading';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 text-left space-y-8">
      {/* Header */}
      <div>
        <h1 className="font-display font-black text-3xl sm:text-5xl text-stone-900 tracking-tight mb-2">
          {showSavedOnly ? 'Your Saved Favorites' : 'Browse Cat Breeds'}
        </h1>
        <p className="text-stone-500 text-sm">
          {showSavedOnly
            ? `You have saved ${savedBreeds.length} feline companion profiles.`
            : `Explore all ${breeds.length} recognized breeds and discover their unique details.`}
        </p>
      </div>

      {/* Main Grid: Filters Left, Cards Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Filters Sidebar */}
        <div className="lg:col-span-3 bg-white rounded-3xl p-6 border border-stone-100 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-stone-100 pb-4">
            <span className="font-display font-bold text-base text-stone-800 flex items-center gap-1.5">
              <Filter size={18} className="text-primary" />
              <span>Filters</span>
            </span>
            <button
              onClick={handleResetFilters}
              className="text-xs font-semibold text-stone-400 hover:text-primary transition-colors cursor-pointer"
            >
              Reset
            </button>
          </div>

          {/* Search Input */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-stone-500 uppercase tracking-wider block">Search</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search breeds, tags..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full text-sm text-stone-700 bg-stone-50 border border-stone-200 rounded-2xl pl-10 pr-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all"
              />
              <Search className="absolute left-3 top-3 text-stone-400" size={16} />
            </div>
          </div>

          {/* Toggle Saved */}
          <div className="flex items-center justify-between py-2 border-t border-b border-stone-100/50">
            <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">Favorites Only</span>
            <button
              onClick={handleToggleSaved}
              className={`p-2 rounded-full border transition-all cursor-pointer ${
                showSavedOnly
                  ? 'bg-primary/10 border-primary text-primary'
                  : 'bg-stone-50 border-stone-200 text-stone-400 hover:text-stone-600'
              }`}
              title="Show Saved Only"
            >
              <Heart size={16} className={showSavedOnly ? 'fill-primary' : ''} />
            </button>
          </div>

          {/* Size Filter */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-stone-500 uppercase tracking-wider block">Size</label>
            <select
              value={size}
              onChange={(e) => setSize(e.target.value)}
              className="w-full text-sm text-stone-700 bg-stone-50 border border-stone-200 rounded-2xl px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary cursor-pointer"
            >
              <option value="all">All Sizes</option>
              <option value="small">Small</option>
              <option value="medium">Medium</option>
              <option value="large">Large</option>
            </select>
          </div>

          {/* Coat Length */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-stone-500 uppercase tracking-wider block">Coat Length</label>
            <select
              value={coat}
              onChange={(e) => setCoat(e.target.value)}
              className="w-full text-sm text-stone-700 bg-stone-50 border border-stone-200 rounded-2xl px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary cursor-pointer"
            >
              <option value="all">All Lengths</option>
              <option value="short">Short</option>
              <option value="medium">Medium</option>
              <option value="long">Long</option>
              <option value="hairless">Hairless</option>
            </select>
          </div>

          {/* Allergen Sensitivity Slider */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-bold text-stone-500 uppercase tracking-wider">
              <span>Max Allergen Level</span>
              <span className="text-stone-700">{allergen}/5</span>
            </div>
            <input
              type="range"
              min="1"
              max="5"
              value={allergen}
              onChange={(e) => setAllergen(parseInt(e.target.value))}
              className="w-full accent-primary h-1.5 bg-stone-100 rounded-lg cursor-pointer appearance-none"
            />
            <span className="text-[10px] text-stone-400 leading-normal block">
              1 = Hypoallergenic (Sphynx, etc.), 5 = Heavy Shedder (Maine Coon).
            </span>
          </div>
        </div>

        {/* Breed Grid Column */}
        <div className="lg:col-span-9">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-white rounded-3xl overflow-hidden shadow-sm h-96 flex flex-col">
                  <Skeleton className="h-48 w-full" />
                  <div className="p-6 space-y-4 flex-grow">
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-8 w-full mt-auto" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredBreeds.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl border border-stone-100 shadow-sm p-8 space-y-4">
              <div className="w-12 h-12 bg-stone-50 text-stone-400 rounded-2xl flex items-center justify-center border border-stone-200 mx-auto">
                <X size={24} />
              </div>
              <h3 className="font-display font-bold text-lg text-stone-900">No Breeds Match Your Criteria</h3>
              <p className="text-sm text-stone-500 max-w-xs mx-auto">
                Try adjusting your search filters or resetting to display all cats.
              </p>
              <Button variant="outline" size="sm" onClick={handleResetFilters}>
                Clear All Filters
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredBreeds.map((breed) => (
                <BreedCard key={breed.id} breed={breed} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
