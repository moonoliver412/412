// Streak-at-risk awareness, tier 1 (client-only).
//
// Scheduled web notifications without a server are dead tech (Chrome
// abandoned Notification Triggers), so this tier works while the app is
// open: a banner from the evening on when today's activity would break the
// streak, plus one real Notification if permission was granted. Closed-app
// push arrives with the backend phase.

import { dayGap, todayStr } from './streak';

const FIRED_KEY = 'codesprout-notified-day';
const RISK_HOUR = 18; // evening — late enough to matter, early enough to act

/** True when an active streak dies tonight without a session/lesson. */
export function streakAtRisk(game, now = new Date()) {
  const { lastActiveDay, current } = game.streak;
  if (!lastActiveDay || current === 0) return false;
  const today = todayStr(now);
  if (lastActiveDay === today) return false; // already safe
  if (dayGap(lastActiveDay, today) !== 1) return false; // already broken
  return now.getHours() >= RISK_HOUR;
}

/** Permission may only be requested from a user gesture (bell click). */
export function canAskPermission() {
  return (
    typeof Notification !== 'undefined' &&
    Notification.permission === 'default'
  );
}

export function notificationsEnabled() {
  return (
    typeof Notification !== 'undefined' &&
    Notification.permission === 'granted'
  );
}

/** Fire the at-risk notification, at most once per day. */
export function fireStreakNotification(game, now = new Date()) {
  if (!notificationsEnabled()) return;
  const today = todayStr(now);
  try {
    if (localStorage.getItem(FIRED_KEY) === today) return;
    localStorage.setItem(FIRED_KEY, today);
    new Notification('Your streak ends tonight 🔥', {
      body: `${game.streak.current} days strong. One focus session keeps it alive.`,
      icon: '/favicon.svg',
    });
  } catch {
    /* notifications must never break the app */
  }
}
