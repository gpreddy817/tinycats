export type AllergenLevel = 1 | 2 | 3 | 4 | 5; // 1=hypoallergenic, 5=heavy shedder
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
  energy: TraitScore;           // 1=couch potato, 10=extremely active
  grooming: TraitScore;         // 1=minimal, 10=high maintenance
  sociability: TraitScore;      // 1=independent, 10=velcro cat
  intelligence: TraitScore;     // 1=laid-back, 10=highly curious
  vocalness: TraitScore;        // 1=silent, 10=very chatty
  allergenLevel: AllergenLevel; // 1=hypoallergenic, 5=heavy shedder
  childFriendly: TraitScore;    // 1=not recommended, 10=excellent
  dogFriendly: TraitScore;
  strangerFriendly: TraitScore;
}

export interface BreedCareGuide {
  groomingFrequency: 'daily' | '2-3x/week' | 'weekly' | 'monthly';
  dietNotes: string;
  exerciseNeeds: string;
  commonHealthIssues: string[];
  lifespan: { min: number; max: number }; // years
}

export interface AdoptionLink {
  label: string;
  url: string;
  type: 'rescue' | 'registry' | 'breeder-directory';
}

export interface Breed {
  id: string;         // e.g. "ragdoll"
  name: string;       // e.g. "Ragdoll"
  slug: string;       // URL-safe, same as id
  tagline: string;    // e.g. "The gentle giant of the cat world"
  description: string;
  origin: OriginRegion;
  size: SizeCategory;
  coatLength: CoatLength;
  traits: BreedTraits;
  care: BreedCareGuide;
  images: {
    hero: string;      // URL
    gallery: string[]; // URLs, up to 6
  };
  tags: string[];
  adoptionLinks: AdoptionLink[];
  updatedAt: string;  // ISO 8601
}

export interface BreedsState {
  entities: Record<string, Breed>;
  ids: string[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  savedBreeds: string[];   // breed IDs saved by user
  compareList: string[];   // up to 3 breed IDs
  usingFallback: boolean;
}
