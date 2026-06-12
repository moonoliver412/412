---
name: motion-graphics
description: CodeSprout's motion-graphics bible — timing tokens, easing, choreography tiers, celebration recipes, and performance laws. MUST be followed whenever creating or editing lessons, lesson content, UI screens, or any animation, transition, or interactive feedback in this app.
---

# CodeSprout Motion Graphics

Motion is the premium layer of CodeSprout. Layouts stay minimalist (black pill
panels, sage page, generous space); the *thrill* comes from how things move.
Every animation must answer one question for the learner: **"what just
changed, and was it good?"** If an animation doesn't answer that, delete it.

## 1. Tokens — never hand-roll values

Defined in `src/styles/theme.css`. Always use them; never write raw `ms` or
bezier values in component CSS.

| Token | Value | Use for |
|---|---|---|
| `--mo-fast` | 140ms | hovers, presses, focus rings |
| `--mo-base` | 260ms | enters, exits, state flips, step slides |
| `--mo-slow` | 480ms | dialog entrances, big reveals |
| `--mo-epic` | 1100ms | celebrations only (particles, ceremony) |
| `--ease-out` | cubic-bezier(0.22, 1, 0.36, 1) | default for everything entering/settling |
| `--ease-spring` | cubic-bezier(0.34, 1.56, 0.64, 1) | pops, celebrations, things that should feel alive |
| `--ease-in` | cubic-bezier(0.55, 0, 1, 0.45) | exits only |

Exits are always **faster** than entrances (use `--mo-fast`/`--mo-base` with
`--ease-in`). Nothing the user dismisses may linger.

## 2. The four tiers

Classify every animation before writing it. Each tier has a budget.

- **T0 — Ambient life.** Loops that signal "this is live": the focus-session
  dot ping, the current progress-segment shimmer, an armed CTA breathing.
  Budget: **max 2 looping elements visible per view**, subtle (opacity or
  ≤4% scale), period ≥ 1.6s. Ambient motion must never pull the eye from
  content.
- **T1 — Micro feedback.** Hover/press/focus. `--mo-fast`, transform/opacity
  only (arrow nudges 4px, button lifts 1px, scale ≤ 1.05). Every interactive
  element gets T1; an element with no hover response reads as broken.
- **T2 — Transitions.** Enter/exit/step changes. Recipe: rise 10–16px +
  fade, `--mo-base` `--ease-out`. Stagger siblings by **50ms** via
  `animation-delay: calc(var(--i) * 50ms)` with `--i` set inline; max ~6
  staggered children, the rest arrive with the last. Step navigation is
  **direction-aware**: forward slides in from the right, back from the left
  (container `data-dir` attribute).
- **T3 — Celebrations.** Earned moments only: a check passing, all checks
  passing, a lesson completing, a stage locking. Use `--ease-spring`, may use
  `--mo-epic`, may use particles. A celebration fires **once per
  achievement** — track previous state (ref) and animate only on the
  false→true edge, never on mount or re-render.

Escalation must match the achievement: single check = small pop; all checks =
CTA ignites; lesson complete = full ceremony. Never spend a T3 on something
the user didn't earn.

## 3. Recipes

- **Tick draw:** checkmarks are SVG paths with `stroke-dasharray` =
  path length, `stroke-dashoffset` transitioned to 0 on pass (`--mo-base`
  `--ease-out`), plus a `--ease-spring` scale pop on the just-passed edge.
- **Particle burst:** ≤ 16 particles, absolutely positioned spans, **one
  keyframe animation per element** using per-element custom props
  (`--n` → angle/distance with `cos()`/`sin()`), `--mo-epic`, `forwards`,
  ends at opacity 0. Particles are leaves/petals in theme colors (sage,
  amber) — never generic confetti rectangles.
- **Breathing CTA:** when a primary action becomes available, give it a
  static glow plus a ≤3% scale loop. The disabled→enabled flip is the signal;
  the breathing keeps it alive.
- **Live dot:** a dot with an `::after` ring scaling 1→2.2 + fading, looped.
  Transform/opacity only — no animated box-shadow rings.
- **Progress rail:** thin segments (3–4px). Done = filled (color transition),
  current = slow gradient shimmer (the view's T0 budget), upcoming = dim.

## 4. Performance laws (violations have burned us before)

1. **Animate `transform` and `opacity` only** for anything that loops,
   staggers, or touches many elements. One-shot entrances (≤300ms) on a
   single overlay element may also fade `backdrop-filter`.
2. **Never animate an inherited CSS custom property on a container** — it
   re-styles every descendant per frame (this once cost ~80ms/frame across
   the tree plot). Scene-wide effects = per-element transform keyframes on a
   shared period.
3. Never animate layout properties (width/height/top/left/margin/padding).
4. `will-change` only on elements mid-animation, never left on at rest.
5. Respect `React.memo` contracts: animation state that changes per frame
   stays in CSS; React re-renders only on discrete state changes; keep
   memoized component props primitive.
6. Replay-on-remount is the mechanism for step transitions: change the
   element `key`, let the CSS entrance run again. No JS animation libraries.

## 5. Accessibility — non-negotiable

- Every stylesheet that animates ends with a
  `@media (prefers-reduced-motion: reduce)` block that disables its
  animations and transitions. Reduced motion = **instant, not absent**:
  state changes still happen, they just don't tween.
- Animation decorates state; it never gates it. The app must be fully usable
  if every animation were deleted (state flips instantly, ceremony still
  shows its button).
- Status text that changes asynchronously gets `role="status"`. Decorative
  motion elements (particles, rings, rails) get `aria-hidden="true"`.
- Focus is always visible; keyboard reaches everything the mouse can.

## 6. Authoring lesson content for motion

When writing lesson data (`src/data/lessons/**`):

- Write blocks in **beats**: paragraphs build up to a `code` or `tip` block.
  The lesson player chunks steps by closing each step on a code/tip block —
  a step that is only loose paragraphs has no payoff frame.
- Keep steps tight: 1–3 paragraphs per code/tip payoff. A lesson should
  yield 2–4 teaching steps before the lab.
- Every exercise needs **≥ 2 checks** so the quest list visibly fills; order
  checks in the sequence the learner will naturally satisfy them.
- Write check labels as outcomes the tick celebrates ("Your page has an
  `<h1>` heading"), never as commands ("Add an h1").

## 7. Pre-ship checklist

- [ ] Every animation classified T0–T3 and within its tier budget
- [ ] Tokens only — no raw durations/beziers
- [ ] T3s fire on edges (ref-tracked), once per achievement
- [ ] Loops/staggers are transform/opacity only
- [ ] No container-level custom-property animation
- [ ] `prefers-reduced-motion` block present in every animating stylesheet
- [ ] Decorative elements `aria-hidden`, async notes `role="status"`
- [ ] Exits faster than entrances
