import { describe, expect, it } from 'vitest';
import {
  advanceReview,
  initReview,
  isLapse,
  MAX_EASE,
  MAX_INTERVAL,
  MIN_EASE,
  reviewLapsed,
  reviewPassed,
} from './srs';

const DAY = 86_400_000;
const NOW = Date.parse('2026-06-12T12:00:00');

describe('srs', () => {
  it('initReview starts at 3 days', () => {
    const r = initReview(NOW);
    expect(r.interval).toBe(3);
    expect(r.due).toBe(NOW + 3 * DAY);
  });

  it('passing grows the interval multiplicatively and caps at 60', () => {
    let r = initReview(NOW);
    const seen = [];
    for (let i = 0; i < 6; i++) {
      r = reviewPassed(r, NOW);
      seen.push(r.interval);
    }
    expect(seen[0]).toBe(6); // 3 * 2.0
    expect(seen).toEqual([...seen].sort((a, b) => a - b)); // monotonic
    expect(seen[seen.length - 1]).toBe(MAX_INTERVAL);
    expect(r.ease).toBeLessThanOrEqual(MAX_EASE);
  });

  it('lapsing halves the interval and drops ease (floored)', () => {
    let r = { interval: 14, ease: 1.4, due: NOW - 20 * DAY };
    r = reviewLapsed(r, NOW);
    expect(r.interval).toBe(7);
    expect(r.ease).toBe(MIN_EASE);
    expect(r.due).toBe(NOW + 7 * DAY);
  });

  it('isLapse only when more than one interval late', () => {
    const r = { interval: 7, ease: 2.0, due: NOW };
    expect(isLapse(r, NOW + 6 * DAY)).toBe(false);
    expect(isLapse(r, NOW + 8 * DAY)).toBe(true);
  });

  it('advanceReview routes to pass or lapse', () => {
    const r = { interval: 7, ease: 2.0, due: NOW };
    expect(advanceReview(r, NOW + DAY).interval).toBeGreaterThan(7);
    expect(advanceReview(r, NOW + 10 * DAY).interval).toBeLessThan(7);
  });
});
