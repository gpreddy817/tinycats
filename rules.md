# Engineering Rules & Conventions — TinyCats

**Version:** 1.0  
**Last Updated:** 2025-06-13

These rules apply to all contributors. They exist to keep the codebase consistent, safe, and maintainable.

---

## 1. TypeScript

**Use strict TypeScript. No `any`.**

```typescript
// ❌ BAD
const handleData = (data: any) => { ... }

// ✅ GOOD
const handleData = (data: BreedRecommendation[]) => { ... }
```

All function parameters and return types must be explicitly typed. Exceptions only for trivially inferred local variables.

`tsconfig.json` must include:
```json
{ "strict": true, "noImplicitAny": true, "noUncheckedIndexedAccess": true }
```

---

## 2. Redux Rules

**Use Redux Toolkit exclusively. No hand-written reducers or action creators.**

All state mutations must happen inside `createSlice` reducers (Immer handles immutability).

```typescript
// ❌ BAD — mutating outside slice
dispatch({ type: 'quiz/setAnswer', payload: ... });

// ✅ GOOD — use exported action creators
dispatch(setAnswer({ key: 'activityLevel', value: 'high' }));
```

**Slices must not import from other slices.** Cross-feature communication goes through `extraReducers` responding to other slices' actions or through a shared `app/` module.

**Async logic belongs in thunks (`createAsyncThunk`), not components.** Components dispatch thunks; they never call services directly.

**Never store non-serializable values in Redux** (class instances, promises, functions, generators). Gemini stream generators are consumed in thunks before results enter the store.

**Selector pattern:** Always define selectors alongside slices. Export them with the `select` prefix.

```typescript
// src/features/breeds/breedsSlice.ts
export const selectBreedById = (id: string) => (state: RootState) =>
  state.breeds.entities[id];
```

---

## 3. Component Rules

**One component per file.** File name matches the component name exactly.

**Functional components only.** No class components.

**Props must be typed with an explicit interface:**

```typescript
// ❌ BAD
const BreedCard = ({ breed, onSave }: any) => ...

// ✅ GOOD
interface BreedCardProps {
  breed: Breed;
  onSave: (breedId: string) => void;
}
const BreedCard = ({ breed, onSave }: BreedCardProps) => ...
```

**Keep components dumb where possible.** Components read from Redux via `useAppSelector`; they do not manage async state themselves. Reserve `useState` for purely local UI state (hover, modal open, form input value before submission).

**Component file structure:**

```typescript
// 1. Imports
// 2. Types / interfaces
// 3. Component function
// 4. Sub-components (only if tightly coupled and small)
// 5. Default export
```

---

## 4. Naming Conventions

| Thing | Convention | Example |
|---|---|---|
| Component files | PascalCase | `BreedCard.tsx` |
| Slice files | camelCase | `breedsSlice.ts` |
| Hook files | camelCase, `use` prefix | `useGemini.ts` |
| Type/interface files | camelCase | `breed.ts` |
| Utility files | camelCase | `scoreBreeds.ts` |
| Constants | SCREAMING_SNAKE | `MAX_COMPARE_COUNT` |
| Redux actions | camelCase within slice name | `breeds/toggleSaveBreed` |
| CSS classes | Tailwind only — no custom class names unless via `@layer` |
| Environment variables | `VITE_` prefix for client-exposed vars |

---

## 5. File & Import Rules

**Use path aliases. Never use deep relative imports.**

```typescript
// ❌ BAD
import { Breed } from '../../../types/breed';

// ✅ GOOD
import { Breed } from '@/types/breed';
```

`@` resolves to `src/`. Configured in `vite.config.ts` and `tsconfig.json`.

**Barrel exports (`index.ts`) are banned** except at the `features/` level. They cause circular dependency issues with Redux slices.

---

## 6. API & Service Rules

**Services are singletons exported from `src/services/`.** Do not instantiate service clients in components or slices.

**All API calls must handle errors explicitly:**

```typescript
// ✅ GOOD
try {
  const breeds = await mcpClient.getBreedList();
  dispatch(setBreedsSuccess(breeds));
} catch (err) {
  dispatch(setBreedsError(getErrorMessage(err)));
}
```

**The Gemini API key must never appear in client-side bundle in production.** Development uses Vite proxy. Production uses a serverless edge function.

**MCP calls must always have a static fallback.** If the MCP server is unreachable, fall back to `src/data/breeds.fallback.json` and show a non-blocking banner.

---

## 7. Testing Rules

**Every Redux slice must have unit tests.** Cover: initial state, each reducer action, async thunk pending/fulfilled/rejected cases.

**Every utility function must have unit tests.**

**Component tests focus on user behavior, not implementation:**

```typescript
// ❌ BAD — tests internal state
expect(component.state.step).toBe(2);

// ✅ GOOD — tests what the user sees
expect(screen.getByText('Step 2 of 7')).toBeInTheDocument();
```

**Never test Redux internals directly in component tests.** Wrap the component in a real store with test state; don't mock the store.

**E2E tests cover critical paths only:**
- Complete quiz → view results
- Click breed card → view detail
- Add to compare → compare page

---

## 8. Accessibility Rules

Every PR must satisfy:
- All interactive elements reachable by keyboard.
- No focus traps (unless intentional modal pattern with escape key exit).
- All images have meaningful `alt` text (or `alt=""` for decorative).
- `aria-live="polite"` on streaming chat content.
- Color contrast meets WCAG AA (4.5:1 body, 3:1 large text).
- Do not rely on color alone to convey meaning.

Run `axe-core` in tests:
```typescript
import { axe } from 'jest-axe';
const results = await axe(container);
expect(results).toHaveNoViolations();
```

---

## 9. Git & PR Rules

**Branch naming:**
- `feat/description` — new feature
- `fix/description` — bug fix
- `chore/description` — tooling, deps
- `docs/description` — documentation only

**Commit messages follow Conventional Commits:**
```
feat(quiz): add free-text step 7
fix(chat): prevent double-submit during streaming
chore(deps): upgrade @google/generative-ai to 0.21
```

**PRs must:**
- Pass CI (lint + unit tests + TypeScript check).
- Have a description explaining the change and linking the tracker task.
- Not exceed 400 lines of diff (split large features into smaller PRs).
- Not merge `main` into feature branches — rebase instead.

**`main` is always deployable.** No WIP commits on `main`.

---

## 10. Performance Rules

- Lazy-load all page components with `React.lazy` + `Suspense`.
- Never import a full icon library — use named imports only: `import { Heart } from 'lucide-react'`.
- Breed images must use `loading="lazy"` and specify `width`/`height` to prevent layout shift.
- Memoize expensive selectors with `createSelector` (reselect, included in RTK).
- Do not `console.log` in committed code. Use the `debug` utility or remove before PR.

---

## 11. Security Rules

- Sanitize any user-provided text before sending to Gemini. Strip HTML tags.
- Never log API keys, user inputs, or chat content to the console or external services.
- Local storage values must be validated before use (treat as untrusted input).
- Keep dependencies up to date. Run `pnpm audit` weekly; fix any high/critical advisories before release.
