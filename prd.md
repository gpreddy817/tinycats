# Product Requirements Document — TinyCats

**Version:** 1.0  
**Status:** Draft  
**Last Updated:** 2025-06-13

---

## 1. Overview

TinyCats is a web application that recommends cat breeds to prospective or curious cat owners using conversational AI powered by Google Gemini. Users answer a short quiz or chat freely with an AI assistant, which then surfaces the best-matched breeds with rich detail cards, sourced via MCP (Model Context Protocol) tool integrations.

---

## 2. Problem Statement

Choosing the right cat breed is overwhelming. There are over 70 recognized breeds, each with distinct temperaments, care needs, and energy levels. Existing resources are static listicles with no personalization. TinyCats solves this by combining a conversational AI interface with structured breed data to deliver truly personalized recommendations.

---

## 3. Goals & Non-Goals

### Goals
- Provide personalized cat breed recommendations via AI-driven conversation.
- Surface breed data (temperament, grooming, activity level, allergen rating, lifespan) in a clean, visual format.
- Allow users to save, compare, and share breed recommendations.
- Deliver a fast, mobile-friendly experience.

### Non-Goals
- Selling or facilitating cat adoption/purchase directly.
- Veterinary or medical advice.
- Breed recommendations for dogs, birds, or other animals.
- User accounts / authentication in v1.

---

## 4. Target Users

| Persona | Description |
|---|---|
| First-time owners | Never owned a cat; needs guidance on lifestyle fit |
| Experienced owners | Wants to explore specific breeds they haven't tried |
| Gift-givers | Researching for someone else; needs shareable results |
| Curious browsers | Just interested in exploring cat breeds interactively |

---

## 5. User Stories

- As a first-time cat owner, I want to answer a few questions about my lifestyle so I receive breed recommendations suited to my home environment.
- As a user, I want to chat freely with an AI assistant so I can ask follow-up questions about recommended breeds.
- As a user, I want to see breed detail cards with photos, traits, and care information so I can make an informed decision.
- As a user, I want to save or share my top recommendations so I can review them later or discuss with family.
- As a user, I want to compare up to three breeds side-by-side so I can clearly see the differences.
- As a mobile user, I want the interface to work seamlessly on my phone so I can browse anywhere.

---

## 6. Features

### 6.1 Onboarding Quiz (v1)
A short 5–7 question wizard asking:
- Living space (apartment / house / outdoor access)
- Activity level (low / moderate / high)
- Allergy sensitivity
- Experience with cats
- Preference for affectionate vs. independent cats
- Household members (children, other pets)

### 6.2 AI Chat Interface
- Powered by Google Gemini via API.
- Context carries the quiz answers and current recommendations.
- Users can ask follow-up questions, refine preferences, or request specific breeds.
- Streaming responses for perceived speed.

### 6.3 Breed Recommendation Cards
Each card shows:
- Breed name and hero image
- Match score (%)
- Key traits: energy, grooming, sociability, intelligence, allergen level
- Short AI-generated summary explaining the match

### 6.4 Breed Detail Page
Full deep-dive: history, temperament, care guide, health considerations, links to adoption resources.

### 6.5 Compare View
Select 2–3 breeds to view a side-by-side trait comparison table.

### 6.6 Save & Share
- Save recommendations to local storage (no login required in v1).
- Generate a shareable link (URL-encoded state).

---

## 7. Success Metrics

| Metric | Target (3 months post-launch) |
|---|---|
| Quiz completion rate | ≥ 70% |
| Chat messages per session | ≥ 4 |
| Return visit rate | ≥ 25% |
| Breed detail page CTR from recommendations | ≥ 50% |
| Core Web Vitals (LCP) | < 2.5s |

---

## 8. Constraints

- API costs must be managed via token budgets per session.
- No backend in v1; all AI calls made client-side through a secured proxy.
- Gemini API key must never be exposed to the browser directly.
- Must comply with Google Gemini API usage policies.

---

## 9. Timeline

| Milestone | Target Date |
|---|---|
| Design complete | Week 2 |
| Core quiz + recommendation flow | Week 4 |
| AI chat integration | Week 5 |
| Compare + Save/Share | Week 6 |
| QA + Polish | Week 7 |
| Public launch | Week 8 |
