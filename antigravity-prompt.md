# TinyCats — Antigravity Build Prompt

---

## Overview & Vibe

Build **TinyCats** — a cat breed recommender web app. The user answers a short personality quiz, and a Google Gemini AI returns personalized breed recommendations with match scores. A persistent chat panel lets them ask follow-up questions. The design is warm, playful, and content-first — think a friendly expert, not a clinical tool.

**Before writing any code, generate an implementation plan. I will review and approve it before you proceed.**

---

## Tech Stack (non-negotiable)

- **React 18** with **Vite**
- **TypeScript 5** — strict mode, no `any`
- **Redux Toolkit** for all state management (slices + `createAsyncThunk`)
- **React Router v6** for routing
- **Tailwind CSS** + **shadcn/ui** for components
- **Google Gemini 1.5 Flash** via `@google/generative-ai` for AI features
- **MCP SDK** (`@modelcontextprotocol/sdk`) for breed data
- **Lucide React** for icons
- **pnpm** as the package manager

---

## Project Setup

1. Scaffold with `pnpm create vite@latest tinycats -- --template react-ts`.
2. Install all dependencies listed above.
3. Configure Tailwind with a custom theme (see Design section).
4. Initialize shadcn/ui.
5. Set up path alias `@` → `src/` in both `vite.config.ts` and `tsconfig.json`.
6. Create a `.env.example` with:
   ```
   VITE_GEMINI_API_KEY=
   VITE_MCP_SERVER_URL=
   VITE_APP_ENV=development
   ```
7. Configure Vite dev proxy at `/api/gemini` → `https://generativelanguage.googleapis.com` with `x-goog-api-key` injected from `process.env.GEMINI_API_KEY` (never expose the key to the browser bundle in production).

---

## Directory Structure

Create the following structure exactly:

```
src/
  app/
    store.ts
    hooks.ts           # typed useAppDispatch + useAppSelector
  features/
    quiz/
      quizSlice.ts
      QuizWizard.tsx
      QuizStep.tsx
    chat/
      chatSlice.ts
      ChatPanel.tsx
      MessageBubble.tsx
    breeds/
      breedsSlice.ts
      BreedCard.tsx
      BreedDetail.tsx
      CompareView.tsx
    recommendations/
      recommendationsSlice.ts
      RecommendationList.tsx
  services/
    geminiService.ts
    mcpService.ts
  hooks/
    useGemini.ts
    useMCP.ts
  types/
    breed.ts
    quiz.ts
    chat.ts
    recommendations.ts
  utils/
    storage.ts         # local storage helpers with tinycats: namespace
    shareUtils.ts      # URL-encode/decode state for share links
  data/
    breeds.fallback.json   # static breed data for MCP fallback (min 15 breeds)
  pages/
    HomePage.tsx
    QuizPage.tsx
    ResultsPage.tsx
    BreedPage.tsx
    ComparePage.tsx
    BrowsePage.tsx
  components/
    ui/                # shadcn components live here
    TraitBar.tsx       # reusable horizontal trait score bar
    MatchBadge.tsx     # percentage match pill badge
  App.tsx
  main.tsx
```

---

## TypeScript Types

Define these types precisely. They are the schema for the entire app.

### `src/types/breed.ts`
```typescript
export type AllergenLevel = 1 | 2 | 3 | 4 | 5;
export type TraitScore = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
export type SizeCategory = 'small' | 'medium' | 'large';
export type CoatLength = 'short' | 'medium' | 'long' | 'hairless';

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

export interface Breed {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  description: string;
  origin: string;
  size: SizeCategory;
  coatLength: CoatLength;
  traits: BreedTraits;
  care: BreedCareGuide;
  images: { hero: string; gallery: string[] };
  tags: string[];
  adoptionLinks: Array<{ label: string; url: string; type: 'rescue' | 'registry' | 'breeder-directory' }>;
  updatedAt: string;
}
```

### `src/types/quiz.ts`
```typescript
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
```

### `src/types/chat.ts`
```typescript
export type MessageRole = 'user' | 'assistant' | 'system';

export interface Message {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: string;
  isStreaming?: boolean;
}

export interface ChatContext {
  quizAnswers: QuizAnswers;
  topRecommendationIds: string[];
}

export interface ChatState {
  messages: Message[];
  isStreaming: boolean;
  error: string | null;
  sessionId: string;
  context: ChatContext | null;
}
```

### `src/types/recommendations.ts`
```typescript
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
```

---

## Redux Store

All state management through Redux Toolkit. No direct service calls from components — components dispatch thunks.

