# Implementation Guide — TinyCats

**Version:** 1.0  
**Last Updated:** 2025-06-13

---

## 1. Project Setup

```bash
# Scaffold with Vite
pnpm create vite@latest tinycats -- --template react-ts
cd tinycats

# Core dependencies
pnpm add @reduxjs/toolkit react-redux react-router-dom
pnpm add @google/generative-ai
pnpm add @modelcontextprotocol/sdk
pnpm add tailwindcss @tailwindcss/vite
pnpm add lucide-react

# shadcn/ui
pnpm dlx shadcn@latest init

# Dev dependencies
pnpm add -D vitest @testing-library/react @testing-library/jest-dom
pnpm add -D @playwright/test
pnpm add -D eslint prettier eslint-config-prettier
```

---

## 2. Vite Configuration

```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: { '@': path.resolve(__dirname, './src') },
  },
  server: {
    proxy: {
      '/api/gemini': {
        target: 'https://generativelanguage.googleapis.com',
        changeOrigin: true,
        rewrite: (p) => p.replace(/^\/api\/gemini/, ''),
        headers: {
          'x-goog-api-key': process.env.GEMINI_API_KEY ?? '',
        },
      },
    },
  },
});
```

---

## 3. Redux Store

```typescript
// src/app/store.ts
import { configureStore } from '@reduxjs/toolkit';
import quizReducer from '@/features/quiz/quizSlice';
import chatReducer from '@/features/chat/chatSlice';
import breedsReducer from '@/features/breeds/breedsSlice';
import recommendationsReducer from '@/features/recommendations/recommendationsSlice';

export const store = configureStore({
  reducer: {
    quiz: quizReducer,
    chat: chatReducer,
    breeds: breedsReducer,
    recommendations: recommendationsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

```typescript
// src/app/hooks.ts
import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from './store';

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector = <T>(selector: (state: RootState) => T) =>
  useSelector(selector);
```

---

## 4. Feature Slices

### 4.1 Quiz Slice

```typescript
// src/features/quiz/quizSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { QuizState, QuizAnswers } from '@/types/quiz';

const initialState: QuizState = {
  currentStep: 0,
  totalSteps: 7,
  answers: {},
  completed: false,
  startedAt: null,
  completedAt: null,
};

const quizSlice = createSlice({
  name: 'quiz',
  initialState,
  reducers: {
    startQuiz(state) {
      state.startedAt = new Date().toISOString();
    },
    setAnswer(state, action: PayloadAction<{ key: keyof QuizAnswers; value: unknown }>) {
      (state.answers as Record<string, unknown>)[action.payload.key] = action.payload.value;
    },
    nextStep(state) {
      if (state.currentStep < state.totalSteps - 1) state.currentStep++;
    },
    prevStep(state) {
      if (state.currentStep > 0) state.currentStep--;
    },
    completeQuiz(state) {
      state.completed = true;
      state.completedAt = new Date().toISOString();
    },
    resetQuiz() {
      return initialState;
    },
  },
});

export const { startQuiz, setAnswer, nextStep, prevStep, completeQuiz, resetQuiz } =
  quizSlice.actions;
export default quizSlice.reducer;
```

### 4.2 Chat Slice

```typescript
// src/features/chat/chatSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { v4 as uuid } from 'uuid';
import type { ChatState, Message } from '@/types/chat';

const initialState: ChatState = {
  messages: [],
  isStreaming: false,
  error: null,
  sessionId: uuid(),
  context: null,
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    addMessage(state, action: PayloadAction<Omit<Message, 'id' | 'timestamp'>>) {
      state.messages.push({
        ...action.payload,
        id: uuid(),
        timestamp: new Date().toISOString(),
      });
    },
    startStreaming(state, action: PayloadAction<string /* initial message id */>) {
      state.isStreaming = true;
      const msg = state.messages.find((m) => m.id === action.payload);
      if (msg) msg.isStreaming = true;
    },
    appendToken(state, action: PayloadAction<{ id: string; token: string }>) {
      const msg = state.messages.find((m) => m.id === action.payload.id);
      if (msg) msg.content += action.payload.token;
    },
    finishStreaming(state, action: PayloadAction<string /* message id */>) {
      state.isStreaming = false;
      const msg = state.messages.find((m) => m.id === action.payload);
      if (msg) msg.isStreaming = false;
    },
    setError(state, action: PayloadAction<string>) {
      state.error = action.payload;
      state.isStreaming = false;
    },
    clearError(state) {
      state.error = null;
    },
  },
});

