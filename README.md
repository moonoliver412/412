# CodeSprout 🌱

**The coding school where your knowledge is alive.**

Every topic is a tree: it grows while you run focus sessions, locks growth
stages as you complete hands-on lessons, and joins your forest when mastered.
CodeSprout welds Codecademy-style granular learn-by-doing to Forest-app
pomodoro mechanics and Duolingo-grade retention loops — entirely client-side.

## What's inside

- **145 authored lessons** across 29 topics — HTML (12), CSS (9), JS (8) —
  each a stepped, animated experience ending in a live code lab with
  auto-graded checks (DOM grading for HTML/CSS, sandboxed-iframe execution
  with console capture for JS).
- **Focus sessions** (pomodoro) grow the active topic's tree live; abandoning
  wilts it. Lessons can only be locked in during a running session.
- **Gamification**: daily streaks with auto-spending freeze, sprout economy
  (species shop), XP, 11 achievements with unlock toasts, daily goals.
- **Clear Field challenges** — blank editor, no hints, no starter code: the
  anti-tutorial-hell gate.
- **Forest page** with focus-diary heat calendar and a canvas-rendered
  shareable forest card (PNG download/clipboard).
- **Stuck-help in every lesson**: progressive hints, per-check nudges, and a
  view-solution path that pays half rewards.
- **Spaced repetition**: mastered trees follow an SM-2-lite watering schedule
  (intervals grow 3→60 days; lapses shorten them) — knowledge decay is visible.
- **Daily quests, XP ranks, streak wagers, Growth Chests** (earned triggers,
  random contents, rarity shown before opening), synthesized sound design,
  streak-at-risk reminders, first-run onboarding, 5-minute break timer.
- **Weekly focus league** vs simulated rivals — or real cohorts of 20 when
  cloud sync is configured.
- **PWA**: installable, works fully offline (the whole curriculum is bundled).
- **Settings**: sound, calm-motion override, reminders, save-file
  export/import, full reset.

All state lives in `localStorage` by default. Optional cloud sync (Supabase,
anonymous-first, teens-safe: neutral age screen, no PII on leaderboards) —
see `.env.example` and `supabase/schema.sql`.

## Run

```bash
npm install
npm run dev
```

## Develop

- `npm run build` / `npm run lint`
- Motion language is codified in `.claude/skills/motion-graphics/SKILL.md` —
  read it before touching any animation or authoring lessons.
- Strategy and research: `docs/MASTERPLAN.md`, `docs/research/`.
- State contracts: `src/state/useProgress.jsx` (trees/sessions),
  `src/state/useGame.jsx` (economy/streaks/achievements).
- Lesson data: `src/data/lessons/` — see grading contracts in
  `src/lib/checkExercise.js` (HTML/CSS) and `src/lib/jsRunner.js` (JS).
