export interface BreedRecommendation {
  breedId: string;
  breedName: string;
  matchScore: number;
  matchReasons: string[];
  aiSummary: string;
  rank: number;
}

export interface RecommendationsState {
  results: BreedRecommendation[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  generatedAt: string | null;
}
