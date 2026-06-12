// Daily quests — 3 per day, drawn deterministically from this pool by date,
// so every tab (and every reload) agrees without a server. Progress counts
// game events (see useGame.recordEvent); each completion pays sprouts, and
// sweeping all three pays a bonus.
//
// Every quest must be completable in one normal day — no "master a topic".

export const QUEST_REWARD_SPROUTS = 8;
export const QUEST_SWEEP_BONUS = 15;

export const QUEST_POOL = [
  {
    id: 'two-sessions',
    blurb: 'Finish 2 focus sessions',
    icon: '⏱️',
    target: 2,
    count: (event) => (event.type === 'sessionFinished' ? 1 : 0),
  },
  {
    id: 'one-lesson',
    blurb: 'Complete a lesson',
    icon: '📖',
    target: 1,
    count: (event) => (event.type === 'lesson' ? 1 : 0),
  },
  {
    id: 'three-lessons',
    blurb: 'Complete 3 lessons',
    icon: '📚',
    target: 3,
    count: (event) => (event.type === 'lesson' ? 1 : 0),
  },
  {
    id: 'minutes-30',
    blurb: 'Focus for 30 minutes',
    icon: '🔥',
    target: 30,
    count: (event) =>
      event.type === 'sessionFinished' ? (event.minutes ?? 0) : 0,
  },
  {
    id: 'tend-one',
    blurb: 'Water or practice a tree',
    icon: '💧',
    target: 1,
    count: (event) =>
      event.type === 'water' || event.type === 'practice' ? 1 : 0,
  },
  {
    id: 'challenge-one',
    blurb: 'Clear a challenge field',
    icon: '🏆',
    target: 1,
    count: (event) => (event.type === 'challenge' ? 1 : 0),
  },
  {
    id: 'xp-60',
    blurb: 'Earn 60 XP',
    icon: '⚡',
    target: 60,
    count: (event, ctx) => ctx.xpGained,
  },
  {
    id: 'html-lesson',
    blurb: 'Complete an HTML lesson',
    icon: '🧱',
    target: 1,
    count: (event) =>
      event.type === 'lesson' && event.topicId?.startsWith('html-') ? 1 : 0,
  },
  {
    id: 'css-lesson',
    blurb: 'Complete a CSS lesson',
    icon: '🎨',
    target: 1,
    count: (event) =>
      event.type === 'lesson' && event.topicId?.startsWith('css-') ? 1 : 0,
  },
  {
    id: 'js-lesson',
    blurb: 'Complete a JS lesson',
    icon: '⚙️',
    target: 1,
    count: (event) =>
      event.type === 'lesson' && event.topicId?.startsWith('js-') ? 1 : 0,
  },
];

/** Deterministic hash of a YYYY-MM-DD string. */
function dayHash(day) {
  let h = 2166136261;
  for (let i = 0; i < day.length; i++) {
    h ^= day.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/** The 3 quests for `day` — same picks everywhere, varied day to day. */
export function questsFor(day) {
  const picked = [];
  let h = dayHash(day);
  const pool = [...QUEST_POOL];
  while (picked.length < 3 && pool.length) {
    h = (Math.imul(h, 1664525) + 1013904223) >>> 0;
    picked.push(pool.splice(h % pool.length, 1)[0]);
  }
  return picked;
}

export function getQuest(id) {
  return QUEST_POOL.find((q) => q.id === id) ?? null;
}

/** Today's quests joined with stored progress (zeroed if the day rolled). */
export function questView(questsState, day) {
  const active = questsFor(day);
  const fresh = questsState?.date === day;
  return active.map((quest) => ({
    ...quest,
    progress: fresh
      ? Math.min(questsState.progress?.[quest.id] ?? 0, quest.target)
      : 0,
    done: fresh && (questsState.done ?? []).includes(quest.id),
  }));
}