export const { addMessage, startStreaming, appendToken, finishStreaming, setError, clearError } =
  chatSlice.actions;
export default chatSlice.reducer;
```

### 4.3 Breeds Slice

```typescript
// src/features/breeds/breedsSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { mcpClient } from '@/services/mcpService';
import type { Breed, BreedsState } from '@/types/breed';

export const fetchBreeds = createAsyncThunk('breeds/fetchAll', async () => {
  return await mcpClient.getBreedList();
});

export const fetchBreedDetail = createAsyncThunk(
  'breeds/fetchDetail',
  async (breedId: string) => {
    return await mcpClient.getBreedDetail(breedId);
  }
);

const breedsSlice = createSlice({
  name: 'breeds',
  initialState: {
    entities: {},
    ids: [],
    status: 'idle',
    savedBreeds: [],
    compareList: [],
  } as BreedsState,
  reducers: {
    toggleSaveBreed(state, action: PayloadAction<string>) {
      const id = action.payload;
      const idx = state.savedBreeds.indexOf(id);
      if (idx === -1) state.savedBreeds.push(id);
      else state.savedBreeds.splice(idx, 1);
    },
    addToCompare(state, action: PayloadAction<string>) {
      if (state.compareList.length < 3 && !state.compareList.includes(action.payload)) {
        state.compareList.push(action.payload);
      }
    },
    removeFromCompare(state, action: PayloadAction<string>) {
      state.compareList = state.compareList.filter((id) => id !== action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBreeds.pending, (state) => { state.status = 'loading'; })
      .addCase(fetchBreeds.fulfilled, (state, action) => {
        state.status = 'succeeded';
        action.payload.forEach((breed: Breed) => {
          state.entities[breed.id] = breed;
          if (!state.ids.includes(breed.id)) state.ids.push(breed.id);
        });
      })
      .addCase(fetchBreeds.rejected, (state) => { state.status = 'failed'; });
  },
});

export const { toggleSaveBreed, addToCompare, removeFromCompare } = breedsSlice.actions;
export default breedsSlice.reducer;
```

---

## 5. Gemini Service

```typescript
// src/services/geminiService.ts
import { GoogleGenerativeAI } from '@google/generative-ai';
import type { QuizAnswers } from '@/types/quiz';
import type { Message } from '@/types/chat';

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

const SYSTEM_PROMPT = `You are TinyCats AI, a friendly expert on cat breeds.
When recommending breeds, respond ONLY with valid JSON matching this schema:
{"recommendations":[{"breedId":"","matchScore":0,"matchReasons":[],"aiSummary":""}],"intro":""}
No markdown, no preamble, just the JSON object.`;

export async function* streamRecommendations(
  answers: QuizAnswers
): AsyncGenerator<string> {
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  const userPrompt = buildRecommendationPrompt(answers);
  const result = await model.generateContentStream([
    { role: 'user', parts: [{ text: SYSTEM_PROMPT + '\n\n' + userPrompt }] },
  ]);
  for await (const chunk of result.stream) {
    yield chunk.text();
  }
}

export async function* streamChatReply(
  messages: Message[],
  userText: string
): AsyncGenerator<string> {
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  const chat = model.startChat({
    history: messages
      .filter((m) => m.role !== 'system')
      .map((m) => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }],
      })),
  });
  const result = await chat.sendMessageStream(userText);
  for await (const chunk of result.stream) {
    yield chunk.text();
  }
}

