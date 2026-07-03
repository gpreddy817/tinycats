import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Scale, Sparkles, ArrowRight } from 'lucide-react';
import type { Breed } from '@/types/breed';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import {
  toggleSaveBreed,
  addToCompare,
  removeFromCompare,
  selectSavedBreeds,
  selectCompareList,
} from './breedsSlice';
import { MatchBadge } from '@/components/MatchBadge';

interface BreedCardProps {
  breed: Breed;
  matchScore?: number;
  matchReasons?: string[];
  rank?: number;
}

export const BreedCard: React.FC<BreedCardProps> = ({
  breed,
  matchScore,
  matchReasons,
  rank,
}) => {
  const dispatch = useAppDispatch();
  const savedBreeds = useAppSelector(selectSavedBreeds);
  const compareIds = useAppSelector(selectCompareList);

  const isSaved = savedBreeds.includes(breed.id);
  const isComparing = compareIds.includes(breed.id);

  const handleSave = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(toggleSaveBreed(breed.id));
  };

  const handleCompare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isComparing) {
      dispatch(removeFromCompare(breed.id));
    } else {
      if (compareIds.length >= 3) {
        alert('You can compare up to 3 breeds at a time.');
        return;
      }
      dispatch(addToCompare(breed.id));
    }
  };

  return (
    <div className="group relative bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-premium border border-stone-100 hover:border-primary-container/20 transition-all duration-300 flex flex-col h-full animate-fade-in">
      {/* Rank Indicator */}
      {rank !== undefined && (
        <div className="absolute top-4 left-4 z-10 w-8 h-8 rounded-full bg-primary text-white font-bold flex items-center justify-center text-sm shadow-md">
          #{rank}
        </div>
      )}

      {/* Image & Badges */}
      <div className="relative aspect-5/4 overflow-hidden bg-stone-100">
        <img
          src={breed.images.hero}
          alt={breed.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        
        {/* Transparent dark gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60" />

        {/* Buttons Overlay */}
        <div className="absolute top-4 right-4 flex flex-col gap-2 z-10">
          <button
            onClick={handleSave}
            className={`p-2.5 rounded-full glass shadow-sm transition-all duration-200 cursor-pointer ${
              isSaved ? 'text-primary' : 'text-stone-700 hover:text-primary hover:scale-110'
            }`}
            title={isSaved ? 'Saved to Favorites' : 'Save to Favorites'}
          >
            <Heart size={18} className={isSaved ? 'fill-primary' : ''} />
          </button>

          <button
            onClick={handleCompare}
            className={`p-2.5 rounded-full glass shadow-sm transition-all duration-200 cursor-pointer ${
              isComparing ? 'text-sage' : 'text-stone-700 hover:text-sage hover:scale-110'
            }`}
            title={isComparing ? 'Remove from Compare' : 'Add to Compare'}
          >
            <Scale size={18} className={isComparing ? 'fill-sage/20' : ''} />
          </button>
        </div>

        {/* Match score Badge on image */}
        {matchScore !== undefined && (
          <div className="absolute bottom-4 left-4 z-10">
            <MatchBadge score={matchScore} />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6 flex-grow flex flex-col">
        <div className="mb-2">
          <h3 className="font-display font-bold text-xl text-stone-900 group-hover:text-primary transition-colors">
            {breed.name}
          </h3>
          <p className="text-xs italic text-stone-500 line-clamp-1">{breed.tagline}</p>
        </div>

        <p className="text-sm text-stone-600 line-clamp-3 mb-4 flex-grow">
          {breed.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {breed.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="text-[10px] font-semibold bg-stone-100 text-stone-600 px-2 py-0.5 rounded-full capitalize"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Match Reasons (AI recommendation contexts) */}
        {matchReasons && matchReasons.length > 0 && (
          <div className="mb-4 bg-stone-50 rounded-2xl p-3 border border-stone-100 text-left">
            <div className="flex items-center gap-1 text-[11px] font-bold text-stone-500 uppercase tracking-wider mb-1.5">
              <Sparkles size={12} className="text-accent" />
              <span>Why it matches you</span>
            </div>
            <ul className="space-y-1">
              {matchReasons.slice(0, 2).map((reason, idx) => (
                <li key={idx} className="text-xs text-stone-600 leading-relaxed flex items-start gap-1">
                  <span className="text-primary">•</span>
                  <span>{reason}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Footer Link */}
        <Link
          to={`/breed/${breed.id}`}
          className="mt-auto pt-4 border-t border-stone-100 flex items-center justify-between text-sm font-semibold text-primary hover:text-primary-hover group/link"
        >
          <span>View Breed Profile</span>
          <ArrowRight size={16} className="transform group-hover/link:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  );
};
