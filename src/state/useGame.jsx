import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { ACHIEVEMENTS } from '../data/achievements';

// ---------------------------------------------------------------------------
// Game state — economy, streak, daily goal, achievements, focus history.
//
// game = {
//   sprouts: n            // spendable currency (species unlocks, freezes)
//   xp: n                 // never spendable; forest rank
//   streak: { lastActiveDay: 'YYYY-MM-DD'|null, current, longest, freezes }
//   goal: { target: 1|2|4, date: 'YYYY-MM-DD'|null, done }
//   achievements: { [id]: unlockedAtMs }
//   owned: { species: [names…] }   // beyond each language's free default
//   history: [{ at, topicId, minutes, outcome: 'finished'|'abandoned' }]
// }
//
// ProgressProvider (which must sit INSIDE GameProvider) reports events via
// recordEvent(event, progressSnapshot):
//   { type: 'lesson', topicId }
//   { type: 'topicMastered', topicId }
//   { type: 'sessionFinished', topicId, minutes }
//   { type: 'sessionAbandoned', topicId, minutes }
// Rewards: lesson +10🌱 +20xp · sessionFinished +5🌱 +minutes xp ·
// topicMastered +25🌱 +50xp. A day counts toward the streak when a lesson
// completes or a session finishes. One streak freeze auto-covers a single
// missed day (Duolingo's streak-freeze pattern; see docs/MASTERPLAN.md).
// ---------------------------------------------------------------------------

const GAME_KEY = 'codesprout-game-v1';
const HISTORY_CAP = 400;

const REWARDS = {
  lesson: { sprouts: 10, xp: 20 },
  topicMastered: { sprouts: 25, xp: 50 },
  sessionFinished: { sprouts: 5, xp: null }, // xp = session minutes
  challenge: { sprouts: 15, xp: 30 },
  water: { sprouts: 5, xp: 10 },
};

