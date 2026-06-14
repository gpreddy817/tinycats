export type AllergenLevel = 1 | 2 | 3 | 4 | 5;
export type TraitScore = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
export type SizeCategory = 'small' | 'medium' | 'large';
export type CoatLength = 'short' | 'medium' | 'long' | 'hairless';
export type OriginRegion =
  | 'North America'
  | 'United Kingdom'
  | 'Europe'
  | 'Middle East'
  | 'Asia'
  | 'Africa'
  | 'Australia';

export interface BreedTraits {
  energy: TraitScore;
  grooming: TraitScore;
  sociability: TraitScore;
  intelligence: TraitScore;
  vocalness: TraitScore;
  allergenLevel: AllergenLevel;
  childFriendly: TraitScore;
  dogFriendly: TraitScore;
  strangerFriendly: TraitScore;
}

export interface BreedCareGuide {
  groomingFrequency: 'daily' | '2-3x/week' | 'weekly' | 'monthly';
  dietNotes: string;
  exerciseNeeds: string;
  commonHealthIssues: string[];
  lifespan: { min: number; max: number };
}

export interface AdoptionLink {
  label: string;
  url: string;
  type: 'rescue' | 'registry' | 'breeder-directory';
}

export interface Breed {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  description: string;
  origin: OriginRegion;
  size: SizeCategory;
  coatLength: CoatLength;
  traits: BreedTraits;
  care: BreedCareGuide;
  images: {
    hero: string;
    gallery: string[];
  };
  tags: string[];
  adoptionLinks: AdoptionLink[];
  updatedAt: string;
}
