import { describe, expect, it } from 'vitest';
import { advanceStreak, dayGap, todayStr } from './streak';

const base = { lastActiveDay: null, current: 0, longest: 0, freezes: 1 };

describe('advanceStreak', () => {
  it('starts a streak on first activity', () => {
    const s = advanceStreak(base, '2026-06-12');
    expect(s).toEqual({
      lastActiveDay: '2026-06-12',
      current: 1,
      longest: 1,
      freezes: 1,
    });
  });

  it('is idempotent within the same day', () => {
    const s1 = advanceStreak(base, '2026-06-12');
    const s2 = advanceStreak(s1, '2026-06-12');
    expect(s2).toBe(s1);
  });

  it('increments on consecutive days', () => {
    let s = advanceStreak(base, '2026-06-12');
    s = advanceStreak(s, '2026-06-13');
    expect(s.current).toBe(2);
    expect(s.longest).toBe(2);
  });

  it('spends a freeze to cover exactly one missed day', () => {
    let s = advanceStreak(base, '2026-06-12');
    s = advanceStreak(s, '2026-06-14'); // skipped the 13th
    expect(s.current).toBe(2);
    expect(s.freezes).toBe(0);
  });

  it('resets after a missed day with no freeze left', () => {
    let s = advanceStreak({ ...base, freezes: 0 }, '2026-06-12');
    s = advanceStreak(s, '2026-06-14');
    expect(s.current).toBe(1);
  });

  it('resets after a multi-day gap even with a freeze', () => {
    let s = advanceStreak(base, '2026-06-12');
    s = advanceStreak(s, '2026-06-16');
    expect(s.current).toBe(1);
    expect(s.freezes).toBe(1); // freeze only covers a single missed day
  });

  it('keeps the longest streak across resets', () => {
    let s = { ...base, freezes: 0 };
    for (const d of ['2026-06-01', '2026-06-02', '2026-06-03']) {
      s = advanceStreak(s, d);
    }
    s = advanceStreak(s, '2026-06-10');
    expect(s.current).toBe(1);
    expect(s.longest).toBe(3);
  });

  it('crosses month boundaries', () => {
    let s = advanceStreak(base, '2026-06-30');
    s = advanceStreak(s, '2026-07-01');
    expect(s.current).toBe(2);
  });
});

describe('dayGap / todayStr', () => {
  it('computes gaps in days', () => {
    expect(dayGap('2026-06-12', '2026-06-14')).toBe(2);
  });

  it('formats dates as YYYY-MM-DD', () => {
    expect(todayStr(new Date(2026, 5, 9))).toBe('2026-06-09');
  });
});
