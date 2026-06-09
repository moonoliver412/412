import { useEffect, useRef, useState } from 'react';
import { STAGES_PER_TOPIC, findTopic } from '../data/curriculum';
import { useProgress, visualStage } from '../state/useProgress';
import Tree from './Tree';
import './TreeInspector.css';

// Modal "magnifying glass" view of a single topic's tree: a large live render
// of the tree plus its vital stats, and a "Replay growth" button that runs a
// ~4s time-lapse of the tree growing from seed to its full form.

const REPLAY_MS = 4000;

/** Same FNV-1a hash the Playground uses, so the big tree matches its plot twin. */
function hashId(str) {
  let h = 2166136261;
  for (let c = 0; c < str.length; c++) {
    h ^= str.charCodeAt(c);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function capitalize(s) {
  return s ? s.charAt(0).toUpperCase() + s.slice(1) : s;
}

export default function TreeInspector({ topicId, onClose }) {
  const { session, getTopicProgress, getSessionElapsed, getTreeKind } =
    useProgress();
  const dialogRef = useRef(null);
  const replayRafRef = useRef(0);
  const [replayStage, setReplayStage] = useState(null); // null = show live stage
  const [, setTick] = useState(0); // re-render driver while a session grows this tree

  // Focus the dialog on open; restore focus to the opener on close.
  useEffect(() => {
    const previouslyFocused = document.activeElement;
    dialogRef.current?.focus();
    return () => {
      if (previouslyFocused && typeof previouslyFocused.focus === 'function') {
        previouslyFocused.focus();
      }
    };
  }, []);

  // Escape must close even when focus has left the dialog (e.g. the replay
  // button disables itself mid-animation and drops focus to <body>).
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  // Cancel any in-flight replay animation on unmount/close.
  useEffect(() => () => cancelAnimationFrame(replayRafRef.current), []);

  // Live ~1s tick while the active session is growing THIS tree, so the big
  // render keeps pace with the plot. Elapsed is derived at render time.
  const sessionLive =
    !!session && session.running && session.topicId === topicId;
  useEffect(() => {
    if (!sessionLive) return undefined;
    const id = setInterval(() => setTick((t) => t + 1), 1000);
    return () => clearInterval(id);
  }, [sessionLive]);

  const entry = findTopic(topicId);
  if (!entry) return null;

  const topicProgress = getTopicProgress(topicId);
  const kind = getTreeKind(topicId);
  const liveStage = visualStage(
    topicProgress,
    session,
    topicId,
    getSessionElapsed()
  );
  const stage = replayStage ?? liveStage;
  const mastered = topicProgress.lockedStage >= STAGES_PER_TOPIC;
  const replaying = replayStage !== null;

  const startReplay = () => {
    cancelAnimationFrame(replayRafRef.current);
    const startTime = performance.now();
    const frame = (now) => {
      const t = Math.min((now - startTime) / REPLAY_MS, 1);
      const eased = 1 - Math.pow(1 - t, 3); // ease-out cubic
      if (t < 1) {
        setReplayStage(eased * STAGES_PER_TOPIC);
        replayRafRef.current = requestAnimationFrame(frame);
      } else {
        setReplayStage(null); // done — return to the live stage display
      }
    };
    replayRafRef.current = requestAnimationFrame(frame);
  };

  return (
    <div
      className="ti-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="cs-panel ti-dialog"
        role="dialog"
        aria-modal="true"
        aria-label={`${entry.topic.name} tree inspector`}
        tabIndex={-1}
        ref={dialogRef}
        onKeyDown={(e) => {
          if (e.key === 'Escape') onClose();
        }}
      >
        <div className="ti-head">
          <h2 className="cs-panel-title ti-title">{entry.topic.name}</h2>
          <button
            type="button"
            className="ti-close"
            aria-label="Close inspector"
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        <div className="ti-stage">
          <Tree
            stage={stage}
            wilted={topicProgress.wilted}
            kind={kind}
            size={320}
            seed={hashId(entry.topic.id)}
          />
        </div>

        <dl className="ti-stats">
          <div className="ti-stat">
            <dt>Species</dt>
            <dd>{capitalize(kind)}</dd>
          </div>
          <div className="ti-stat">
            <dt>Growth stage</dt>
            <dd>
              {Math.floor(stage)}/{STAGES_PER_TOPIC}
            </dd>
          </div>
          <div className="ti-stat">
            <dt>Lessons</dt>
            <dd>
              {topicProgress.lockedStage}/{STAGES_PER_TOPIC}
            </dd>
          </div>
          <div className="ti-stat">
            <dt>Focus minutes</dt>
            <dd>{topicProgress.focusMinutes}</dd>
          </div>
          <div className="ti-stat">
            <dt>Status</dt>
            <dd>
              {mastered ? (
                <span className="ti-mastered-pill">MASTERED</span>
              ) : topicProgress.wilted ? (
                'Wilted'
              ) : (
                'Growing'
              )}
            </dd>
          </div>
          <div className="ti-stat">
            <dt>Language</dt>
            <dd>{entry.language.name}</dd>
          </div>
        </dl>

        <button
          type="button"
          className="cs-pill-btn cs-pill-btn--orange ti-replay-btn"
          onClick={startReplay}
          disabled={replaying}
        >
          {replaying ? 'Replaying…' : 'Replay growth'}
        </button>
      </div>
    </div>
  );
}
