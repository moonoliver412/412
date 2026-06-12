// SM-2-lite spaced repetition for topic "watering" — pure and unit-tested.
//
// Each MASTERED topic carries review = { interval (days), ease, due (ms) }.
// Watering on time grows the interval multiplicatively (≈ 3→6→13→27→60);
// watering long after it was due (a lapse) halves it and drops the ease, so
// neglected knowledge gets reviewed more often again. Full FSRS is overkill
// at topic granularity (see docs: plan P1A-5).

const DAY = 86_400_000;

export const MIN_INTERVAL = 1;
export const MAX_INTERVAL = 60;
export const MIN_EASE = 1.3;
export const MAX_EASE = 2.5;

/** First review schedule, set when a topic is mastered. */
export function initReview(now = Date.now()) {
  return { interval: 3, ease: 2.0, due: now + 3 * DAY };
}

/** Watered on time (or reasonably late): interval grows, ease creeps up. */
export function reviewPassed(review, now = Date.now()) {
  const interval = Math.min(
    MAX_INTERVAL,
    Math.max(MIN_INTERVAL, Math.round(review.interval * review.ease))
  );
  const ease = Math.min(MAX_EASE, review.ease + 0.05);
  return { interval, ease, due: now + interval * DAY };
}

/** Watered long after due (lapse): interval halves, ease drops. */
export function reviewLapsed(review, now = Date.now()) {
  const interval = Math.max(MIN_INTERVAL, Math.round(review.interval / 2));
  const ease = Math.max(MIN_EASE, review.ease - 0.2);
  return { interval, ease, due: now + interval * DAY };
}

/** A watering counts as a lapse when it happens > one full interval late. */
export function isLapse(review, now = Date.now()) {
  return now > review.due + review.interval * DAY;
}

/** Advance a review after a successful watering, lapse-aware. */
export function advanceReview(review, now = Date.now()) {
  return isLapse(review, now)
    ? reviewLapsed(review, now)
    : reviewPassed(review, now);
}
