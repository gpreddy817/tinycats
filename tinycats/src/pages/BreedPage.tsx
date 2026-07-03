import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { fetchBreedDetail, selectBreedById, toggleSaveBreed, addToCompare, selectSavedBreeds, selectCompareList } from '@/features/breeds/breedsSlice';
import { TraitBar } from '@/components/TraitBar';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Heart, Scale, Sparkles, AlertCircle } from 'lucide-react';

export const BreedPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const breed = useAppSelector(selectBreedById(id || ''));
  const savedBreeds = useAppSelector(selectSavedBreeds);
  const compareList = useAppSelector(selectCompareList);

  useEffect(() => {
    if (id) {
      dispatch(fetchBreedDetail(id));
    }
  }, [id, dispatch]);

  if (!breed) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <AlertCircle className="mx-auto text-stone-400 mb-4" size={48} />
        <h2 className="font-display font-bold text-2xl text-stone-800 mb-2">Breed Not Found</h2>
        <p className="text-stone-500 mb-6">We couldn't retrieve the details for this cat breed.</p>
        <Button variant="primary" onClick={() => navigate('/browse')}>
          Browse All Breeds
        </Button>
      </div>
    );
  }

  const isSaved = savedBreeds.includes(breed.id);
  const isComparing = compareList.includes(breed.id);

  const handleSave = () => {
    dispatch(toggleSaveBreed(breed.id));
  };

  const handleCompare = () => {
    if (isComparing) {
      // Navigate to compare page
      navigate('/compare');
    } else {
      if (compareList.length >= 3) {
        alert('You can compare up to 3 breeds at a time.');
        return;
      }
      dispatch(addToCompare(breed.id));
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 text-left space-y-10">
      {/* Back navigation */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1.5 text-stone-500 hover:text-stone-800 text-sm font-semibold transition-colors duration-200 cursor-pointer"
      >
        <ArrowLeft size={16} />
        <span>Back</span>
      </button>

      {/* Hero Header Card */}
      <div className="bg-white rounded-4xl overflow-hidden shadow-premium border border-stone-100 grid grid-cols-1 md:grid-cols-2 gap-0">
        <div className="relative aspect-4/3 md:aspect-auto overflow-hidden bg-stone-100">
          <img
            src={breed.images.hero}
            alt={breed.name}
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="p-8 sm:p-12 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <h1 className="font-display font-black text-3xl sm:text-5xl text-stone-900 tracking-tight leading-tight">
                {breed.name}
              </h1>
              <p className="text-sm font-semibold italic text-primary-hover font-display">
                "{breed.tagline}"
              </p>
            </div>

            <p className="text-sm text-stone-600 leading-relaxed">
              {breed.description}
            </p>

            <div className="flex flex-wrap gap-2 pt-2">
              {breed.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs font-semibold bg-stone-100 text-stone-600 px-3 py-1 rounded-full capitalize"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap gap-4 pt-4 border-t border-stone-100">
            <Button
              onClick={handleSave}
              variant={isSaved ? 'primary' : 'outline'}
              className="flex items-center gap-2"
            >
              <Heart size={18} className={isSaved ? 'fill-white' : ''} />
              <span>{isSaved ? 'Saved to Favorites' : 'Save Breed'}</span>
            </Button>

            <Button
              onClick={handleCompare}
              variant={isComparing ? 'sage' : 'outline'}
              className="flex items-center gap-2"
            >
              <Scale size={18} />
              <span>{isComparing ? 'View Comparison' : 'Compare Breed'}</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Main Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Left Column: Stats & Traits */}
        <div className="md:col-span-6 bg-white rounded-3xl p-8 border border-stone-100 shadow-sm space-y-6">
          <h2 className="font-display font-bold text-xl text-stone-900 border-b border-stone-100 pb-3 flex items-center gap-2">
            <Sparkles size={20} className="text-accent" />
            <span>Personality & Temperament</span>
          </h2>

          <div className="space-y-1">
            <TraitBar label="Affection Level" value={breed.traits.sociability} />
            <TraitBar label="Energy & Activity" value={breed.traits.energy} />
            <TraitBar label="Intelligence" value={breed.traits.intelligence} />
            <TraitBar label="Independence" value={10 - breed.traits.sociability} />
            <TraitBar label="Child Friendliness" value={breed.traits.childFriendly} />
            <TraitBar label="Pet Friendliness" value={breed.traits.dogFriendly} />
          </div>
        </div>

        {/* Right Column: Specifications & Care */}
        <div className="md:col-span-6 space-y-8">
          {/* Quick Specifications */}
          <div className="bg-white rounded-3xl p-8 border border-stone-100 shadow-sm space-y-6">
            <h2 className="font-display font-bold text-xl text-stone-900 border-b border-stone-100 pb-3">
              Specifications
            </h2>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-1 text-left">
                <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">Size Category</span>
                <span className="text-sm font-semibold text-stone-700 capitalize">{breed.size}</span>
              </div>
              <div className="space-y-1 text-left">
                <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">Coat Length</span>
                <span className="text-sm font-semibold text-stone-700 capitalize">{breed.coatLength}</span>
              </div>
              <div className="space-y-1 text-left">
                <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">Lifespan</span>
                <span className="text-sm font-semibold text-stone-700">{breed.care.lifespan.min} - {breed.care.lifespan.max} years</span>
              </div>
              <div className="space-y-1 text-left">
                <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">Allergen Level</span>
                <span className="text-sm font-semibold text-stone-700">{breed.traits.allergenLevel}/5</span>
              </div>
            </div>
          </div>

          {/* Care & Diet */}
          <div className="bg-white rounded-3xl p-8 border border-stone-100 shadow-sm space-y-6">
            <h2 className="font-display font-bold text-xl text-stone-900 border-b border-stone-100 pb-3">
              Care & Management
            </h2>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <h4 className="font-semibold text-stone-800 text-sm">Grooming & Coat Care</h4>
                <p className="text-xs text-stone-600 leading-relaxed">Grooming Frequency: <strong className="capitalize">{breed.care.groomingFrequency}</strong>. Requires standard care suitable for coat length.</p>
              </div>
              <div className="space-y-1.5">
                <h4 className="font-semibold text-stone-800 text-sm">Dietary Guidelines</h4>
                <p className="text-xs text-stone-600 leading-relaxed">{breed.care.dietNotes}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
