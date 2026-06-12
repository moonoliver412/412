import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { LANGUAGES, STAGES_PER_TOPIC, findTopic } from '../data/curriculum';
import { useGame } from './useGame';

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
const LANGKIND_KEY = 'codesprout-langkinds-v1';
const DEFAULT_DURATION_MIN = 25;

// One species per LANGUAGE: pick oak for HTML and the whole HTML plot is an
// oak forest. Migrates any legacy per-topic choices (first found wins).
function loadLangKinds(progress) {
  try {
    const stored = JSON.parse(localStorage.getItem(LANGKIND_KEY));
    if (stored) return stored;
  } catch {
    /* fall through to migration */
  }
  const migrated = {};
  for (const lang of LANGUAGES) {
    const chosen = lang.topics
      .map((t) => progress[t.id]?.kind)
      .find((k) => k && lang.species.includes(k));
    if (chosen) migrated[lang.id] = chosen;
  }
  return migrated;
}

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
  const [langKinds, setLangKinds] = useState(() => loadLangKinds(loadProgress()));
  const [session, setSession] = useState(null);
  // Economy/streak/achievements live in GameProvider (which wraps us);
  // progress reports learning events upward.
  const { recordEvent } = useGame();

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  }, [progress]);

  useEffect(() => {
    localStorage.setItem(LANGKIND_KEY, JSON.stringify(langKinds));
  }, [langKinds]);

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
    if (session) {
      updateTopic(session.topicId, { wilted: true });
      recordEvent(
        {
          type: 'sessionAbandoned',
          topicId: session.topicId,
          minutes: Math.round(getSessionElapsed() / 60_000),
        },
        progress
      );
    }
    setSession(null);
  }, [session, updateTopic, recordEvent, getSessionElapsed, progress]);

  /** Timer ran to completion: bank the focus minutes, no penalty. */
  const finishSession = useCallback(() => {
    if (session) {
      const prev = progress[session.topicId] ?? emptyTopic();
      const focusMinutes = prev.focusMinutes + session.durationMin;
      updateTopic(session.topicId, { focusMinutes });
      recordEvent(
        {
          type: 'sessionFinished',
          topicId: session.topicId,
          minutes: session.durationMin,
        },
        {
          ...progress,
          [session.topicId]: { ...emptyTopic(), ...prev, focusMinutes },
        }
      );
    }
    setSession(null);
  }, [session, progress, updateTopic, recordEvent]);

  /** Lock in the next growth stage. Clears wilt. */
  const completeLesson = useCallback(
    (topicId) => {
      const prev = progress[topicId] ?? emptyTopic();
      const nextStage = Math.min(prev.lockedStage + 1, STAGES_PER_TOPIC);
      updateTopic(topicId, { lockedStage: nextStage, wilted: false });
      const snapshot = {
        ...progress,
        [topicId]: { ...emptyTopic(), ...prev, lockedStage: nextStage },
      };
      recordEvent({ type: 'lesson', topicId }, snapshot);
      if (nextStage >= STAGES_PER_TOPIC && prev.lockedStage < STAGES_PER_TOPIC) {
        recordEvent({ type: 'topicMastered', topicId }, snapshot);
      }
    },
    [progress, updateTopic, recordEvent]
  );

  /** True once ANY tree of the language has locked growth — species is then fixed. */
  const isLangLocked = useCallback(
    (langId) => {
      const lang = LANGUAGES.find((l) => l.id === langId);
      if (!lang) return true;
      return lang.topics.some((t) => (progress[t.id]?.lockedStage ?? 0) > 0);
    },
    [progress]
  );

  /**
   * Pick the LANGUAGE's forest species from its palette — every topic tree
   * of that language grows as this species (an oak forest, a cherry forest…).
   * Only allowed while no tree of the language has started growing.
   */
  const setTreeKind = useCallback(
    (langId, kind) => {
      const lang = LANGUAGES.find((l) => l.id === langId);
      if (!lang || !lang.species.includes(kind)) return;
      if (isLangLocked(langId)) return;
      setLangKinds((prev) => ({ ...prev, [langId]: kind }));
    },
    [isLangLocked]
  );

  /** Effective species for a topic's tree: its language's chosen forest species. */
  const getTreeKind = useCallback(
    (topicId) => {
      const entry = findTopic(topicId);
      if (!entry) return 'oak';
      return langKinds[entry.language.id] ?? entry.language.species[0];
    },
    [langKinds]
  );

  const resetAll = useCallback(() => {
    setProgress({});
    setLangKinds({});
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
      isLangLocked,
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
      isLangLocked,
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
