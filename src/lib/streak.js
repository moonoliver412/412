// Pure streak math for useGame — extracted so it can be unit-tested.
//
// A streak is { lastActiveDay: 'YYYY-MM-DD'|null, current, longest, freezes }.
// A day counts when the learner completes a lesson, finishes a session,
// completes a challenge, or waters a tree. One freeze auto-covers exactly
// one missed day (a 2-day gap); longer gaps reset the streak to 1.

export function todayStr(now = new Date()) {
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${now.getFullYear()}-${m}-${d}`;
}

export function dayGap(fromDay, toDay) {
  return Math.round((Date.parse(toDay) - Date.parse(fromDay)) / 86_400_000);
}

export function advanceStreak(streak, today) {
  if (streak.lastActiveDay === today) return streak;
  let { current, freezes } = streak;
  if (!streak.lastActiveDay) {
    current = 1;
  } else {
    const gap = dayGap(streak.lastActiveDay, today);
    if (gap === 1) current += 1;
    else if (gap === 2 && freezes > 0) {
      freezes -= 1;
      current += 1;
    } else current = 1;
  }
  return {
    lastActiveDay: today,
    current,
    longest: Math.max(streak.longest, current),
    freezes,
  };
}
