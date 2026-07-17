import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { selectAllBreeds, selectCompareList, removeFromCompare, clearCompare, fetchBreeds } from '@/features/breeds/breedsSlice';
import { TraitBar } from '@/components/TraitBar';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Trash2, Plus, Scale } from 'lucide-react';
import type { Breed } from '@/types/breed';

export const ComparePage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const compareIds = useAppSelector(selectCompareList);
  const allBreeds = useAppSelector(selectAllBreeds);

  useEffect(() => {
    dispatch(fetchBreeds());
  }, [dispatch]);

  // Map IDs to Breed objects and narrow type to Breed[]
  const compareBreeds = compareIds
    .map((id) => allBreeds.find((b) => b.id === id))
    .filter((b): b is Breed => b !== undefined);

  const handleRemove = (id: string) => {
    dispatch(removeFromCompare(id));
  };

  const handleClear = () => {
    dispatch(clearCompare());
  };

  if (compareBreeds.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-6">
        <Scale className="mx-auto text-stone-300" size={56} />
        <h2 className="font-display font-bold text-2xl text-stone-800">No Breeds Added to Compare</h2>
        <p className="text-stone-500 max-w-sm mx-auto">
          Add up to 3 cat breeds to compare them side-by-side. Use the compare icon on breed cards.
        </p>
        <Button variant="primary" onClick={() => navigate('/browse')}>
          Browse Breeds
        </Button>
      </div>
    );
  }

  const traits = [
    { key: 'sociability', label: 'Sociability & Affection' },
    { key: 'energy', label: 'Energy & Activity' },
    { key: 'intelligence', label: 'Intelligence' },
    { key: 'independence', label: 'Independence' },
    { key: 'childFriendly', label: 'Child Friendly' },
    { key: 'dogFriendly', label: 'Dog/Pet Friendly' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 text-left space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1.5 text-stone-500 hover:text-stone-800 text-sm font-semibold transition-colors duration-200 cursor-pointer mb-2"
          >
            <ArrowLeft size={16} />
            <span>Back</span>
          </button>
          <h1 className="font-display font-black text-3xl sm:text-5xl text-stone-900 tracking-tight">
            Compare Breeds
          </h1>
          <p className="text-stone-500 text-sm">
            Comparing {compareBreeds.length} of 3 breeds.
          </p>
        </div>

        {compareBreeds.length > 0 && (
          <Button variant="outline" size="sm" onClick={handleClear} className="flex items-center gap-1.5 text-primary hover:bg-primary/5">
            <Trash2 size={16} />
            <span>Clear All</span>
          </Button>
        )}
      </div>

      {/* Grid Comparison Table */}
      <div className="glass rounded-3xl shadow-premium overflow-x-auto bg-white/50 hover:bg-white/60 transition-colors duration-300">
        <div className="min-w-[650px] p-6 space-y-8">
          {/* Header Row */}
          <div className="grid grid-cols-4 gap-6 items-start border-b border-white/20 pb-6">
            <div className="flex items-center justify-center h-full bg-white/20 rounded-2xl p-4 text-center border border-dashed border-white/40 backdrop-blur-sm">
              <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider leading-relaxed">
                Comparison Details
              </span>
            </div>

            {compareBreeds.map((breed) => (
              <div key={breed.id} className="relative group bg-white/35 glass rounded-2xl p-4 flex flex-col items-center text-center">
                <button
                  onClick={() => handleRemove(breed.id)}
                  className="absolute top-2 right-2 p-1.5 bg-white text-stone-400 hover:text-primary rounded-full shadow-sm hover:scale-105 transition-all duration-200 cursor-pointer"
                  title="Remove from compare"
                >
                  <Trash2 size={14} />
                </button>
                <img
                  src={breed.images.hero}
                  alt={breed.name}
                  className="w-20 h-20 rounded-full object-cover shadow-sm mb-3 border-2 border-white"
                />
                <h3 className="font-display font-bold text-base text-stone-800 truncate w-full">
                  {breed.name}
                </h3>
                <p className="text-[10px] italic text-stone-400 truncate w-full mt-0.5">
                  {breed.tagline}
                </p>
              </div>
            ))}

            {/* Empty slots */}
            {Array.from({ length: 3 - compareBreeds.length }).map((_, i) => (
              <button
                key={i}
                onClick={() => navigate('/browse')}
                className="h-full border-2 border-dashed border-white/40 hover:border-primary/30 bg-white/10 hover:bg-white/30 glass rounded-2xl p-8 flex flex-col items-center justify-center text-center text-stone-400 hover:text-primary transition-all duration-200 cursor-pointer"
              >
                <Plus size={24} className="mb-2" />
                <span className="text-xs font-semibold uppercase tracking-wider">Add Cat</span>
              </button>
            ))}
          </div>

          {/* Specifications Sections */}
          <div className="space-y-6">
            <h4 className="font-display font-bold text-sm text-stone-400 uppercase tracking-wider border-b border-stone-100 pb-2">
              Specifications
            </h4>

            {/* Size Row */}
            <div className="grid grid-cols-4 gap-6 py-2 border-b border-stone-100/50 text-sm">
              <span className="font-semibold text-stone-500">Size Category</span>
              {compareBreeds.map((b) => (
                <span key={b.id} className="font-bold text-stone-700 capitalize">
                  {b.size}
                </span>
              ))}
              {Array.from({ length: 3 - compareBreeds.length }).map((_, i) => (
                <span key={i} className="text-stone-300">—</span>
              ))}
            </div>

            {/* Coat Row */}
            <div className="grid grid-cols-4 gap-6 py-2 border-b border-stone-100/50 text-sm">
              <span className="font-semibold text-stone-500">Coat Length</span>
              {compareBreeds.map((b) => (
                <span key={b.id} className="font-bold text-stone-700 capitalize">
                  {b.coatLength}
                </span>
              ))}
              {Array.from({ length: 3 - compareBreeds.length }).map((_, i) => (
                <span key={i} className="text-stone-300">—</span>
              ))}
            </div>

            {/* Lifespan Row */}
            <div className="grid grid-cols-4 gap-6 py-2 border-b border-stone-100/50 text-sm">
              <span className="font-semibold text-stone-500">Lifespan</span>
              {compareBreeds.map((b) => (
                <span key={b.id} className="font-bold text-stone-700">
                  {b.care?.lifespan ? `${b.care.lifespan.min} - ${b.care.lifespan.max} years` : '—'}
                </span>
              ))}
              {Array.from({ length: 3 - compareBreeds.length }).map((_, i) => (
                <span key={i} className="text-stone-300">—</span>
              ))}
            </div>

            {/* Allergen Row */}
            <div className="grid grid-cols-4 gap-6 py-2 border-b border-stone-100/50 text-sm">
              <span className="font-semibold text-stone-500">Allergen Sensitivity</span>
              {compareBreeds.map((b) => (
                <span key={b.id} className="font-bold text-stone-700">
                  Level {b.traits.allergenLevel}/5
                </span>
              ))}
              {Array.from({ length: 3 - compareBreeds.length }).map((_, i) => (
                <span key={i} className="text-stone-300">—</span>
              ))}
            </div>
          </div>

          {/* Traits Section */}
          <div className="space-y-6">
            <h4 className="font-display font-bold text-sm text-stone-400 uppercase tracking-wider border-b border-stone-100 pb-2">
              Character Traits
            </h4>

            {traits.map((trait) => (
              <div key={trait.key} className="grid grid-cols-4 gap-6 py-2 items-center">
                <span className="font-semibold text-stone-500 text-sm">{trait.label}</span>
                {compareBreeds.map((b) => {
                  const val = trait.key === 'independence' 
                    ? 10 - b.traits.sociability 
                    : b.traits[trait.key as keyof typeof b.traits];
                  return (
                    <div key={b.id} className="pr-4">
                      <TraitBar label="" value={val} maxValue={10} />
                    </div>
                  );
                })}
                {Array.from({ length: 3 - compareBreeds.length }).map((_, i) => (
                  <span key={i} className="text-stone-300">—</span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