### `quizSlice` actions:
- `startQuiz` — sets `startedAt`
- `setAnswer({ key, value })` — updates a single answer field
- `nextStep` / `prevStep` — bounded navigation
- `completeQuiz` — sets `completed: true` + `completedAt`
- `resetQuiz` — returns to `initialState`

### `chatSlice` actions:
- `addMessage({ role, content })` — appends message with generated uuid + timestamp
- `startStreaming(messageId)` — sets `isStreaming: true`, marks message
- `appendToken({ id, token })` — appends streaming token to message content
- `finishStreaming(messageId)` — sets `isStreaming: false`
- `setError(message)` / `clearError`
- `setChatContext(context)`

### `breedsSlice`:
- Async thunks: `fetchBreeds` (via MCP), `fetchBreedDetail(breedId)` (via MCP)
- Sync actions: `toggleSaveBreed(id)`, `addToCompare(id)` (max 3), `removeFromCompare(id)`
- Entities stored as `Record<string, Breed>` with `ids: string[]`

### `recommendationsSlice`:
- Async thunk: `fetchRecommendations(quizAnswers)` — calls Gemini, streams response, parses JSON
- The thunk dispatches `chatSlice.addMessage` for the AI intro message

**Critical:** Gemini streaming generators must be consumed entirely inside the thunk — never store generators in Redux state.

---

## Gemini Service (`src/services/geminiService.ts`)

Two exported async generator functions:

**`streamRecommendations(answers: QuizAnswers)`**
- Model: `gemini-1.5-flash`
- System prompt instructs Gemini to respond ONLY in JSON:
  ```json
  {"recommendations":[{"breedId":"","matchScore":0,"matchReasons":[],"aiSummary":""}],"intro":""}
  ```
- Yields raw string chunks for the caller to accumulate and parse.
- After full response, the caller parses JSON and dispatches to recommendations state.

**`streamChatReply(messages: Message[], userText: string)`**
- Maintains conversation history via `model.startChat({ history })`.
- System personality: "You are TinyCats AI, a warm and knowledgeable cat breed expert."
- Yields string chunks for the caller to dispatch as `appendToken`.

---

## MCP Service (`src/services/mcpService.ts`)

Singleton `BreedMCPClient` class:
- Connects via `SSEClientTransport` to `VITE_MCP_SERVER_URL`.
- Methods: `getBreedList()`, `getBreedDetail(breedId)`, `searchBreeds(filters)`.
- **Every method must have a try/catch.** On failure, log the error and throw — the slice's `extraReducers` rejected case handles it.
- The `breedsSlice` rejected case falls back to `breeds.fallback.json`.

---

## Pages & Routing

```
/ → HomePage
/quiz → QuizPage
/results → ResultsPage (redirect to /quiz if quiz not completed)
/breed/:breedId → BreedPage
/compare → ComparePage (redirect to /browse if compareList is empty)
/browse → BrowsePage
```

Lazy-load all page components with `React.lazy` + `Suspense`. Suspense fallback: a paw print spinner.

---

## UI — Key Screens

### HomePage (`/`)
- Large hero with the TinyCats wordmark (Fraunces font, serif).
- Tagline: "Find the cat that fits your life."
- Two CTAs: **"Find My Breed"** (primary, → `/quiz`) and **"Browse All Breeds"** (ghost, → `/browse`).
- Background: soft `#FAFAF8`. No images required on landing.

### QuizPage (`/quiz`)
- One question per screen. Progress bar at the top (`role="progressbar"` with `aria-valuenow`).
- Each option is a full-width button, `h-14`, `rounded-xl`. Selected state: `bg-purple-100 border-purple-500`.
- Step 7 is a `<textarea>` (optional free text). All other steps are single or multi-select.
- Back/Next navigation. "Get My Recommendations" on the final step.
- On submit: dispatch `completeQuiz()` then `fetchRecommendations(answers)`, then navigate to `/results`.

### ResultsPage (`/results`)
Two-column on desktop (≥1024px): recommendation cards left (~60%), chat panel right (~40%, sticky). Single column on mobile with chat as a collapsible bottom section.

### BreedCard component
- Hero image (16:9, `object-cover`, `loading="lazy"`), breed name, match score badge (accent orange pill), 3 key trait tags, AI summary snippet (2 lines, truncated).
- Two action buttons: **"View Details"** and **"+ Compare"** (disabled if compare list is full).
- Heart icon (Lucide `Heart`) for save. Filled when saved.
- Hover: `shadow-lg`, subtle `translateY(-2px)` lift, `transition-all duration-200`.

### ChatPanel component
- Fixed-height panel with scrollable message history. Auto-scrolls to latest message.
- AI bubbles: left-aligned, `bg-purple-50`, rounded with flat left edge on top bubble. User bubbles: right-aligned, `bg-purple-600 text-white`.
- Streaming: show blinking cursor `_` at end of streaming message. `aria-live="polite"` on the message list.
- Text input + send button at the bottom.

