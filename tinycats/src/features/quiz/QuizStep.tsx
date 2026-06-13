import { cn } from '@/lib/utils';
import type {
  LivingSpace,
  ActivityLevel,
  AllergySensitivity,
  CatExperience,
  AffectionPreference,
  HouseholdType,
  QuizAnswers,
} from '@/types/quiz';

export interface QuizStepDef {
  id: keyof QuizAnswers;
  question: string;
  emoji: string;
  type: 'single' | 'multi' | 'text';
  options?: Array<{ value: string; label: string; emoji: string; description?: string }>;
  placeholder?: string;
}

export const QUIZ_STEPS: QuizStepDef[] = [
  {
    id: 'livingSpace',
    question: 'What is your living situation?',
    emoji: '🏠',
    type: 'single',
    options: [
      { value: 'apartment' as LivingSpace, label: 'Apartment', emoji: '🏢', description: 'No outdoor access' },
      { value: 'house' as LivingSpace, label: 'House', emoji: '🏡', description: 'Indoor only' },
      { value: 'house-outdoor' as LivingSpace, label: 'House with outdoor access', emoji: '🌿', description: 'Garden or enclosed yard' },
    ],
  },
  {
    id: 'activityLevel',
    question: 'How would you describe your activity level?',
    emoji: '⚡',
    type: 'single',
    options: [
      { value: 'low' as ActivityLevel, label: 'Couch potato', emoji: '🛋️', description: 'I prefer calm, relaxed days' },
      { value: 'moderate' as ActivityLevel, label: 'Moderately active', emoji: '🚶', description: 'Active but enjoy downtime' },
      { value: 'high' as ActivityLevel, label: 'Very active', emoji: '🏃', description: 'I love interactive play' },
    ],
  },
  {
    id: 'allergySensitivity',
    question: 'Do you have cat allergies?',
    emoji: '🤧',
    type: 'single',
    options: [
      { value: 'none' as AllergySensitivity, label: 'No allergies', emoji: '✅', description: 'Any breed works for me' },
      { value: 'mild' as AllergySensitivity, label: 'Mild sensitivity', emoji: '😊', description: 'Some breeds are better than others' },
      { value: 'severe' as AllergySensitivity, label: 'Severe allergies', emoji: '⚠️', description: 'Need hypoallergenic only' },
    ],
  },
  {
    id: 'catExperience',
    question: 'What is your experience with cats?',
    emoji: '🐾',
    type: 'single',
    options: [
      { value: 'first-time' as CatExperience, label: 'First-time owner', emoji: '🌱', description: 'Never had a cat before' },
      { value: 'experienced' as CatExperience, label: 'Experienced', emoji: '😺', description: 'Had cats before' },
      { value: 'very-experienced' as CatExperience, label: 'Very experienced', emoji: '🏆', description: 'Multiple cats, breeding experience' },
    ],
  },
  {
    id: 'affectionPreference',
    question: 'How affectionate do you want your cat to be?',
    emoji: '💜',
    type: 'single',
    options: [
      { value: 'independent' as AffectionPreference, label: 'Independent', emoji: '🌙', description: 'Low-maintenance, does its own thing' },
      { value: 'balanced' as AffectionPreference, label: 'Balanced', emoji: '⚖️', description: 'Affectionate but not clingy' },
      { value: 'velcro' as AffectionPreference, label: 'Velcro cat', emoji: '🫂', description: 'Always by my side' },
    ],
  },
  {
    id: 'household',
    question: 'Who else lives in your home?',
    emoji: '👨‍👩‍👧',
    type: 'multi',
    options: [
      { value: 'solo' as HouseholdType, label: 'Just me', emoji: '🙋', description: 'Living alone' },
      { value: 'adults' as HouseholdType, label: 'Partner / adults only', emoji: '👫', description: 'No children' },
      { value: 'kids' as HouseholdType, label: 'Children in the home', emoji: '👶', description: 'Kids under 12' },
      { value: 'other-pets' as HouseholdType, label: 'Other pets', emoji: '🐕', description: 'Dogs or other animals' },
    ],
  },
  {
    id: 'freeText',
    question: 'Anything else we should know?',
    emoji: '✏️',
    type: 'text',
    placeholder: 'e.g. "I work from home," "I have a very small apartment," "I want a cat that gets along with my dog Buddy"…',
  },
];

