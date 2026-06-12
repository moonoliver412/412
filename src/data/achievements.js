// Achievement definitions — data-driven, evaluated by useGame on every
// recorded event. `test(ctx)` receives:
//   ctx.game      — the game state AFTER the event's rewards applied
//   ctx.progress  — the progress map { topicId: { lockedStage, focusMinutes… } }
//   ctx.event     — { type, topicId, minutes? }
//   ctx.now       — Date at evaluation time
// Tests must be pure and cheap; they run only for still-locked achievements.

import { LANGUAGES, STAGES_PER_TOPIC } from './curriculum';

const allTopics = LANGUAGES.flatMap((lang) => lang.topics);

function masteredCount(progress) {
  return allTopics.filter(
    (t) => (progress[t.id]?.lockedStage ?? 0) >= STAGES_PER_TOPIC
  ).length;
}

function totalFocusMinutes(progress) {
  return Object.values(progress).reduce(
    (sum, t) => sum + (t?.focusMinutes ?? 0),
    0
  );
}

export const ACHIEVEMENTS = [
  {
    id: 'seedling',
    name: 'Seedling',
    blurb: 'Completed your first lesson',
    icon: '🌱',
    test: ({ event }) => event.type === 'lesson',
  },
  {
    id: 'first-rain',
    name: 'First Rain',
    blurb: 'Finished your first focus session',
    icon: '🌧️',
    test: ({ event }) => event.type === 'sessionFinished',
  },
  {
    id: 'taking-root',
    name: 'Taking Root',
    blurb: 'Reached a 3-day streak',
    icon: '🌿',
    test: ({ game }) => game.streak.current >= 3,
  },
  {
    id: 'deep-roots',
    name: 'Deep Roots',
    blurb: 'Reached a 10-day streak',
    icon: '🌲',
    test: ({ game }) => game.streak.current >= 10,
  },
  {
    id: 'arborist',
    name: 'Arborist',
    blurb: 'Grew your first tree to full height',
    icon: '🌳',
    test: ({ event }) => event.type === 'topicMastered',
  },
  {
    id: 'grove-keeper',
    name: 'Grove Keeper',
    blurb: 'Mastered three topics',
    icon: '🏞️',
    test: ({ progress }) => masteredCount(progress) >= 3,
  },
  {
    id: 'polyglot',
    name: 'Polyglot',
    blurb: 'Started a tree in every language',
    icon: '🗺️',
    test: ({ progress }) =>
      LANGUAGES.every((lang) =>
        lang.topics.some((t) => (progress[t.id]?.lockedStage ?? 0) > 0)
      ),
  },
  {
    id: 'night-owl',
    name: 'Night Owl',
    blurb: 'Finished a focus session in the small hours',
    icon: '🦉',
    test: ({ event, now }) =>
      event.type === 'sessionFinished' && now.getHours() < 5,
  },
  {
    id: 'centurion',
    name: 'Centurion',
    blurb: 'Banked 100 lifetime focus minutes',
    icon: '⏳',
    test: ({ progress }) => totalFocusMinutes(progress) >= 100,
  },
  {
    id: 'rich-soil',
    name: 'Rich Soil',
    blurb: 'Held 100 sprouts at once',
    icon: '💰',
    test: ({ game }) => game.sprouts >= 100,
  },
  {
    id: 'rainmaker',
    name: 'Rainmaker',
    blurb: 'Watered a thirsty tree back to health',
    icon: '💧',
    test: ({ event }) => event.type === 'water',
  },
  {
    id: 'whole-grove',
    name: 'The Whole Grove',
    blurb: 'Mastered every topic — a complete forest',
    icon: '✨',
    test: ({ progress }) => masteredCount(progress) === allTopics.length,
  },
];

export function getAchievement(id) {
  return ACHIEVEMENTS.find((a) => a.id === id) ?? null;
}
