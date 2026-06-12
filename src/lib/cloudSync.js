// Cloud sync — local-first. localStorage stays the source of truth; the
// cloud holds a backup keyed by an anonymous Supabase user that can later
// claim a real account (same uid, saves carry over).
//
// Teen privacy (13–18): anonymous play sends no personal information. The
// age screen runs BEFORE any account claim; under-13 is refused (COPPA),
// and the only personal field ever collected is an email at claim time.

import { cloudEnabled, supabase } from './supabase';
import { exportBundle, importBundle } from './saveFile';

export { cloudEnabled };

/** Neutral age screen result → can this person claim an account? */
export function ageAllowsAccount(birthYear, now = new Date()) {
  const age = now.getFullYear() - birthYear;
  return Number.isInteger(birthYear) && age >= 13 && age <= 120;
}

/** Ensure we have a (possibly anonymous) session; returns the user id. */
export async function ensureSignedIn() {
  if (!cloudEnabled) throw new Error('Cloud sync is not configured');
  const { data: existing } = await supabase.auth.getSession();
  if (existing.session) return existing.session.user.id;
  const { data, error } = await supabase.auth.signInAnonymously();
  if (error) throw error;
  return data.user.id;
}

/** Field-monotonic merge of two save bundles (never loses earned things):
 *  max for counters, union for collections, latest for schedules. */
export function mergeSaves(localGame, cloudGame) {
  if (!cloudGame) return localGame;
  if (!localGame) return cloudGame;
  return {
    ...cloudGame,
    ...localGame,
    sprouts: Math.max(localGame.sprouts ?? 0, cloudGame.sprouts ?? 0),
    xp: Math.max(localGame.xp ?? 0, cloudGame.xp ?? 0),
    streak: {
      ...localGame.streak,
      longest: Math.max(
        localGame.streak?.longest ?? 0,
        cloudGame.streak?.longest ?? 0
      ),
    },
    achievements: { ...cloudGame.achievements, ...localGame.achievements },
    completedChallenges: [
      ...new Set([
        ...(cloudGame.completedChallenges ?? []),
        ...(localGame.completedChallenges ?? []),
      ]),
    ],
    owned: {
      species: [
        ...new Set([
          ...(cloudGame.owned?.species ?? []),
          ...(localGame.owned?.species ?? []),
        ]),
      ],
    },
    chests: dedupeById([
      ...(cloudGame.chests ?? []),
      ...(localGame.chests ?? []),
    ]),
  };
}

function dedupeById(items) {
  const seen = new Map();
  for (const item of items) if (!seen.has(item.id)) seen.set(item.id, item);
  return [...seen.values()];
}

/** Push the whole local save to the cloud (upsert own row). */
export async function pushSave() {
  const userId = await ensureSignedIn();
  const bundle = JSON.parse(exportBundle());
  const { error } = await supabase.from('saves').upsert({
    user_id: userId,
    bundle,
    updated_at: new Date().toISOString(),
  });
  if (error) throw error;
}

/** Pull the cloud save and merge it into localStorage (reload after). */
export async function pullAndMerge() {
  const userId = await ensureSignedIn();
  const { data, error } = await supabase
    .from('saves')
    .select('bundle')
    .eq('user_id', userId)
    .maybeSingle();
  if (error) throw error;
  if (!data?.bundle) return false;

  const cloud = data.bundle;
  const localGame = readSlot('codesprout-game-v1');
  const cloudGame = readBundleSlot(cloud, 'codesprout-game-v1');
  const merged = mergeSaves(localGame, cloudGame);

  importBundle(JSON.stringify(cloud)); // progress/settings: cloud wins…
  localStorage.setItem('codesprout-game-v1', JSON.stringify(merged)); // …game: merged
  return true;
}

function readSlot(key) {
  try {
    return JSON.parse(localStorage.getItem(key));
  } catch {
    return null;
  }
}

function readBundleSlot(bundle, key) {
  try {
    return JSON.parse(bundle?.data?.[key] ?? 'null');
  } catch {
    return null;
  }
}

/** Claim the anonymous account with an email (same uid, saves carry over). */
export async function claimAccount(email, birthYear) {
  if (!ageAllowsAccount(birthYear)) {
    throw new Error('CodeSprout accounts need you to be 13 or older.');
  }
  await ensureSignedIn();
  const { error } = await supabase.auth.updateUser({ email });
  if (error) throw error;
  return true;
}
