import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { STAGES_PER_TOPIC, findTopic } from '../data/curriculum';

// ---------------------------------------------------------------------------
// Progress state — the contract every feature codes against.
//
// progress[topicId] = {
//   lockedStage: 0..5   // permanent growth stages, +1 per completed lesson
//   wilted: bool        // true after an abandoned session, cleared on next start
//   focusMinutes: n     // lifetime focused minutes on this topic
//   kind: string|null   // user-chosen species (from language.species); null = topic default.
//                       // Choosable only while lockedStage === 0 — species locks at first growth.
// }
//
// session = null | {
//   topicId, startedAt (ms), durationMin, running (bool),
//   pausedElapsed (ms accumulated while paused), speed (dev multiplier)
// }
//
// Visual tree stage during a session:
//   stage = lockedStage + min(elapsed / duration, 1)   (capped at 5)
// Stages only become permanent via completeLesson().
// ---------------------------------------------------------------------------

const STORAGE_KEY = 'codesprout-progress-v1';
const DEFAULT_DURATION_MIN = 25;

const ProgressContext = createContext(null);

function loadProgress() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) ?? {};
  } catch {
    return {};
  }
}

function emptyTopic() {
  return { lockedStage: 0, wilted: false, focusMinutes: 0, kind: null };
}

export function ProgressProvider({ children }) {
  const [progress, setProgress] = useState(loadProgress);
  const [session, setSession] = useState(null);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  }, [progress]);

  const getTopicProgress = useCallback(
    (topicId) => progress[topicId] ?? emptyTopic(),
    [progress]
  );

  const updateTopic = useCallback((topicId, patch) => {
    setProgress((prev) => ({
      ...prev,
      [topicId]: { ...emptyTopic(), ...prev[topicId], ...patch },
    }));
  }, []);

  const startSession = useCallback(
    (topicId, durationMin = DEFAULT_DURATION_MIN) => {
      // Starting a session revives a wilted tree.
      updateTopic(topicId, { wilted: false });
      setSession({
        topicId,
        startedAt: Date.now(),
        durationMin,
        running: true,
        pausedElapsed: 0,
        speed: 1,
      });
    },
    [updateTopic]
  );

  const pauseSession = useCallback(() => {
    setSession((s) => {
      if (!s || !s.running) return s;
      return {
        ...s,
        running: false,
        pausedElapsed: s.pausedElapsed + (Date.now() - s.startedAt) * s.speed,
      };
    });
  }, []);

  const resumeSession = useCallback(() => {
    setSession((s) => {
      if (!s || s.running) return s;
      return { ...s, running: true, startedAt: Date.now() };
    });
  }, []);

  const setSpeed = useCallback((speed) => {
    setSession((s) => {
      if (!s) return s;
      // Re-anchor so already-elapsed time is preserved at the old speed.
      const elapsed = s.running
        ? s.pausedElapsed + (Date.now() - s.startedAt) * s.speed
        : s.pausedElapsed;
      return { ...s, speed, pausedElapsed: elapsed, startedAt: Date.now() };
    });
  }, []);

  /** Effective elapsed ms of the active session (dev speed applied). */
  const getSessionElapsed = useCallback(() => {
    if (!session) return 0;
    return session.running
      ? session.pausedElapsed + (Date.now() - session.startedAt) * session.speed
      : session.pausedElapsed;
  }, [session]);

  /** Soft penalty: session growth is lost and the tree wilts. */
  const abandonSession = useCallback(() => {
    setSession((s) => {
      if (s) updateTopic(s.topicId, { wilted: true });
      return null;
    });
  }, [updateTopic]);

  /** Timer ran to completion: bank the focus minutes, no penalty. */
  const finishSession = useCallback(() => {
    setSession((s) => {
      if (s) {
        const prev = progress[s.topicId] ?? emptyTopic();
        updateTopic(s.topicId, {
          focusMinutes: prev.focusMinutes + s.durationMin,
        });
      }
      return null;
    });
  }, [progress, updateTopic]);

  /** Lock in the next growth stage. Clears wilt. */
  const completeLesson = useCallback(
    (topicId) => {
      const prev = progress[topicId] ?? emptyTopic();
      updateTopic(topicId, {
        lockedStage: Math.min(prev.lockedStage + 1, STAGES_PER_TOPIC),
        wilted: false,
      });
    },
    [progress, updateTopic]
  );

  /**
   * Pick the topic's tree species from its language palette.
   * Only allowed while nothing is locked in yet (lockedStage === 0) —
   * once the tree starts growing, the species is fixed.
   */
  const setTreeKind = useCallback(
    (topicId, kind) => {
      const entry = findTopic(topicId);
      const prev = progress[topicId] ?? emptyTopic();
      if (!entry || prev.lockedStage > 0) return;
      if (!entry.language.species.includes(kind)) return;
      updateTopic(topicId, { kind });
    },
    [progress, updateTopic]
  );

  /** Effective species for a topic's tree: user choice, else topic default. */
  const getTreeKind = useCallback(
    (topicId) => {
      const chosen = progress[topicId]?.kind;
      if (chosen) return chosen;
      return findTopic(topicId)?.topic.treeKind ?? 'oak';
    },
    [progress]
  );

  const resetAll = useCallback(() => {
    setProgress({});
    setSession(null);
  }, []);

  const value = useMemo(
    () => ({
      progress,
      session,
      getTopicProgress,
      getSessionElapsed,
      startSession,
      pauseSession,
      resumeSession,
      setSpeed,
      abandonSession,
      finishSession,
      completeLesson,
      setTreeKind,
      getTreeKind,
      resetAll,
    }),
    [
      progress,
      session,
      getTopicProgress,
      getSessionElapsed,
      startSession,
      pauseSession,
      resumeSession,
      setSpeed,
      abandonSession,
      finishSession,
      completeLesson,
      setTreeKind,
      getTreeKind,
      resetAll,
    ]
  );

  return (
    <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components -- hook lives with its provider by design
export function useProgress() {
  const ctx = useContext(ProgressContext);
  if (!ctx) throw new Error('useProgress must be used inside <ProgressProvider>');
  return ctx;
}

/**
 * Visual stage (float 0–5) for a topic's tree right now:
 * locked stages plus partial in-session growth toward the next stage.
 */
// eslint-disable-next-line react-refresh/only-export-components -- pure helper colocated with the state contract
export function visualStage(topicProgress, session, topicId, elapsedMs) {
  const locked = topicProgress.lockedStage;
  if (!session || session.topicId !== topicId) return locked;
  const fraction = Math.min(elapsedMs / (session.durationMin * 60_000), 1);
  return Math.min(locked + fraction, STAGES_PER_TOPIC);
}
