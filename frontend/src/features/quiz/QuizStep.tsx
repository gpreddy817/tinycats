import React from 'react';
import { Home, Landmark, Trees, ShieldCheck, ShieldAlert, Heart, Users, Award, Smile, Flame, ShieldPlus, Baby, Cat, MessageSquare, Activity } from 'lucide-react';
import type { QuizAnswers } from '@/types/quiz';

interface QuizStepProps {
  step: number;
  answers: Partial<QuizAnswers>;
  onAnswer: (key: keyof QuizAnswers, value: any) => void;
}

export const QuizStep: React.FC<QuizStepProps> = ({ step, answers, onAnswer }) => {
  // Option Card render helper
  const renderCard = (
    key: keyof QuizAnswers,
    value: string,
    label: string,
    desc: string,
    icon: React.ReactNode,
    isMulti = false
  ) => {
    const isSelected = isMulti
      ? ((answers[key] as string[]) || []).includes(value)
      : answers[key] === value;

    const handleSelect = () => {
      if (isMulti) {
        const currentList = (answers[key] as string[]) || [];
        if (currentList.includes(value)) {
          onAnswer(
            key,
            currentList.filter((item) => item !== value)
          );
        } else {
          onAnswer(key, [...currentList, value]);
        }
      } else {
        onAnswer(key, value);
      }
    };

    return (
      <button
        type="button"
        onClick={handleSelect}
        className={`flex items-start gap-4 p-5 rounded-2xl border text-left transition-all duration-300 w-full cursor-pointer focus:outline-none hover:scale-[1.01] hover:shadow-md ${
          isSelected
            ? 'border-sage bg-white/95 shadow-md ring-1 ring-sage'
            : 'border-white/30 bg-white/40 glass hover:border-stone-300/40 hover:bg-white/60'
        }`}
      >
        <div
          className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${
            isSelected
              ? 'bg-sage text-white'
              : 'bg-white/50 text-stone-600 border border-white/20'
          }`}
        >
          {icon}
        </div>
        <div>
          <h4 className="font-semibold text-stone-900 text-base mb-0.5">{label}</h4>
          <p className="text-xs text-stone-500 leading-normal">{desc}</p>
        </div>
      </button>
    );
  };

  switch (step) {
    case 0:
      return (
        <div className="space-y-6">
          <div className="mb-4">
            <h3 className="font-display font-bold text-2xl text-stone-900 mb-2">What is your living arrangement?</h3>
            <p className="text-sm text-stone-600">Cats thrive in different environments. Help us understand your home structure.</p>
          </div>
          <div className="grid grid-cols-1 gap-4">
            {renderCard('livingSpace', 'apartment', 'Apartment / Condo', 'Cozy space, perfect for quiet and less active breeds.', <Home size={22} />)}
            {renderCard('livingSpace', 'house', 'House (Indoor only)', 'Spacious home with plenty of room to roam and play safely indoors.', <Landmark size={22} />)}
            {renderCard('livingSpace', 'house-outdoor', 'House (Indoor & Outdoor access)', 'Safe yard or patio space for climbing, exploration, and hunting.', <Trees size={22} />)}
          </div>
        </div>
      );

    case 1:
      return (
        <div className="space-y-6">
          <div className="mb-4">
            <h3 className="font-display font-bold text-2xl text-stone-900 mb-2">How active would you like your cat to be?</h3>
            <p className="text-sm text-stone-600">Some cats are high-energy acrobats; others are master nap-takers.</p>
          </div>
          <div className="grid grid-cols-1 gap-4">
            {renderCard('activityLevel', 'low', 'Quiet & Chill', 'Laid-back, enjoys napping, cuddle sessions, and calm environments.', <Smile size={22} />)}
            {renderCard('activityLevel', 'moderate', 'Moderately Playful', 'Enjoys toys, social interactions, and daily play sessions.', <Activity size={22} />)}
            {renderCard('activityLevel', 'high', 'High Energy / Acrobat', 'Bouncing off walls, climbing tall furniture, highly intelligent, needs constant stimulation.', <Flame size={22} />)}
          </div>
        </div>
      );

    case 2:
      return (
        <div className="space-y-6">
          <div className="mb-4">
            <h3 className="font-display font-bold text-2xl text-stone-900 mb-2">Any allergy concerns in your home?</h3>
            <p className="text-sm text-stone-600">While no cat is 100% hypoallergenic, some produce significantly fewer allergens.</p>
          </div>
          <div className="grid grid-cols-1 gap-4">
            {renderCard('allergySensitivity', 'none', 'No Allergies', 'Zero concerns. Can adopt high-shedding or fluffy cats.', <ShieldCheck size={22} />)}
            {renderCard('allergySensitivity', 'mild', 'Mild Sneezes / Sensitive', 'React to some cats. Hypoallergenic or low-shedding breeds preferred.', <ShieldPlus size={22} />)}
            {renderCard('allergySensitivity', 'severe', 'Severe Allergies', 'Significant allergy issues. Need highly hypoallergenic, low-dander, or hairless breeds.', <ShieldAlert size={22} />)}
          </div>
        </div>
      );

    case 3:
      return (
        <div className="space-y-6">
          <div className="mb-4">
            <h3 className="font-display font-bold text-2xl text-stone-900 mb-2">What is your cat ownership experience?</h3>
            <p className="text-sm text-stone-600">Some cats are highly independent and easy-going; others demand experienced handling.</p>
          </div>
          <div className="grid grid-cols-1 gap-4">
            {renderCard('catExperience', 'first-time', 'First-Time Owner', 'Looking for a forgiving, friendly, and low-maintenance personality.', <Users size={22} />)}
            {renderCard('catExperience', 'experienced', 'Have Owned Cats Before', 'Comfortable with grooming, dietary guidelines, and typical cat quirks.', <Award size={22} />)}
            {renderCard('catExperience', 'very-experienced', 'Cat Connoisseur', 'Experienced with complex behaviors, medical care, high-needs or exotic breeds.', <Cat size={22} />)}
          </div>
        </div>
      );

    case 4:
      return (
        <div className="space-y-6">
          <div className="mb-4">
            <h3 className="font-display font-bold text-2xl text-stone-900 mb-2">What type of bond do you want?</h3>
            <p className="text-sm text-stone-600">How much attention and physical contact do you want from your cat?</p>
          </div>
          <div className="grid grid-cols-1 gap-4">
            {renderCard('affectionPreference', 'independent', 'Independent & Cool', 'Happy being home alone, likes affection on their own terms.', <Landmark size={22} />)}
            {renderCard('affectionPreference', 'balanced', 'Friendly but Self-Sufficient', 'Welcomes you at the door, likes playtime, but content during the work day.', <Smile size={22} />)}
            {renderCard('affectionPreference', 'velcro', 'Velcro Cat / constant sidekick', 'Wants to be in your lap, follows you room-to-room, craves intense attachment.', <Heart size={22} />)}
          </div>
        </div>
      );

    case 5:
      return (
        <div className="space-y-6">
          <div className="mb-4">
            <h3 className="font-display font-bold text-2xl text-stone-900 mb-2">Who shares your household?</h3>
            <p className="text-sm text-stone-600">Select all that apply. This helps us filter for child-safe or multi-pet friendly cats.</p>
          </div>
          <div className="grid grid-cols-1 gap-4">
            {renderCard('household', 'solo', 'I live alone', 'Perfect quiet environment for more introverted breeds.', <Users size={22} />, true)}
            {renderCard('household', 'adults', 'Other Adults', 'A bustling adult household with multiple social partners.', <Users size={22} />, true)}
            {renderCard('household', 'kids', 'Children / Toddlers', 'Need breeds with exceptional patience, gentle nature, and high playfulness.', <Baby size={22} />, true)}
            {renderCard('household', 'other-pets', 'Other Pets (Dogs/Cats)', 'Need breeds known for high sociability and ease with other animals.', <Cat size={22} />, true)}
          </div>
        </div>
      );

    case 6:
      return (
        <div className="space-y-6">
          <div className="mb-4">
            <h3 className="font-display font-bold text-2xl text-stone-900 mb-2">Anything else we should know?</h3>
            <p className="text-sm text-stone-600">Specify vocal habits, grooming concerns, custom quirks or anything else. Gemini AI will incorporate this into your results!</p>
          </div>
          <div className="glass bg-white/40 rounded-2xl border border-white/20 p-5 focus-within:ring-1 focus-within:ring-sage focus-within:border-sage transition-all duration-200 hover:bg-white/60">
            <div className="flex items-center gap-2 mb-3 text-stone-500">
              <MessageSquare size={18} />
              <span className="text-xs font-bold uppercase tracking-wider">Custom Preferences</span>
            </div>
            <textarea
              className="w-full min-h-32 text-stone-700 bg-transparent border-0 p-0 focus:outline-none focus:ring-0 text-sm resize-none"
              placeholder="e.g. 'I want a vocal cat that chats with me', 'Must get along with a high energy Golden Retriever', 'Low grooming is a must!'"
              value={answers.freeText || ''}
              onChange={(e) => onAnswer('freeText', e.target.value)}
            />
          </div>
        </div>
      );

    default:
      return null;
  }
};