interface QuizStepProps {
  step: QuizStepDef;
  value: QuizAnswers[keyof QuizAnswers] | undefined;
  onChange: (value: QuizAnswers[keyof QuizAnswers]) => void;
}

export function QuizStep({ step, value, onChange }: QuizStepProps) {
  if (step.type === 'text') {
    return (
      <div className="flex flex-col gap-3">
        <textarea
          id={`quiz-step-${step.id}`}
          className="w-full rounded-xl border p-4 text-base resize-none focus:outline-none"
          style={{
            borderColor: 'var(--color-border)',
            color: 'var(--color-text-primary)',
            backgroundColor: 'var(--color-card)',
            minHeight: '120px',
            fontFamily: 'var(--font-sans)',
            outlineColor: 'var(--color-primary)',
          }}
          placeholder={step.placeholder}
          value={(value as string | undefined) ?? ''}
          onChange={(e) => onChange(e.target.value)}
          aria-label={step.question}
          maxLength={500}
        />
        <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
          Optional — skip if nothing to add
        </p>
      </div>
    );
  }

  if (step.type === 'multi') {
    const selected = (value as string[] | undefined) ?? [];
    const handleToggle = (optValue: string) => {
      const newVal = selected.includes(optValue)
        ? selected.filter((v) => v !== optValue)
        : [...selected, optValue];
      onChange(newVal as QuizAnswers[keyof QuizAnswers]);
    };

    return (
      <div className="flex flex-col gap-3" role="group" aria-label={step.question}>
        {step.options?.map((opt) => {
          const isSelected = selected.includes(opt.value);
          return (
            <button
              key={opt.value}
              id={`quiz-opt-${step.id}-${opt.value}`}
              type="button"
              role="checkbox"
              aria-checked={isSelected}
              onClick={() => handleToggle(opt.value)}
              className={cn(
                'flex items-center gap-4 w-full h-14 px-5 rounded-xl border-2 text-left transition-all duration-150',
                isSelected
                  ? 'border-[var(--color-primary)] bg-[var(--color-primary-light)]'
                  : 'border-[var(--color-border)] bg-[var(--color-card)] hover:border-[var(--color-primary)] hover:bg-[var(--color-primary-light)]'
              )}
            >
              <span className="text-xl" aria-hidden="true">{opt.emoji}</span>
              <div className="flex flex-col min-w-0">
                <span className="font-semibold text-sm" style={{ color: 'var(--color-text-primary)' }}>
                  {opt.label}
                </span>
                {opt.description && (
                  <span className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
                    {opt.description}
                  </span>
                )}
              </div>
              {isSelected && (
                <span className="ml-auto text-[var(--color-primary)]" aria-hidden="true">✓</span>
              )}
            </button>
          );
        })}
      </div>
    );
  }

  // Single select
  return (
    <div className="flex flex-col gap-3" role="radiogroup" aria-label={step.question}>
      {step.options?.map((opt) => {
        const isSelected = value === opt.value;
        return (
          <button
            key={opt.value}
            id={`quiz-opt-${step.id}-${opt.value}`}
            type="button"
            role="radio"
            aria-checked={isSelected}
            onClick={() => onChange(opt.value as QuizAnswers[keyof QuizAnswers])}
            className={cn(
              'flex items-center gap-4 w-full h-14 px-5 rounded-xl border-2 text-left transition-all duration-150',
              isSelected
                ? 'border-[var(--color-primary)] bg-[var(--color-primary-light)]'
                : 'border-[var(--color-border)] bg-[var(--color-card)] hover:border-[var(--color-primary)] hover:bg-[var(--color-primary-light)]'
            )}
          >
            <span className="text-xl" aria-hidden="true">{opt.emoji}</span>
            <div className="flex flex-col min-w-0">
              <span className="font-semibold text-sm" style={{ color: 'var(--color-text-primary)' }}>
                {opt.label}
              </span>
              {opt.description && (
                <span className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
                  {opt.description}
                </span>
              )}
            </div>
            {isSelected && (
              <span className="ml-auto text-[var(--color-primary)]" aria-hidden="true">✓</span>
            )}
          </button>
        );
      })}
    </div>
  );
}

export default QuizStep;