### BreedPage (`/breed/:breedId`)
- Max-width `960px`, centered.
- Above fold: hero image left (60%), quick stats right (40%).
- TraitBar component for each trait (horizontal fill bar, `--color-primary` fill).
- Sections below: About, Care Guide, Good With, Adoption Links.

### ComparePage (`/compare`)
- Side-by-side table. Fixed breed name column, scrollable trait columns on mobile.
- Trait rows with TraitBar components.
- Remove button (X) on each breed column header.

### BrowsePage (`/browse`)
- Filter sidebar: energy level, size, coat length, allergen level, tags.
- Grid of BreedCards (3 cols desktop, 2 tablet, 1 mobile).

---

## Design Tokens (Tailwind config)

Extend the Tailwind theme with:

```javascript
colors: {
  primary: { DEFAULT: '#7C5CBF', light: '#EEE8FA' },
  accent: '#F4A261',
  surface: '#FAFAF8',
}
```

Fonts:
- Load `Fraunces` (serif, display) and `Inter` (sans) from Google Fonts in `index.html`.
- `fontFamily: { display: ['Fraunces', 'serif'], sans: ['Inter', 'sans-serif'] }`.

---

## Local Storage

All keys prefixed `tinycats:`. Use `src/utils/storage.ts` with typed `storageGet<T>` and `storageSet<T>` helpers (wrap in try/catch).

Sync to local storage via a Redux store subscriber (not middleware):
- `tinycats:savedBreeds` ← `state.breeds.savedBreeds`
- `tinycats:compareList` ← `state.breeds.compareList`
- `tinycats:lastQuizAnswers` ← `state.quiz.answers` when quiz completes

On store init, preload these values into the Redux `preloadedState`.

---

## Fallback Breed Data

Seed `src/data/breeds.fallback.json` with at least 15 breeds as a JSON array of `Breed` objects. Include real breed data: Ragdoll, Maine Coon, British Shorthair, Siamese, Bengal, Persian, Abyssinian, Scottish Fold, Sphynx, Norwegian Forest Cat, Burmese, Birman, Russian Blue, Turkish Angora, Devon Rex. Use Unsplash cat breed image URLs for `images.hero`.

---

## Error Handling

- Gemini failure → dispatch `chatSlice.setError()`. Show inline error bubble: "Couldn't reach AI, please try again." with a retry button.
- MCP failure → fall back to `breeds.fallback.json`. Show a non-blocking yellow banner: "Using offline breed data."
- No quiz results → show "Let's broaden your search" state with suggested preference edits.
- Invalid breed route → show 404 component with a "Browse all breeds" link.
- All async slice states must handle `pending` / `fulfilled` / `rejected`.

---

## Accessibility

- All interactive elements keyboard-accessible with visible focus rings (`outline-2 outline-offset-2 outline-primary`).
- Quiz progress bar: `role="progressbar"` with `aria-valuenow`, `aria-valuemin`, `aria-valuemax`.
- Chat stream container: `aria-live="polite"`.
- All breed images: descriptive `alt` text.
- Respect `prefers-reduced-motion`: wrap all CSS transitions in `@media (prefers-reduced-motion: no-preference)`.
- Contrast ratios: WCAG AA minimum.

---

## What NOT to Do

- Do not put API calls directly in React components. All async work goes in thunks.
- Do not use `any` type anywhere.
- Do not use `<form>` HTML elements — use `onClick` / `onChange` handlers.
- Do not store class instances, Promises, or AsyncGenerators in Redux state.
- Do not use deep relative imports — always use the `@/` alias.
- Do not use `localStorage` directly — always go through `src/utils/storage.ts`.
- Do not expose `VITE_GEMINI_API_KEY` in the production bundle. Flag this prominently with a `TODO: move to serverless proxy before production deploy` comment in `geminiService.ts`.
- Do not install `uuid` — use `crypto.randomUUID()` instead.

---

## Final Checklist Before Marking Complete

- [ ] `pnpm run build` succeeds with zero TypeScript errors.
- [ ] `pnpm run lint` passes.
- [ ] All 6 routes render without console errors.
- [ ] Quiz completes and recommendations render (even with mock Gemini response if API key not set).
- [ ] Chat panel sends and receives a message.
- [ ] Breed detail page loads from `/breed/ragdoll`.
- [ ] Compare page shows 2 breeds side-by-side.
- [ ] Hard refresh on `/results` redirects to `/quiz` (not a crash).
- [ ] Mobile layout at 375px width looks correct on all pages.
