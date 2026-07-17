import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import {
  selectCurrentStep,
  selectTotalSteps,
  selectQuizAnswers,
  setAnswer,
  nextStep,
  prevStep,
  completeQuiz,
} from './quizSlice';
import { fetchRecommendations } from '@/features/recommendations/recommendationsSlice';
import { selectAllBreeds } from '@/features/breeds/breedsSlice';
import { QuizStep } from './QuizStep';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, Sparkles, Check } from 'lucide-react';

export const QuizWizard: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  
  const currentStep = useAppSelector(selectCurrentStep);
  const totalSteps = useAppSelector(selectTotalSteps);
  const answers = useAppSelector(selectQuizAnswers);
  const allBreeds = useAppSelector(selectAllBreeds);

  const handleAnswer = (key: any, value: any) => {
    dispatch(setAnswer({ key, value }));
  };

  const handleNext = () => {
    if (currentStep === totalSteps - 1) {
      // Complete quiz and fetch recommendations thunk
      dispatch(completeQuiz());
      dispatch(fetchRecommendations(answers));
      navigate('/results');
    } else {
      dispatch(nextStep());
    }
  };

  const handleBack = () => {
    dispatch(prevStep());
  };

  // Real-time matching scoring algorithm for the sidebar
  const liveMatches = useMemo(() => {
    if (!allBreeds || allBreeds.length === 0) return [];

    const scored = allBreeds.map((breed) => {
      let score = 0;
      let totalWeight = 0;

      // 1. Living Space
      if (answers.livingSpace) {
        totalWeight += 2;
        if (answers.livingSpace === 'apartment') {
          // Prefers quiet, small/medium, indoor-friendly cats
          score += breed.size !== 'large' ? 2 : 0;
          score += breed.traits.energy <= 5 ? 2 : 0;
        } else if (answers.livingSpace === 'house') {
          score += 2; // Houses fit all cats
        } else if (answers.livingSpace === 'house-outdoor') {
          // Prefers active or outdoor-friendly breeds
          score += breed.traits.energy >= 6 ? 2 : 1;
        }
      }

      // 2. Activity Level
      if (answers.activityLevel) {
        totalWeight += 3;
        const target = answers.activityLevel === 'low' ? 3 : answers.activityLevel === 'moderate' ? 6 : 9;
        const diff = Math.abs(breed.traits.energy - target);
        score += Math.max(0, 3 - diff * 0.5);
      }

      // 3. Allergy Sensitivity
      if (answers.allergySensitivity) {
        totalWeight += 3;
        if (answers.allergySensitivity === 'severe') {
          score += breed.traits.allergenLevel <= 2 ? 3 : 0;
        } else if (answers.allergySensitivity === 'mild') {
          score += breed.traits.allergenLevel <= 3 ? 3 : 1;
        } else {
          score += 3; // Any breed fits
        }
      }

      // 4. Cat Experience
      if (answers.catExperience) {
        totalWeight += 2;
        if (answers.catExperience === 'first-time') {
          // Use 10 - sociability as a proxy for independence
          const independence = 10 - breed.traits.sociability;
          score += independence <= 6 ? 2 : 0;
        } else {
          score += 2; // Experienced fit any
        }
      }

      // 5. Affection Preference
      if (answers.affectionPreference) {
        totalWeight += 3;
        const target = answers.affectionPreference === 'independent' ? 2 : answers.affectionPreference === 'balanced' ? 6 : 10;
        const diff = Math.abs(breed.traits.sociability - target);
        score += Math.max(0, 3 - diff * 0.5);
      }

      // 6. Household Type
      if (answers.household && answers.household.length > 0) {
        totalWeight += answers.household.length * 2;
        answers.household.forEach((h) => {
          if (h === 'kids') {
            score += breed.traits.childFriendly >= 7 ? 2 : 0;
          } else if (h === 'other-pets') {
            score += breed.traits.dogFriendly >= 7 ? 2 : 0;
          } else {
            score += 2;
          }
        });
      }

      const matchPct = totalWeight > 0 ? Math.round((score / totalWeight) * 100) : 0;

      return {
        breed,
        matchPct,
      };
    });

    // Sort by match percentage desc and pick top 2
    return scored
      .filter((item) => item.matchPct > 40)
      .sort((a, b) => b.matchPct - a.matchPct)
      .slice(0, 2);
  }, [answers, allBreeds]);

  // Is current step filled?
  const canProceed = useMemo(() => {
    switch (currentStep) {
      case 0: return !!answers.livingSpace;
      case 1: return !!answers.activityLevel;
      case 2: return !!answers.allergySensitivity;
      case 3: return !!answers.catExperience;
      case 4: return !!answers.affectionPreference;
      case 5: return !!answers.household && answers.household.length > 0;
      case 6: return true; // freeText is optional
      default: return false;
    }
  }, [currentStep, answers]);

  const progressPercentage = ((currentStep + 1) / totalSteps) * 100;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Quiz Form Column */}
      <div className="lg:col-span-8 glass rounded-3xl p-6 sm:p-10 shadow-premium flex flex-col min-h-[500px] bg-white/50 hover:bg-white/60 transition-colors duration-300">
        {/* Progress header */}
        <div className="mb-8">
          <div className="flex justify-between items-center text-xs font-semibold text-stone-500 mb-2">
            <span className="uppercase tracking-wider">Personality Quiz</span>
            <span>Step {currentStep + 1} of {totalSteps}</span>
          </div>
          <div className="w-full bg-white/40 border border-white/20 h-2 rounded-full overflow-hidden">
            <div
              className="bg-primary h-2 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>

        {/* Step Content */}
        <div className="flex-grow">
          <QuizStep
            step={currentStep}
            answers={answers}
            onAnswer={handleAnswer}
          />
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center pt-8 border-t border-white/20 mt-8">
          <Button
            type="button"
            variant="outline"
            onClick={handleBack}
            disabled={currentStep === 0}
            className="flex items-center gap-2"
          >
            <ArrowLeft size={16} />
            <span>Back</span>
          </Button>

          <Button
            type="button"
            variant={currentStep === totalSteps - 1 ? 'sage' : 'primary'}
            onClick={handleNext}
            disabled={!canProceed}
            className="flex items-center gap-2 min-w-[120px]"
          >
            {currentStep === totalSteps - 1 ? (
              <>
                <span>Get Matches</span>
                <Sparkles size={16} />
              </>
            ) : (
              <>
                <span>Next</span>
                <ArrowRight size={16} />
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Live Matching Sidebar Column */}
      <div className="lg:col-span-4 glass rounded-3xl p-6 shadow-premium sticky top-24 self-start bg-white/50 hover:bg-white/60 transition-colors duration-300">
        <div className="flex items-center gap-2 mb-4">
          <div className="bg-primary/10 text-primary p-2 rounded-xl border border-primary/20">
            <Sparkles size={18} />
          </div>
          <div>
            <h3 className="font-display font-bold text-lg text-stone-900 leading-tight">Live Matches</h3>
            <p className="text-[10px] text-stone-500">Updating as you answer</p>
          </div>
        </div>

        <div className="space-y-4">
          {liveMatches.length === 0 ? (
            <div className="text-center py-10 text-stone-400 bg-white/25 rounded-2xl border border-dashed border-white/40">
              <p className="text-xs">Answer a few questions to see your matches in real-time!</p>
            </div>
          ) : (
            liveMatches.map(({ breed, matchPct }) => (
              <div
                key={breed.id}
                className="flex items-center gap-3 p-3 bg-white/30 glass rounded-2xl shadow-sm hover:border-primary/20 transition-all duration-200"
              >
                <img
                  src={breed.images.hero}
                  alt={breed.name}
                  className="w-12 h-12 rounded-xl object-cover"
                />
                <div className="flex-grow min-w-0">
                  <h4 className="font-bold text-stone-800 text-sm truncate">{breed.name}</h4>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="text-[10px] font-bold text-accent">{matchPct}% Match</span>
                    <span className="text-[9px] text-stone-400">•</span>
                    <span className="text-[10px] text-stone-500 capitalize truncate">{breed.size} size</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="mt-6 pt-4 border-t border-white/25 text-left">
          <h4 className="font-bold text-stone-800 text-xs mb-2">Quiz Summary</h4>
          <div className="flex flex-wrap gap-1.5">
            {answers.livingSpace && (
              <span className="text-[9px] font-semibold bg-white/40 border border-white/30 text-stone-600 px-2 py-0.5 rounded-full flex items-center gap-1">
                <Check size={10} className="text-sage" />
                <span>Living: {answers.livingSpace}</span>
              </span>
            )}
            {answers.activityLevel && (
              <span className="text-[9px] font-semibold bg-white/40 border border-white/30 text-stone-600 px-2 py-0.5 rounded-full flex items-center gap-1">
                <Check size={10} className="text-sage" />
                <span>Activity: {answers.activityLevel}</span>
              </span>
            )}
            {answers.allergySensitivity && (
              <span className="text-[9px] font-semibold bg-white/40 border border-white/30 text-stone-600 px-2 py-0.5 rounded-full flex items-center gap-1">
                <Check size={10} className="text-sage" />
                <span>Allergies: {answers.allergySensitivity}</span>
              </span>
            )}
            {answers.catExperience && (
              <span className="text-[9px] font-semibold bg-white/40 border border-white/30 text-stone-600 px-2 py-0.5 rounded-full flex items-center gap-1">
                <Check size={10} className="text-sage" />
                <span>Experience: {answers.catExperience}</span>
              </span>
            )}
        </div>
      </div>
    </div>
  </div>
  );
};
