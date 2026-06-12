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
import { rollChest } from '../data/chests';
import { QUEST_REWARD_SPROUTS, questsFor } from '../data/quests';
import { rankFor } from '../data/ranks';
import { advanceStreak, resolveWager, todayStr } from '../lib/streak';
import { onStorageKey } from '../lib/storageSync';

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
  practice: { sprouts: 3, xp: 8 },
};

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
    quests: { date: null, progress: {}, done: [] },
    wager: null, // { startDay, stake } while a streak wager is live
    stumps: 0, // lost wagers leave permanent stumps in the forest
    chests: [], // earned Growth Chests, opened or not (data/chests.js)
  };
}

export const WAGER_STAKE = 50;
export const WAGER_PAYOUT = 150;

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
      quests: { ...base.quests, ...stored.quests },
    };
  } catch {
    return emptyGame();
  }
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

  // Another tab wrote the game state: adopt it (storage events never fire
  // in the writing tab, so this cannot loop).
  useEffect(() => {
    return onStorageKey(GAME_KEY, () => {
      const next = loadGame();
      gameRef.current = next;
      setGame(next);
    });
  }, []);

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
      let xpGained = 0;
      if (reward) {
        // Completing via a revealed solution pays half — honest economy.
        const scale = event.half ? 0.5 : 1;
        xpGained = Math.round((reward.xp ?? event.minutes ?? 0) * scale);
        next.sprouts = prev.sprouts + Math.round(reward.sprouts * scale);
        next.xp = prev.xp + xpGained;
        next.streak = advanceStreak(prev.streak, today);
      }

      const newToasts = [];
      const awardChest = (reason, boost = 0) => {
        const chest = rollChest(reason, boost);
        next.chests = [...(next.chests ?? []), chest];
        newToasts.push({
          kicker: 'Chest earned',
          icon: '🎁',
          name: `A ${chest.rarity} growth chest`,
          blurb: 'Open it from Home',
        });
      };

      // Daily quests: roll the day, accumulate, pay on the completion edge.
      if (reward) {
        const fresh =
          prev.quests.date === today
            ? { ...prev.quests, progress: { ...prev.quests.progress } }
            : { date: today, progress: {}, done: [] };
        let done = [...(fresh.done ?? [])];
        for (const quest of questsFor(today)) {
          if (done.includes(quest.id)) continue;
          const inc = quest.count(event, { xpGained });
          if (!inc) continue;
          const progressed = (fresh.progress[quest.id] ?? 0) + inc;
          fresh.progress[quest.id] = progressed;
          if (progressed >= quest.target) {
            done.push(quest.id);
            next.sprouts += QUEST_REWARD_SPROUTS;
            newToasts.push({
              kicker: 'Quest complete',
              icon: quest.icon,
              name: quest.blurb,
              blurb: `+${QUEST_REWARD_SPROUTS} sprouts`,
            });
            if (done.length === 3) {
              awardChest('Daily quest sweep');
            }
          }
        }
        next.quests = { ...fresh, done };
      }

      // Earned chest triggers: mastery (rarity-boosted) + every 7th streak day.
      if (event.type === 'topicMastered') awardChest('Topic mastered', 1);
      if (
        reward &&
        next.streak.current > 0 &&
        next.streak.current % 7 === 0 &&
        next.streak.lastActiveDay !== prev.streak.lastActiveDay
      ) {
        awardChest(`${next.streak.current}-day streak`);
      }

      // Streak wager: resolve against the post-advance streak.
      if (next.wager && reward) {
        const verdict = resolveWager(next.wager, next.streak, today);
        if (verdict === 'won') {
          next.sprouts += WAGER_PAYOUT;
          newToasts.push({
            kicker: 'Wager won',
            icon: '🌳',
            name: 'Seven days strong',
            blurb: `Your wager paid out ${WAGER_PAYOUT} sprouts`,
          });
          next.wager = null;
        } else if (verdict === 'lost') {
          next.wager = null;
          next.stumps = (prev.stumps ?? 0) + 1;
          newToasts.push({
            kicker: 'Wager lost',
            icon: '🪵',
            name: 'The wager wilted',
            blurb: 'A stump marks the spot. Plant another when ready.',
          });
        }
      }

      // Rank-up on the xp edge.
      const prevRank = rankFor(prev.xp);
      const newRank = rankFor(next.xp);
      if (newRank !== prevRank) {
        newToasts.push({
          kicker: 'Rank up',
          icon: newRank.icon,
          name: newRank.name,
          blurb: `Your forest rank grew to ${newRank.name}`,
        });
      }

      const ctx = { game: next, progress: progressSnapshot, event, now: new Date() };
      const achievements = { ...prev.achievements };
      for (const def of ACHIEVEMENTS) {
        if (!achievements[def.id] && def.test(ctx)) {
          achievements[def.id] = Date.now();
          newToasts.push(def);
        }
      }
      next.achievements = achievements;

      commit(next);
      if (newToasts.length) {
        setToasts((cur) => [
          ...cur,
          ...newToasts.map((t, i) => ({
            ...t,
            key: `${t.id ?? t.kicker}-${Date.now()}-${i}`,
          })),
        ]);
      }
    },
    [commit]
  );

  /** Open an earned chest: applies its contents, stamps it opened.
   *  Returns the chest (for the reveal ceremony) or null. */
  const openChest = useCallback(
    (chestId) => {
      const prev = gameRef.current;
      const chest = (prev.chests ?? []).find(
        (c) => c.id === chestId && !c.openedAt
      );
      if (!chest) return null;
      commit({
        ...prev,
        sprouts: prev.sprouts + chest.sprouts,
        streak: {
          ...prev.streak,
          freezes: prev.streak.freezes + (chest.freezes ?? 0),
        },
        chests: prev.chests.map((c) =>
          c.id === chestId ? { ...c, openedAt: Date.now() } : c
        ),
      });
      return chest;
    },
    [commit]
  );

  /** Stake sprouts on holding a 7-day streak. False = can't afford/active. */
  const plantWager = useCallback(() => {
    const prev = gameRef.current;
    if (prev.wager || prev.sprouts < WAGER_STAKE) return false;
    commit({
      ...prev,
      sprouts: prev.sprouts - WAGER_STAKE,
      wager: { startDay: todayStr(), stake: WAGER_STAKE },
    });
    return true;
  }, [commit]);

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
      plantWager,
      openChest,
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
      plantWager,
      openChest,
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
