import { describe, expect, it } from 'vitest';
import { STAGES_PER_TOPIC } from '../data/curriculum';
import { isThirsty, THIRST_DAYS, visualStage } from './useProgress';

const DAY = 86_400_000;
const NOW = Date.parse('2026-06-12T12:00:00');

const topic = (over = {}) => ({
  lockedStage: 0,
  wilted: false,
  focusMinutes: 0,
  kind: null,
  tendedAt: null,
  ...over,
});

describe('isThirsty', () => {
  it('never marks unmastered topics thirsty', () => {
    expect(
      isThirsty(topic({ lockedStage: 3, tendedAt: NOW - 30 * DAY }), NOW)
    ).toBe(false);
  });

  it('mastered + freshly tended is not thirsty', () => {
    expect(
      isThirsty(
        topic({ lockedStage: STAGES_PER_TOPIC, tendedAt: NOW - DAY }),
        NOW
      )
    ).toBe(false);
  });

  it('mastered + untended past the threshold is thirsty', () => {
    expect(
      isThirsty(
        topic({
          lockedStage: STAGES_PER_TOPIC,
          tendedAt: NOW - (THIRST_DAYS + 1) * DAY,
        }),
        NOW
      )
    ).toBe(true);
  });

  it('legacy mastered topics without a stamp stay fresh', () => {
    expect(isThirsty(topic({ lockedStage: STAGES_PER_TOPIC }), NOW)).toBe(
      false
    );
  });
});

describe('visualStage', () => {
  it('returns locked stage with no session', () => {
    expect(visualStage(topic({ lockedStage: 2 }), null, 't1', 0)).toBe(2);
  });

  it('adds partial in-session growth for the active topic only', () => {
    const session = { topicId: 't1', durationMin: 10, running: true };
    expect(
      visualStage(topic({ lockedStage: 2 }), session, 't1', 5 * 60_000)
    ).toBeCloseTo(2.5);
    expect(
      visualStage(topic({ lockedStage: 2 }), session, 'other', 5 * 60_000)
    ).toBe(2);
  });

  it('caps at STAGES_PER_TOPIC', () => {
    const session = { topicId: 't1', durationMin: 1, running: true };
    expect(
      visualStage(
        topic({ lockedStage: STAGES_PER_TOPIC }),
        session,
        't1',
        10 * 60_000
      )
    ).toBe(STAGES_PER_TOPIC);
  });
});
