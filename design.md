# Design Specification — TinyCats

**Version:** 1.0  
**Last Updated:** 2025-06-13

---

## 1. Design Principles

- **Playful but not childish.** TinyCats is warm and approachable. Cats are charming — the UI should feel the same.
- **Content first.** Breed photos and trait data are the hero. Never obscure them with chrome.
- **Conversational feel.** The quiz and chat feel like talking to a knowledgeable friend, not filling out a form.
- **Fast and frictionless.** Every screen does one thing well.

---

## 2. Color Palette

| Token | Hex | Usage |
|---|---|---|
| `--color-primary` | `#7C5CBF` | CTAs, active states, links |
| `--color-primary-light` | `#EEE8FA` | Hover fills, selected cards |
| `--color-accent` | `#F4A261` | Match score badge, highlights |
| `--color-surface` | `#FAFAF8` | Page background |
| `--color-card` | `#FFFFFF` | Card backgrounds |
| `--color-text-primary` | `#1C1C1E` | Headings, body text |
| `--color-text-secondary` | `#6B7280` | Subtitles, meta |
| `--color-border` | `#E5E7EB` | Card borders, dividers |
| `--color-success` | `#34D399` | Good match indicators |
| `--color-warning` | `#FBBF24` | Moderate match |
| `--color-danger` | `#F87171` | Poor match, errors |

Dark mode: invert surface/card, soften text contrast. `prefers-color-scheme` auto-applied.

---

## 3. Typography

| Role | Font | Weight | Size |
|---|---|---|---|
| Display (hero) | `Fraunces` (serif) | 700 | 40–56px |
| Heading 1 | `Fraunces` | 600 | 28–32px |
| Heading 2 | `Inter` | 600 | 20–22px |
| Body | `Inter` | 400 | 15–16px |
| Caption / meta | `Inter` | 400 | 12–13px |
| Monospace / code | `JetBrains Mono` | 400 | 13px |

Fonts loaded via Google Fonts. Base line-height: `1.6`. Heading line-height: `1.2`.

---

## 4. Spacing Scale (Tailwind)

Using Tailwind's default 4px base:
- `space-1` = 4px
- `space-2` = 8px
- `space-4` = 16px
- `space-6` = 24px
- `space-8` = 32px
- `space-12` = 48px
- `space-16` = 64px

Component inner padding: `p-6` (24px). Section gaps: `gap-8` (32px).

---

## 5. Component Library

Built on **shadcn/ui** + custom overrides via Tailwind.

### 5.1 Breed Card

```
┌────────────────────────────────┐
│ [Hero image 16:9]              │
├────────────────────────────────┤
│ 🐱 Ragdoll            94% ●●●● │
│ Calm · Affectionate · Low-shed │
│                                │
│ "Perfect for apartment living  │
│  and first-time owners…"       │
│                                │
│ [View Details]  [+ Compare]    │
└────────────────────────────────┘
```

- Border: `1px solid var(--color-border)`, `rounded-2xl`
- Hover: `shadow-lg`, `translateY(-2px)` 200ms ease
- Match score badge: accent colored pill, top-right
- Saved state: heart icon fills on click

### 5.2 Quiz Step

Single question, large tap targets, no keyboard required.

```
┌────────────────────────────────┐
│  Step 3 of 7  ████████░░░░░░   │
│                                │
│  How sensitive are you to      │
│  cat allergies?                │
│                                │
│  ○  No allergies               │
│  ○  Mild sensitivity           │
│  ○  Severe — hypo only         │
│                                │
│  [← Back]              [Next →]│
└────────────────────────────────┘
```

- Option rows: `h-14`, full-width, `rounded-xl`
- Selected: `bg-primary-light border-primary`

### 5.3 Chat Bubble

```
AI:   ┌──────────────────────────────────┐
      │ 🐾 Based on your love of quiet   │
      │ evenings, the British Shorthair  │
      │ would suit you perfectly…        │
      └──────────────────────────────────┘

User:                    ┌────────────────┐
                         │ What about the │
                         │ Maine Coon?    │
                         └────────────────┘
```

- AI bubble: `bg-primary-light`, left-aligned
- User bubble: `bg-primary text-white`, right-aligned
- Streaming cursor: blinking `_` appended while `isStreaming`

### 5.4 Trait Bar

Horizontal bars for Energy, Grooming, Sociability, Intelligence, Allergen Level.

```
Energy       ████████░░  8/10
Grooming     ███░░░░░░░  3/10
Sociability  █████████░  9/10
```

- Fill color: `--color-primary`
- Low scores (1–3) in grooming/allergen use `--color-success` (lower = better)

---

## 6. Layout

### Results Page

```
Desktop (≥1024px):
┌──────────────────────────────┬─────────────────────┐
│  Recommendations (flex-col)  │  Chat Panel (sticky) │
│  w: ~60%                     │  w: ~40%             │
└──────────────────────────────┴─────────────────────┘

Mobile (<1024px):
┌──────────────────────────────┐
│  Recommendations (full)      │
├──────────────────────────────┤
│  Chat Panel (bottom sheet)   │
└──────────────────────────────┘
```

### Breed Detail Page

Max-width `960px`, centered. Two-column above-fold: image left (60%), stats right (40%).

### Compare Page

Horizontal scroll on mobile. Fixed breed name column, scrollable trait columns.

---

## 7. Iconography

Use **Lucide React** throughout. Key icons:

| Icon | Usage |
|---|---|
| `Heart` | Save breed |
| `ArrowLeftRight` | Compare |
| `Sparkles` | AI / Gemini badge |
| `ChevronRight` | Navigation |
| `Search` | Browse filter |
| `Cat` | App logo / empty state |
| `Share2` | Share results |

---

## 8. Motion

- Page transitions: `opacity 0→1`, `translateY 8px→0`, 200ms ease-out.
- Card hover lift: `translateY(-2px) shadow-lg`, 150ms.
- Chat stream: tokens appear in place, no layout shift.
- Quiz step change: slide left (forward), slide right (back).
- Loading skeleton: pulse animation, `bg-gray-200`.

Respect `prefers-reduced-motion`: disable transitions, keep fades only.

---

## 9. Accessibility

- All interactive elements keyboard-navigable.
- Focus rings: `2px solid var(--color-primary)`, `2px offset`.
- `aria-live="polite"` on chat stream container.
- Quiz progress: `role="progressbar"` with `aria-valuenow`.
- Images: meaningful `alt` text for breed photos.
- Contrast ratios meet WCAG AA (4.5:1 text, 3:1 large).

---

## 10. Empty & Loading States

| State | Treatment |
|---|---|
| Quiz loading breeds | Full-page cat paw spinner |
| Cards loading | 3× skeleton cards with pulse |
| Chat streaming | Animated ellipsis `···` in bubble |
| No results | Illustration + "Let's broaden the search" CTA |
| Breed image error | `Cat` icon placeholder, `bg-gray-100` |
