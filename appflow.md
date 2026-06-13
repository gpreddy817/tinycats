# App Flow — TinyCats

**Version:** 1.0  
**Last Updated:** 2025-06-13

---

## 1. High-Level Flow

```
Landing Page
    │
    ├──► Start Quiz ──► Quiz Wizard (5–7 steps) ──► Results Page
    │                                                    │
    │                                              ┌─────┴──────┐
    │                                         Breed Cards   Chat Panel
    │                                              │               │
    │                                         Breed Detail    Follow-up Q&A
    │                                              │
    │                                         Compare View
    │
    └──► Browse Breeds (direct, no quiz)
```

---

## 2. Page-by-Page Flow

### 2.1 Landing Page (`/`)

**Entry point.** Two CTAs:
- **Find My Breed** → starts the quiz flow.
- **Browse All Breeds** → jumps directly to a breed directory.

Redux actions dispatched: none until user clicks.

---

### 2.2 Quiz Wizard (`/quiz`)

Sequential steps, one question per screen. Progress bar at the top.

```
Step 1: Living Space
  ○ Apartment (small)
  ○ House (medium)
  ○ House with outdoor access

Step 2: Your Activity Level
  ○ Couch potato — I prefer calm days
  ○ Moderate — I'm active but relaxed
  ○ Active — I love interactive play

Step 3: Allergy Sensitivity
  ○ No allergies
  ○ Mild sensitivity
  ○ Severe allergies

Step 4: Cat Experience
  ○ First-time owner
  ○ Had cats before
  ○ Very experienced

Step 5: Affection Preference
  ○ Independent and low-maintenance
  ○ Somewhere in between
  ○ Velcro cat — always by my side

Step 6: Household
  ○ Just me
  ○ Partner / adults only
  ○ Kids in the household
  ○ Other pets too

Step 7: Anything else? (free text, optional)
```

Redux dispatched per step: `quiz/setAnswer({ step, value })`.

On "Get My Recommendations": dispatches `recommendations/fetchRecommendations(quizAnswers)`, which calls Gemini + MCP, then navigates to `/results`.

---

### 2.3 Results Page (`/results`)

Displays top 3–5 breed recommendation cards sorted by match score.

Layout:
```
┌─────────────────────────────┬────────────────────┐
│  Recommendation Cards (left)│  Chat Panel (right) │
│                             │                     │
│  [Card 1 — 94% match]       │  AI: "Based on your │
│  [Card 2 — 87% match]       │  answers, here are  │
│  [Card 3 — 81% match]       │  your top matches…" │
│                             │                     │
│  [Compare Selected]         │  [User input]       │
└─────────────────────────────┴────────────────────┘
```

Redux state consumed: `recommendations.results`, `chat.messages`.

---

### 2.4 Chat Panel (component within Results)

Always visible alongside results. Initializes with an AI-generated summary of the quiz results and top recommendations.

User can:
- Ask "Why is the Ragdoll a good fit for me?"
- Say "I actually have a dog too, does that change things?"
- Request "Show me a hypoallergenic option instead."

Redux dispatched: `chat/sendMessage(text)` → triggers `streamChatReply` → `chat/appendToken(token)` per stream chunk → `chat/finishMessage()`.

---

### 2.5 Breed Detail Page (`/breed/:breedId`)

Full-page profile of a single breed. Accessed by clicking a breed card.

Sections:
- Hero image + name + tagline
- Quick stats bar (energy, grooming, sociability, intelligence, allergen level)
- About (history + temperament)
- Care guide (diet, grooming frequency, vet notes)
- Good with: children, dogs, other cats
- Adoption resources (external links)

Redux dispatched: `breeds/fetchBreedDetail(breedId)` if not already in store.

---

### 2.6 Compare Page (`/compare`)

Accessible from Results or Breed Detail (via "Add to Compare" button).

Side-by-side table of up to 3 breeds. Traits shown as icon rows.

Redux state consumed: `breeds.compareList`, breed entities for each ID.

---

### 2.7 Browse Page (`/browse`)

Grid of all breeds with filter sidebar (energy, size, grooming, allergen).  
No AI involved — purely MCP breed data.

---

## 3. State Transitions

### Quiz → Results

```
QuizPage                     Redux                       Services
   │                           │                             │
   │──setAnswer(step, val)────►│                             │
   │   (x6 steps)              │                             │
   │                           │                             │
   │──fetchRecommendations()──►│──────callGemini(answers)──►│
   │                           │                             │
   │                           │◄─────streamTokens()─────── │
   │                           │──appendToken()              │
   │                           │   (streaming)               │
   │                           │                             │
   │                           │──setResults(breeds)         │
   │◄──navigate('/results')────│                             │
```

### Chat Turn

```
ChatPanel          chatSlice              geminiService
    │                  │                       │
    │──sendMessage()──►│                       │
    │                  │──setStreaming(true)   │
    │                  │──streamChatReply()───►│
    │                  │◄──chunk, chunk, chunk─│
    │                  │──appendToken() x N    │
    │◄─re-renders──────│                       │
    │                  │──finishMessage()      │
    │                  │──setStreaming(false)  │
```

---

## 4. Navigation Map

| Route | Page | Guards |
|---|---|---|
| `/` | Home | — |
| `/quiz` | Quiz Wizard | — |
| `/results` | Results + Chat | Redirect to `/quiz` if no answers |
| `/breed/:id` | Breed Detail | — |
| `/compare` | Compare View | Redirect to `/browse` if compareList empty |
| `/browse` | Browse All Breeds | — |

---

## 5. Error States

| Scenario | Behavior |
|---|---|
| Gemini API timeout | Inline error in chat: "Couldn't reach AI — try again." |
| MCP server unavailable | Fall back to bundled static breed data; show a banner |
| No breeds match quiz | Show a "broaden your criteria" prompt with suggested edits |
| Invalid breed ID | 404 component with link back to Browse |
