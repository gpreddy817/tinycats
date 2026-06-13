import type { QuizAnswers } from '@/types/quiz';
import type { BreedRecommendation } from '@/types/recommendations';

export interface ShareableState {
  answers: QuizAnswers;
  topBreedIds: string[];
}

/**
 * Encodes quiz answers + top breed IDs into a base64 URL-safe string.
 */
export function encodeState(state: ShareableState): string {
  try {
    const json = JSON.stringify(state);
    return btoa(encodeURIComponent(json));
  } catch {
    return '';
  }
}

/**
 * Decodes a share param back into a ShareableState object.
 * Returns null if decoding fails.
 */
export function decodeState(param: string): ShareableState | null {
  try {
    const json = decodeURIComponent(atob(param));
    return JSON.parse(json) as ShareableState;
  } catch {
    return null;
  }
}

/**
 * Builds a shareable URL with the state encoded as a query param.
 */
export function buildShareUrl(answers: QuizAnswers, results: BreedRecommendation[]): string {
  const state: ShareableState = {
    answers,
    topBreedIds: results.slice(0, 3).map((r) => r.breedId),
  };
  const encoded = encodeState(state);
  const url = new URL(window.location.href);
  url.pathname = '/results';
  url.searchParams.set('share', encoded);
  return url.toString();
}