function todayStr(now = new Date()) {
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${now.getFullYear()}-${m}-${d}`;
}

function dayGap(fromDay, toDay) {
  return Math.round((Date.parse(toDay) - Date.parse(fromDay)) / 86_400_000);
}

function emptyGame() {
  return {
    sprouts: 0,
    xp: 0,
    streak: { lastActiveDay: null, current: 0, longest: 0, freezes: 1 },
    goal: { target: 1, date: null, done: 0 },
    achievements: {},
    owned: { species: [] },
    completedChallenges: [],
    history: [],
  };
}

function loadGame() {
  try {
    const stored = JSON.parse(localStorage.getItem(GAME_KEY));
    if (!stored) return emptyGame();
    // Shallow-merge over defaults so new fields survive old saves.
    const base = emptyGame();
    return {
      ...base,
      ...stored,
      streak: { ...base.streak, ...stored.streak },
      goal: { ...base.goal, ...stored.goal },
      owned: { ...base.owned, ...stored.owned },
    };
  } catch {
    return emptyGame();
  }
}

/** Streak advance for an activity on `today`. A 2-day gap auto-spends one
 *  freeze (covers exactly one missed day); bigger gaps reset to 1. */
function advanceStreak(streak, today) {
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

const GameContext = createContext(null);

export function GameProvider({ children }) {
  const [game, setGame] = useState(loadGame);
  const [toasts, setToasts] = useState([]);

  // Events can arrive back-to-back in one tick (lesson + topicMastered), so
  // state math runs against this synchronously-updated ref, never against a
  // possibly-stale render value (and never inside a setState updater, which
  // StrictMode double-invokes).
  const gameRef = useRef(game);

  const commit = useCallback((next) => {
    gameRef.current = next;
    setGame(next);
  }, []);

  useEffect(() => {
    localStorage.setItem(GAME_KEY, JSON.stringify(game));
  }, [game]);

  const recordEvent = useCallback(
    (event, progressSnapshot = {}) => {
      const prev = gameRef.current;
      const today = todayStr();
      const next = { ...prev };

      if (
        event.type === 'sessionFinished' ||
        event.type === 'sessionAbandoned'
      ) {
        next.history = [
          ...prev.history,
          {
            at: Date.now(),
            topicId: event.topicId,
            minutes: event.minutes ?? 0,
            outcome:
              event.type === 'sessionFinished' ? 'finished' : 'abandoned',
          },
        ].slice(-HISTORY_CAP);
      }

      let goal =
        prev.goal.date === today ? prev.goal : { ...prev.goal, date: today, done: 0 };
      if (event.type === 'sessionFinished') goal = { ...goal, done: goal.done + 1 };
      next.goal = goal;

      const reward = REWARDS[event.type];
      if (reward) {
        next.sprouts = prev.sprouts + reward.sprouts;
        next.xp = prev.xp + (reward.xp ?? event.minutes ?? 0);
        next.streak = advanceStreak(prev.streak, today);
      }

      const ctx = { game: next, progress: progressSnapshot, event, now: new Date() };
      const unlocked = [];
      const achievements = { ...prev.achievements };
      for (const def of ACHIEVEMENTS) {
        if (!achievements[def.id] && def.test(ctx)) {
          achievements[def.id] = Date.now();
          unlocked.push(def);
        }
      }
      next.achievements = achievements;

      commit(next);
      if (unlocked.length) {
        setToasts((cur) => [
          ...cur,
          ...unlocked.map((def) => ({ ...def, key: `${def.id}-${Date.now()}` })),
        ]);
      }
    },
    [commit]
  );

  /** Spend sprouts; false (and no change) when balance is short. */
  const spendSprouts = useCallback(
    (amount) => {
      const prev = gameRef.current;
      if (prev.sprouts < amount) return false;
      commit({ ...prev, sprouts: prev.sprouts - amount });
      return true;
    },
    [commit]
  );

  /** Buy a species for the forest (idempotent; false = can't afford). */
  const unlockSpecies = useCallback(
    (species, price) => {
      const prev = gameRef.current;
      if (prev.owned.species.includes(species)) return true;
      if (prev.sprouts < price) return false;
      commit({
        ...prev,
        sprouts: prev.sprouts - price,
        owned: { ...prev.owned, species: [...prev.owned.species, species] },
      });
      return true;
    },
    [commit]
  );

  /** First-time challenge completion: records the id and pays the reward.
   *  Returns false (no double rewards) when already completed. */
  const completeChallenge = useCallback(
    (challengeId, progressSnapshot = {}) => {
      const prev = gameRef.current;
      if (prev.completedChallenges.includes(challengeId)) return false;
      commit({
        ...prev,
        completedChallenges: [...prev.completedChallenges, challengeId],
      });
      recordEvent({ type: 'challenge', challengeId }, progressSnapshot);
      return true;
    },
    [commit, recordEvent]
  );

  const setGoalTarget = useCallback(
    (target) => {
      const prev = gameRef.current;
      commit({ ...prev, goal: { ...prev.goal, target } });
    },
    [commit]
  );

  const dismissToast = useCallback((key) => {
    setToasts((cur) => cur.filter((t) => t.key !== key));
  }, []);

  const resetGame = useCallback(() => {
    commit(emptyGame());
    setToasts([]);
  }, [commit]);

  const value = useMemo(
    () => ({
      game,
      toasts,
      recordEvent,
      spendSprouts,
      unlockSpecies,
      completeChallenge,
      setGoalTarget,
      dismissToast,
      resetGame,
    }),
    [
      game,
      toasts,
      recordEvent,
      spendSprouts,
      unlockSpecies,
      completeChallenge,
      setGoalTarget,
      dismissToast,
      resetGame,
    ]
  );

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components -- hook lives with its provider by design
export function useGame() {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error('useGame must be used inside <GameProvider>');
  return ctx;
}
