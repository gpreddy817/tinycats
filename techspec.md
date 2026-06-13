# Technical Specification — TinyCats

**Version:** 1.0  
**Status:** Draft  
**Last Updated:** 2025-06-13

---

## 1. Tech Stack

| Layer | Technology |
|---|---|
| Frontend framework | React 18 (Vite) |
| Language | TypeScript 5 |
| State management | Redux Toolkit (RTK) + RTK Query |
| Styling | Tailwind CSS + shadcn/ui |
| AI provider | Google Gemini 1.5 Flash via `@google/generative-ai` |
| MCP integration | `@modelcontextprotocol/sdk` (client) |
| Routing | React Router v6 |
| Testing | Vitest + React Testing Library |
| Linting | ESLint + Prettier |
| Package manager | pnpm |

---

## 2. Architecture Overview

```
┌─────────────────────────────────────────────────┐
│                   Browser (React)                │
│                                                  │
│  ┌──────────┐  ┌──────────┐  ┌───────────────┐  │
│  │  Quiz UI │  │ Chat UI  │  │ Results / Cards│  │
│  └────┬─────┘  └────┬─────┘  └──────┬────────┘  │
│       │              │               │            │
│       └──────────────┴───────────────┘            │
│                      │                            │
│              Redux Store (RTK)                    │
│     quiz | chat | breeds | recommendations        │
│                      │                            │
│         ┌────────────┴──────────┐                 │
│         │                       │                 │
│   Gemini Service          MCP Client              │
│   (AI chat + recs)        (breed data tools)      │
└─────────────────────────────────────────────────┘
           │                       │
    Google Gemini API         MCP Server(s)
    (external)                (breed data)
```

No dedicated backend is required in v1. A lightweight Vite proxy handles Gemini API calls to avoid exposing the key in the browser.

---

## 3. Directory Structure

```
tinycats/
├── public/
├── src/
│   ├── app/
│   │   ├── store.ts              # Redux store configuration
│   │   └── rootReducer.ts
│   ├── features/
│   │   ├── quiz/
│   │   │   ├── quizSlice.ts
│   │   │   ├── QuizWizard.tsx
│   │   │   └── QuizStep.tsx
│   │   ├── chat/
│   │   │   ├── chatSlice.ts
│   │   │   ├── ChatPanel.tsx
│   │   │   └── MessageBubble.tsx
│   │   ├── breeds/
│   │   │   ├── breedsSlice.ts
│   │   │   ├── BreedCard.tsx
│   │   │   ├── BreedDetail.tsx
│   │   │   └── CompareView.tsx
│   │   └── recommendations/
│   │       ├── recommendationsSlice.ts
│   │       └── RecommendationList.tsx
│   ├── services/
│   │   ├── geminiService.ts      # Gemini API wrapper
│   │   └── mcpService.ts         # MCP client wrapper
│   ├── hooks/
│   │   ├── useGemini.ts
│   │   └── useMCP.ts
│   ├── types/
│   │   ├── breed.ts
│   │   ├── quiz.ts
│   │   └── chat.ts
│   ├── utils/
│   │   ├── scoreBreeds.ts
│   │   └── shareUtils.ts
│   ├── pages/
│   │   ├── HomePage.tsx
│   │   ├── QuizPage.tsx
│   │   ├── ResultsPage.tsx
│   │   ├── BreedPage.tsx
│   │   └── ComparePage.tsx
│   ├── components/
│   │   └── ui/                   # shadcn/ui components
│   ├── App.tsx
│   └── main.tsx
├── vite.config.ts
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

---

## 4. Redux State Shape

```typescript
interface RootState {
  quiz: QuizState;
  chat: ChatState;
  breeds: BreedsState;
  recommendations: RecommendationsState;
}

interface QuizState {
  currentStep: number;
  answers: Partial<QuizAnswers>;
  completed: boolean;
}

interface ChatState {
  messages: Message[];
  isStreaming: boolean;
  error: string | null;
  sessionId: string;
}

interface BreedsState {
  entities: Record<string, Breed>;
  ids: string[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  savedBreeds: string[];           // breed IDs saved by user
  compareList: string[];           // up to 3 breed IDs
}

interface RecommendationsState {
  results: BreedRecommendation[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}
```

---

## 5. Gemini Integration

```typescript
// src/services/geminiService.ts
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

export async function* streamRecommendations(
  quizAnswers: QuizAnswers
): AsyncGenerator<string> {
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  const prompt = buildRecommendationPrompt(quizAnswers);
  const result = await model.generateContentStream(prompt);
  for await (const chunk of result.stream) {
    yield chunk.text();
  }
}

export async function* streamChatReply(
  history: Message[],
  userMessage: string,
  context: RecommendationContext
): AsyncGenerator<string> {
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  const chat = model.startChat({ history: toGeminiHistory(history) });
  const result = await chat.sendMessageStream(
    buildChatPrompt(userMessage, context)
  );
  for await (const chunk of result.stream) {
    yield chunk.text();
  }
}
```

Gemini is called through Vite's `server.proxy` in development and a serverless function in production to keep the API key server-side.

---

## 6. MCP Integration

MCP tools provide structured breed data. The client connects to a local or remote MCP server exposing the following tools:

| Tool | Description |
|---|---|
| `get_breed_list` | Returns all breed names and IDs |
| `get_breed_detail` | Returns full breed profile by ID |
| `search_breeds` | Filters breeds by trait criteria |

```typescript
// src/services/mcpService.ts
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';

export class BreedMCPClient {
  private client: Client;

  async connect() { /* ... */ }

  async searchBreeds(criteria: BreedSearchCriteria): Promise<Breed[]> {
    const result = await this.client.callTool({
      name: 'search_breeds',
      arguments: criteria,
    });
    return JSON.parse(result.content[0].text);
  }
}
```

---

## 7. Environment Variables

```
VITE_GEMINI_API_KEY=       # Google Gemini API key (dev only; proxied in prod)
VITE_MCP_SERVER_URL=       # MCP server endpoint
VITE_APP_ENV=development   # development | production
```

---

## 8. Performance Targets

| Metric | Target |
|---|---|
| First Contentful Paint | < 1.5s |
| Largest Contentful Paint | < 2.5s |
| Time to Interactive | < 3.5s |
| Bundle size (initial) | < 250 KB gzipped |
| Gemini first token latency | < 1s |

---

## 9. Error Handling

All async operations follow a consistent pattern:

```typescript
type AsyncStatus = 'idle' | 'loading' | 'succeeded' | 'failed';

interface AsyncState {
  status: AsyncStatus;
  error: string | null;
}
```

Gemini errors surface as inline chat messages. MCP errors fall back to a static breed dataset bundled with the app.

---

## 10. Testing Strategy

| Level | Tool | Coverage target |
|---|---|---|
| Unit (slices, utils) | Vitest | 80% |
| Component | React Testing Library | Key user flows |
| E2E | Playwright | Quiz → Results flow |

---

## 11. Deployment

- Static hosting: Vercel (recommended) or Netlify.
- Environment variables injected at build time.
- MCP server deployed as a separate service (Node.js / Docker).
- CI/CD via GitHub Actions on push to `main`.