function buildRecommendationPrompt(answers: QuizAnswers): string {
  return `
User quiz answers:
- Living space: ${answers.livingSpace}
- Activity level: ${answers.activityLevel}
- Allergy sensitivity: ${answers.allergySensitivity}
- Cat experience: ${answers.catExperience}
- Affection preference: ${answers.affectionPreference}
- Household: ${answers.household?.join(', ')}
${answers.freeText ? `- Extra notes: ${answers.freeText}` : ''}

Recommend the top 5 cat breeds. Return JSON only.
  `.trim();
}
```

---

## 6. MCP Service

```typescript
// src/services/mcpService.ts
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { SSEClientTransport } from '@modelcontextprotocol/sdk/client/sse.js';
import type { Breed } from '@/types/breed';

class BreedMCPClient {
  private client: Client | null = null;

  async connect() {
    const transport = new SSEClientTransport(
      new URL(import.meta.env.VITE_MCP_SERVER_URL)
    );
    this.client = new Client({ name: 'tinycats', version: '1.0.0' }, {});
    await this.client.connect(transport);
  }

  private async call<T>(toolName: string, args: Record<string, unknown>): Promise<T> {
    if (!this.client) await this.connect();
    const result = await this.client!.callTool({ name: toolName, arguments: args });
    return JSON.parse(result.content[0].text as string) as T;
  }

  getBreedList() {
    return this.call<Breed[]>('get_breed_list', {});
  }

  getBreedDetail(breedId: string) {
    return this.call<Breed>('get_breed_detail', { breedId });
  }

  searchBreeds(filters: Record<string, unknown>) {
    return this.call<{ breeds: Breed[]; total: number }>('search_breeds', { filters });
  }
}

export const mcpClient = new BreedMCPClient();
```

---

## 7. Routing

```typescript
// src/App.tsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAppSelector } from '@/app/hooks';
import HomePage from '@/pages/HomePage';
import QuizPage from '@/pages/QuizPage';
import ResultsPage from '@/pages/ResultsPage';
import BreedPage from '@/pages/BreedPage';
import ComparePage from '@/pages/ComparePage';
import BrowsePage from '@/pages/BrowsePage';

function ProtectedResults() {
  const completed = useAppSelector((s) => s.quiz.completed);
  return completed ? <ResultsPage /> : <Navigate to="/quiz" replace />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/quiz" element={<QuizPage />} />
        <Route path="/results" element={<ProtectedResults />} />
        <Route path="/breed/:breedId" element={<BreedPage />} />
        <Route path="/compare" element={<ComparePage />} />
        <Route path="/browse" element={<BrowsePage />} />
      </Routes>
    </BrowserRouter>
  );
}
```

---

## 8. Local Storage Persistence

```typescript
// src/utils/storage.ts
const PREFIX = 'tinycats:';

export function storageGet<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(PREFIX + key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

export function storageSet<T>(key: string, value: T): void {
  try {
    localStorage.setItem(PREFIX + key, JSON.stringify(value));
  } catch {
    // storage full or unavailable — fail silently
  }
}
```

Saved breeds and compare list are synced to local storage via Redux middleware on store subscribe.

---

## 9. Key Implementation Notes

**Streaming in Redux:** Gemini streams tokens as `AsyncGenerator<string>`. A thunk loops over the generator, dispatching `appendToken` per chunk. This avoids storing generator state in Redux (not serializable).

**MCP fallback:** Wrap every `mcpClient.call()` in try/catch. On failure, import static JSON from `src/data/breeds.fallback.json` and use that instead. Always show a non-blocking banner to the user.

**API key security:** `VITE_GEMINI_API_KEY` is only safe for development (exposed in bundle). In production, proxy all Gemini calls through a serverless function (e.g. Vercel Edge Function) that injects the key server-side.

**Hydration from local storage:** In `store.ts`, preloadedState should be seeded from `storageGet('savedBreeds')` and `storageGet('compareList')` so state survives page reload.
