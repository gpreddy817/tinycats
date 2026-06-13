# Data Schema — TinyCats

**Version:** 1.0  
**Last Updated:** 2025-06-13

---

## 1. Overview

TinyCats is client-side in v1. There is no traditional database. Data lives in three places:

| Layer | Content |
|---|---|
| Redux store (in-memory) | App state: quiz answers, chat history, recommendations |
| Local Storage | Saved breeds, preferences, anonymous session |
| MCP Server | Canonical breed catalog (queried at runtime) |

TypeScript types serve as the schema. All types live in `src/types/`.

---

## 2. Core Types

### 2.1 Breed

```typescript
// src/types/breed.ts

export type AllergenLevel = 1 | 2 | 3 | 4 | 5;  // 1=hypoallergenic, 5=heavy shedder
export type TraitScore = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
export type SizeCategory = 'small' | 'medium' | 'large';
export type CoatLength = 'short' | 'medium' | 'long' | 'hairless';
export type OriginRegion =
  | 'North America' | 'United Kingdom' | 'Europe'
  | 'Middle East' | 'Asia' | 'Africa' | 'Australia';

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
  lifespan: { min: number; max: number };   // years
}

export interface Breed {
  id: string;                   // e.g. "ragdoll"
  name: string;                 // e.g. "Ragdoll"
  slug: string;                 // URL-safe, same as id
  tagline: string;              // e.g. "The gentle giant of the cat world"
  description: string;          // 2–3 paragraph overview
  origin: OriginRegion;
  size: SizeCategory;
  coatLength: CoatLength;
  traits: BreedTraits;
  care: BreedCareGuide;
  images: {
    hero: string;               // URL
    gallery: string[];          // URLs, up to 6
  };
  tags: string[];               // e.g. ["apartment", "hypoallergenic", "lap-cat"]
  adoptionLinks: AdoptionLink[];
  createdAt: string;            // ISO 8601
  updatedAt: string;
}

export interface AdoptionLink {
  label: string;                // e.g. "The Ragdoll Society"
  url: string;
  type: 'rescue' | 'registry' | 'breeder-directory';
}
```

---

### 2.2 Quiz

```typescript
// src/types/quiz.ts

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
  household: HouseholdType[];   // multi-select
  freeText?: string;            // optional step 7
}

export interface QuizState {
  currentStep: number;          // 0-indexed
  totalSteps: number;
  answers: Partial<QuizAnswers>;
  completed: boolean;
  startedAt: string | null;     // ISO 8601
  completedAt: string | null;
}
```

---

### 2.3 Chat

```typescript
// src/types/chat.ts

export type MessageRole = 'user' | 'assistant' | 'system';

export interface Message {
  id: string;                   // uuid
  role: MessageRole;
  content: string;
  timestamp: string;            // ISO 8601
  isStreaming?: boolean;        // true while chunk is being appended
}

export interface ChatState {
  messages: Message[];
  isStreaming: boolean;
  error: string | null;
  sessionId: string;            // uuid, per session
  context: ChatContext | null;
}

export interface ChatContext {
  quizAnswers: QuizAnswers;
  topRecommendationIds: string[];
}
```

---

### 2.4 Recommendations

```typescript
// src/types/recommendations.ts

export interface BreedRecommendation {
  breedId: string;
  breedName: string;
  matchScore: number;           // 0–100
  matchReasons: string[];       // ["Great for small spaces", "Hypoallergenic"]
  aiSummary: string;            // 1–2 sentences, AI-generated
  rank: number;                 // 1 = best match
}

export interface RecommendationsState {
  results: BreedRecommendation[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  generatedAt: string | null;   // ISO 8601
}
```

---

## 3. Local Storage Schema

Keys under `tinycats:` namespace to avoid collisions.

```typescript
interface LocalStorageSchema {
  'tinycats:savedBreeds': string[];         // breed IDs
  'tinycats:lastQuizAnswers': QuizAnswers;  // restore on revisit
  'tinycats:compareList': string[];         // up to 3 breed IDs
  'tinycats:sessionId': string;             // anonymous session uuid
  'tinycats:preferences': UserPreferences;
}

interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  hasCompletedQuiz: boolean;
}
```

All values are JSON-serialized. Utility in `src/utils/storage.ts` handles get/set with type safety and error handling.

---

## 4. MCP Tool Schemas

Tools served by the MCP server. Inputs and outputs are JSON Schema compliant.

### `get_breed_list`

Input: `{}`

Output:
```json
{
  "breeds": [
    { "id": "ragdoll", "name": "Ragdoll", "tags": ["lap-cat", "calm"] }
  ]
}
```

### `get_breed_detail`

Input:
```json
{ "breedId": "ragdoll" }
```

Output: Full `Breed` object (see §2.1).

### `search_breeds`

Input:
```json
{
  "filters": {
    "maxAllergenLevel": 2,
    "minChildFriendly": 7,
    "livingSpace": "apartment",
    "tags": ["calm"]
  },
  "limit": 10
}
```

Output:
```json
{
  "breeds": [ /* Breed[] */ ],
  "total": 12
}
```

---

## 5. Gemini Prompt Schema

The recommendation prompt is structured to request a predictable JSON response from Gemini.

```typescript
interface GeminiRecommendationResponse {
  recommendations: Array<{
    breedId: string;
    matchScore: number;          // 0–100
    matchReasons: string[];      // 2–4 bullet strings
    aiSummary: string;
  }>;
  intro: string;                 // Opening line for the chat panel
}
```

System prompt instructs Gemini to respond only in this JSON envelope. Response is parsed and validated before being written to Redux.
