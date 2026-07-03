export type LivingSpace = 'apartment' | 'house' | 'house-outdoor';
export type ActivityLevel = 'low' | 'moderate' | 'high';
export type AllergySensitivity = 'none' | 'mild' | 'severe';
export type CatExperience = 'first-time' | 'experienced' | 'very-experienced';
export type AffectionPreference = 'independent' | 'balanced' | 'velcro';
export type HouseholdType = 'solo' | 'adults' | 'kids' | 'other-pets';

export interface QuizAnswers {
  livingSpace: LivingSpace;
  activityLevel: ActivityLevel;
  allergySensitivity: AllergySensitivity;
  catExperience: CatExperience;
  affectionPreference: AffectionPreference;
  household: HouseholdType[];
  freeText?: string;
}

export interface QuizState {
  currentStep: number;
  totalSteps: number;
  answers: Partial<QuizAnswers>;
  completed: boolean;
  startedAt: string | null;
  completedAt: string | null;
}
