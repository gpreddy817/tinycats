# Project Tracker — TinyCats

**Version:** 1.0  
**Last Updated:** 2025-06-13

---

## Status Legend

| Symbol | Meaning |
|---|---|
| ⬜ | Not started |
| 🔵 | In progress |
| ✅ | Complete |
| ❌ | Blocked |
| ⏸ | Deferred |

---

## Sprint 1 — Foundation (Week 1–2)

| # | Task | Owner | Status | Notes |
|---|---|---|---|---|
| 1.1 | Scaffold Vite + React + TypeScript project | — | ⬜ | |
| 1.2 | Configure Tailwind CSS + shadcn/ui | — | ⬜ | |
| 1.3 | Set up Redux store + all slices (empty) | — | ⬜ | |
| 1.4 | Configure React Router with placeholder pages | — | ⬜ | |
| 1.5 | Set up ESLint + Prettier | — | ⬜ | |
| 1.6 | Set up Vitest + React Testing Library | — | ⬜ | |
| 1.7 | CI pipeline (GitHub Actions) | — | ⬜ | lint + test on PR |
| 1.8 | Configure Vite dev proxy for Gemini API | — | ⬜ | |
| 1.9 | Define all TypeScript types (breed, quiz, chat) | — | ⬜ | |
| 1.10 | Design tokens + Tailwind theme config | — | ⬜ | |

---

## Sprint 2 — Quiz Flow (Week 3)

| # | Task | Owner | Status | Notes |
|---|---|---|---|---|
| 2.1 | Build QuizWizard component (step shell) | — | ⬜ | |
| 2.2 | Implement all 7 quiz step UIs | — | ⬜ | |
| 2.3 | Wire quiz answers to Redux (`quizSlice`) | — | ⬜ | |
| 2.4 | Progress bar component | — | ⬜ | accessible `role=progressbar` |
| 2.5 | Back/Next navigation with validation | — | ⬜ | |
| 2.6 | Quiz completion → navigate to results | — | ⬜ | |
| 2.7 | Persist quiz answers to local storage | — | ⬜ | |
| 2.8 | Unit tests for `quizSlice` | — | ⬜ | |
| 2.9 | Mobile layout for quiz steps | — | ⬜ | |

---

## Sprint 3 — MCP + Breed Data (Week 3–4)

| # | Task | Owner | Status | Notes |
|---|---|---|---|---|
| 3.1 | Set up MCP server project (Node.js) | — | ⬜ | separate repo/service |
| 3.2 | Implement `get_breed_list` MCP tool | — | ⬜ | |
| 3.3 | Implement `get_breed_detail` MCP tool | — | ⬜ | |
| 3.4 | Implement `search_breeds` MCP tool | — | ⬜ | |
| 3.5 | Seed breed data (20+ breeds minimum) | — | ⬜ | |
| 3.6 | MCP client service (`mcpService.ts`) | — | ⬜ | |
| 3.7 | Static fallback JSON for breeds | — | ⬜ | used if MCP unavailable |
| 3.8 | `breedsSlice` async thunks | — | ⬜ | |
| 3.9 | BreedCard component | — | ⬜ | |
| 3.10 | Breed Detail page | — | ⬜ | |
| 3.11 | Browse page + filter sidebar | — | ⬜ | |

---

## Sprint 4 — Gemini AI + Recommendations (Week 4–5)

| # | Task | Owner | Status | Notes |
|---|---|---|---|---|
| 4.1 | `geminiService.ts` with streaming support | — | ⬜ | |
| 4.2 | Recommendation prompt engineering | — | ⬜ | JSON-structured output |
| 4.3 | `recommendationsSlice` + async thunk | — | ⬜ | |
| 4.4 | Streaming token → Redux append pattern | — | ⬜ | |
| 4.5 | RecommendationList + cards on Results page | — | ⬜ | |
| 4.6 | Match score badge + reasons display | — | ⬜ | |
| 4.7 | Error handling for Gemini failures | — | ⬜ | |
| 4.8 | Token budget / rate limit handling | — | ⬜ | |

---

## Sprint 5 — Chat Interface (Week 5)

| # | Task | Owner | Status | Notes |
|---|---|---|---|---|
| 5.1 | ChatPanel component | — | ⬜ | |
| 5.2 | MessageBubble component (user + AI) | — | ⬜ | |
| 5.3 | `chatSlice` streaming actions | — | ⬜ | |
| 5.4 | Wire `streamChatReply` to chat input | — | ⬜ | |
| 5.5 | Streaming cursor animation | — | ⬜ | |
| 5.6 | Chat context injection (quiz + recs) | — | ⬜ | |
| 5.7 | Auto-scroll on new messages | — | ⬜ | |
| 5.8 | Mobile bottom sheet for chat | — | ⬜ | |
| 5.9 | Unit tests for `chatSlice` | — | ⬜ | |

---

## Sprint 6 — Compare, Save & Share (Week 6)

| # | Task | Owner | Status | Notes |
|---|---|---|---|---|
| 6.1 | "Add to Compare" button on BreedCard | — | ⬜ | max 3 |
| 6.2 | Compare page — side-by-side table | — | ⬜ | |
| 6.3 | Horizontal scroll on mobile compare | — | ⬜ | |
| 6.4 | Save breed (heart toggle) | — | ⬜ | |
| 6.5 | Persist savedBreeds to local storage | — | ⬜ | |
| 6.6 | Share results (URL-encoded state) | — | ⬜ | |
| 6.7 | Restore state from shared URL | — | ⬜ | |

---

## Sprint 7 — Polish + QA (Week 7)

| # | Task | Owner | Status | Notes |
|---|---|---|---|---|
| 7.1 | Page transition animations | — | ⬜ | |
| 7.2 | Skeleton loading states for all async | — | ⬜ | |
| 7.3 | Empty state illustrations | — | ⬜ | |
| 7.4 | Dark mode support | — | ⬜ | |
| 7.5 | Full accessibility audit | — | ⬜ | WCAG AA |
| 7.6 | Cross-browser testing (Chrome, Safari, FF) | — | ⬜ | |
| 7.7 | Mobile QA (iOS + Android) | — | ⬜ | |
| 7.8 | Playwright E2E: quiz → results flow | — | ⬜ | |
| 7.9 | Core Web Vitals audit | — | ⬜ | target LCP < 2.5s |
| 7.10 | Bundle size audit + optimization | — | ⬜ | target < 250KB gz |

---

## Sprint 8 — Launch (Week 8)

| # | Task | Owner | Status | Notes |
|---|---|---|---|---|
| 8.1 | Production Gemini proxy (serverless fn) | — | ⬜ | never expose key in browser |
| 8.2 | Deploy MCP server | — | ⬜ | |
| 8.3 | Deploy frontend to Vercel | — | ⬜ | |
| 8.4 | Set up environment variables in Vercel | — | ⬜ | |
| 8.5 | Smoke test production build | — | ⬜ | |
| 8.6 | Set up error monitoring (Sentry) | — | ⬜ | |
| 8.7 | Analytics setup | — | ⬜ | |
| 8.8 | Public launch | — | ⬜ | 🚀 |

---

## Backlog / v2 Ideas

| Item | Priority |
|---|---|
| User accounts + cloud-saved breeds | Medium |
| Breed personality quiz (deeper) | Medium |
| "Ask a vet" integration | Low |
| Cat name generator | Low |
| Email results | Low |
| Breed image upload for AI identification | High |
