import { describe, expect, it } from 'vitest';
import { QUEST_POOL, questsFor, questView } from './quests';
import { rankFor, nextRank, RANKS } from './ranks';
import { resolveWager } from '../lib/streak';

describe('questsFor', () => {
  it('is deterministic for a given day', () => {
    const a = questsFor('2026-06-12').map((q) => q.id);
    const b = questsFor('2026-06-12').map((q) => q.id);
    expect(a).toEqual(b);
  });

  it('picks 3 distinct quests and varies across days', () => {
    const days = ['2026-06-10', '2026-06-11', '2026-06-12', '2026-06-13'];
    const sets = days.map((d) => questsFor(d).map((q) => q.id).join(','));
    for (const set of sets) expect(new Set(set.split(',')).size).toBe(3);
    expect(new Set(sets).size).toBeGreaterThan(1);
  });

  it('every pool quest has a workable shape', () => {
    for (const q of QUEST_POOL) {
      expect(q.target).toBeGreaterThan(0);
      expect(typeof q.count).toBe('function');
      expect(
        q.count({ type: 'sessionFinished', minutes: 25 }, { xpGained: 25 })
      ).toBeGreaterThanOrEqual(0);
    }
  });
});

describe('questView', () => {
  it('zeroes progress when the stored day rolled over', () => {
    const stale = { date: '2026-06-11', progress: { 'one-lesson': 1 }, done: ['one-lesson'] };
    for (const q of questView(stale, '2026-06-12')) {
      expect(q.progress).toBe(0);
      expect(q.done).toBe(false);
    }
  });
});

describe('rankFor', () => {
  it('walks the ladder monotonically', () => {
    expect(rankFor(0).name).toBe('Seed');
    expect(rankFor(99).name).toBe('Seed');
    expect(rankFor(100).name).toBe('Sprout');
    expect(rankFor(99999).name).toBe('Forest Warden');
    expect(nextRank(0).name).toBe('Sprout');
    expect(nextRank(RANKS[RANKS.length - 1].at)).toBeNull();
  });
});

describe('resolveWager', () => {
  const wager = { startDay: '2026-06-01', stake: 50 };

  it('pending while the streak holds under 7 days', () => {
    const streak = { lastActiveDay: '2026-06-03', current: 3, longest: 3, freezes: 1 };
    expect(resolveWager(wager, streak, '2026-06-03')).toBe('pending');
  });

  it('won at day 7 with the streak intact', () => {
    const streak = { lastActiveDay: '2026-06-07', current: 7, longest: 7, freezes: 1 };
    expect(resolveWager(wager, streak, '2026-06-07')).toBe('won');
  });

  it('lost when a day was missed (streak reset)', () => {
    const streak = { lastActiveDay: '2026-06-05', current: 1, longest: 3, freezes: 0 };
    expect(resolveWager(wager, streak, '2026-06-05')).toBe('lost');
  });
});
