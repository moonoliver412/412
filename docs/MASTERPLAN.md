# CodeSprout Master Plan

> Synthesized June 2026 from `docs/research/codecademy.md` + `docs/research/competitors.md`
> plus a codebase audit. This is the build contract for the production push.

## Positioning

**CodeSprout is the coding school where your knowledge is alive.**
Codecademy teaches well but is unstructured (binge-or-ghost, no session
mechanic), hand-holdy (tutorial hell), socially dead, and hides its best
retention tool (spaced repetition) behind an invisible Pro feature. Duolingo
and Boot.dev prove streaks, variable rewards, and day-1 wins drive retention.
Nobody renders your learning as a living, persistent, *decaying* artifact.

CodeSprout's wedge — one sentence:
> Every topic is a tree: it grows while you focus, it locks growth when you
> prove a skill, and it wilts when you stop reviewing. Your forest IS your
> knowledge — visible, beautiful, and worth protecting.

## Pillars (what must be true to be globally competitive)

1. **Focus sessions are the unit of learning** (vs. Codecademy's unstructured
   completion %). Pomodoro container + tree growth = two dopamine loops:
   micro (session) and macro (lesson/tree).
2. **Granular checkpoint dopamine** (Codecademy's best idea): every lesson is
   stepped beats with per-check celebrations — already built in LessonPanel;
   extend the same language everywhere.
3. **No tutorial hell**: blank-page challenges gate real mastery (Challenges
   page = "clear field" mode, no starter code).
4. **The 10-day streak ramp** (Duolingo's #1 lever): daily streak + Rain
   Cloud freeze + day-1 "Seedling" achievement (33% vs 20% retention).
5. **Visible knowledge state**: mastered trees eventually wilt without
   review; "watering" (review) restores them. SR as the emotional core, not
   a hidden flashcard list.
6. **Premium-minimal motion** (`.claude/skills/motion-graphics`): the thrill
   is choreography, not chrome. Celebrations fire once, on earned edges.
7. **Shareable proof of effort**: canvas-rendered forest card → PNG. The
   acquisition loop with zero backend.

## Constraints

- **localStorage only** — no backend, no accounts, no payments. Anything
  requiring a server (community events, real leagues) is simulated locally or
  descoped.
- All UI work obeys the motion-graphics skill (tokens, tiers, reduced-motion).
- Disjoint file ownership when parallelizing agents; orchestrator wires
  shared files (lessons/index.js, useProgress, App routes).

## Build phases (≈ task list)

| # | Phase | Contents | Status |
|---|---|---|---|
| 1 | Research | Codecademy + competitor teardowns | DONE |
| 2 | Master plan | this file | DONE |
| 3 | CSS track | 9 topics × 5 lessons in `src/data/lessons/css/`; `styleIncludes` check type | next |
| 4 | JS track | 8 topics × 5 lessons; JS-capable check types (console/DOM-result) | queued |
| 5 | Economy + streaks + achievements | `useGame` state slice: sprouts (coins), XP, daily streak + Rain Cloud freeze, achievements engine, day-1 Seedling badge, species shop prices | queued |
| 6 | Home + Learn redesign | Home = dashboard (streak flame, daily goal, next-lesson CTA, forest peek); Learn = real catalog (per-language progress, ghost/locked topic trees as pull) | queued |
| 7 | Challenges + Leaderboard | blank-page "Clear Field" challenges (anti-tutorial-hell gate, sprout rewards); local league vs simulated rivals seeded from focus minutes | queued |
| 8 | Focus History diary | session log (date/topic/minutes/outcome) + GitHub-style heat calendar on Forest page | queued |
| 9 | Forest share card | canvas → PNG: tree count, species, streak, longest session | queued |
| 10 | Knowledge decay (stretch) | mastered topics wilt after N days unreviewed; "Water" = 5-question review quiz restoring freshness; simplified SM-2 intervals | stretch |
| 11 | Production hardening | error boundary, storage versioning/migration, responsive, a11y, meta/SEO/OG, README, perf, full screenshot walkthrough | final |

## Mechanics spec (research-grounded decisions)

- **Streak**: `{ lastActiveDay, current, longest, freezes }` — a day counts
  when a focus session finishes OR a lesson completes. One Rain Cloud freeze
  auto-spends on a single missed day. Golden-sapling celebration at day 10.
- **Sprouts (coins)**: earn 10/lesson, 5/finished session, 25/topic mastered,
  challenge bonuses. Spend: species unlocks (escalating prices), Rain Cloud
  (50), cosmetics later. XP separate (never spendable) → level = forest rank.
- **Achievements**: data-driven list checked on state transitions; Seedling
  (first lesson), Deep Roots (10-day streak), Arborist (first mastered tree),
  Polyglot (tree in every language), Night Owl etc. Toast on unlock (T3, once).
- **NO hearts/lives/energy** — universally hated; struggling learners quit.
- **Daily goal**: user-picked (1 session / 2 sessions / 4 sessions) — chosen
  goal size is itself a commitment device.
- **Celebrations**: instant, 1.5–2s, never require dismissal, fire once per
  achievement edge (already codified in the motion skill).

## Out of scope (explicitly)

Backend/auth/payments, real multiplayer leagues, community boss fights
(needs server), mobile app, AI tutor. The architecture should not foreclose
them, but tonight ships a complete client-side product.
