export interface BreedRecommendation {
  breedId: string;
  breedName: string;
  matchScore: number;          // 0–100
  matchReasons: string[];      // ["Great for small spaces", "Hypoallergenic"]
  aiSummary: string;           // 1–2 sentences, AI-generated
  rank: number;                // 1 = best match
}

export interface RecommendationsState {
  results: BreedRecommendation[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  generatedAt: string | null;  // ISO 8601
}

export interface GeminiRecommendationResponse {
  recommendations: Array<{
    breedId: string;
    matchScore: number;
    matchReasons: string[];
    aiSummary: string;
  }>;
  intro: string;
}
