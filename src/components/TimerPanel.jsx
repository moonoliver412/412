import { useEffect, useRef, useState } from 'react';
import { useProgress } from '../state/useProgress';
import { findTopic } from '../data/curriculum';
import './TimerPanel.css';

const DURATIONS = [10, 25, 50];
const RING_RADIUS = 52;
const RING_CIRC = 2 * Math.PI * RING_RADIUS;

function formatMs(ms) {
  const totalSec = Math.max(0, Math.ceil(ms / 1000));
  const m = Math.floor(totalSec / 60);
  const s = totalSec % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

/**
 * Pomodoro panel for the currently selected topic.
 * If a session exists for ANOTHER topic, it is shown here too (and starting
 * a second session is blocked) — there is only ever one session at a time.
 */
export default function TimerPanel({ topicId }) {
  const {
    session,
    getSessionElapsed,
    startSession,
    pauseSession,
    resumeSession,
    setSpeed,
    abandonSession,
    finishSession,
  } = useProgress();

  const [pickedDuration, setPickedDuration] = useState(25);
  const [confirmingAbandon, setConfirmingAbandon] = useState(false);
  const [justCompleted, setJustCompleted] = useState(false);
  const [, setTick] = useState(0); // re-render driver while the timer runs
  const finishedRef = useRef(false);

  // Elapsed is derived, not mirrored into state — the interval below just
  // forces re-renders (and handles natural completion in its callback).
  const elapsed = session ? getSessionElapsed() : 0;

  useEffect(() => {
    if (!session || !session.running) return undefined;
    finishedRef.current = false;

    const durationMs = session.durationMin * 60_000;
    const id = setInterval(() => {
      setTick((t) => t + 1);
      if (getSessionElapsed() >= durationMs && !finishedRef.current) {
        finishedRef.current = true;
        finishSession(); // timer ran out: bank the minutes, no penalty
        setJustCompleted(true);
        setConfirmingAbandon(false);
      }
    }, 250);
    return () => clearInterval(id);
  }, [session, getSessionElapsed, finishSession]);

  // --- No session: completion banner or the start form -----------------
  if (!session) {
    if (justCompleted) {
      return (
        <section className="cs-panel timer-panel timer-panel--done">
          <h2 className="cs-panel-title timer-title">Session complete!</h2>
          <p className="timer-done-note">
            Great focus. Finish a lesson next session to grow your tree.
          </p>
          <button
            type="button"
            className="cs-pill-btn cs-pill-btn--orange timer-btn"
            onClick={() => setJustCompleted(false)}
          >
            Nice!
          </button>
        </section>
      );
    }

    return (
      <section className="cs-panel timer-panel">
        <h2 className="cs-panel-title timer-title">Focus session</h2>
        <div className="timer-durations" role="group" aria-label="Session length">
          {DURATIONS.map((min) => (
            <button
              key={min}
              type="button"
              className={`timer-duration-pill${
                pickedDuration === min ? ' is-active' : ''
              }`}
              onClick={() => setPickedDuration(min)}
            >
              {min} min
            </button>
          ))}
        </div>
        <button
          type="button"
          className="cs-pill-btn cs-pill-btn--orange timer-btn"
          onClick={() => {
            setConfirmingAbandon(false);
            startSession(topicId, pickedDuration);
          }}
        >
          Start session
        </button>
      </section>
    );
  }

  // --- Active session -----------------------------------------------------
  const durationMs = session.durationMin * 60_000;
  const remaining = Math.max(0, durationMs - elapsed);
  const fraction = Math.min(elapsed / durationMs, 1);
  const isOtherTopic = session.topicId !== topicId;
  const sessionTopic = findTopic(session.topicId);
  const sessionLabel = sessionTopic
    ? `${sessionTopic.language.name} — ${sessionTopic.topic.name}`
    : session.topicId;

  return (
    <section className="cs-panel timer-panel">
      <h2 className="cs-panel-title timer-title">
        {session.running ? 'Focusing' : 'Paused'}
      </h2>
      <p className={`timer-topic${isOtherTopic ? ' timer-topic--other' : ''}`}>
        {isOtherTopic ? `Session belongs to ${sessionLabel}` : sessionLabel}
      </p>

      <div className="timer-ring-wrap">
        <svg
          className="timer-ring"
          viewBox="0 0 120 120"
          width="150"
          height="150"
          role="img"
          aria-label={`${formatMs(remaining)} remaining`}
        >
          <circle className="timer-ring-track" cx="60" cy="60" r={RING_RADIUS} />
          <circle
            className="timer-ring-progress"
            cx="60"
            cy="60"
            r={RING_RADIUS}
            strokeDasharray={RING_CIRC}
            strokeDashoffset={RING_CIRC * (1 - fraction)}
          />
        </svg>
        <span className="timer-time">{formatMs(remaining)}</span>
      </div>

      {confirmingAbandon ? (
        <div className="timer-confirm">
          <p className="timer-confirm-text">
            Abandon? Session growth is lost and the tree wilts.
          </p>
          <div className="timer-actions">
            <button
              type="button"
              className="cs-pill-btn cs-pill-btn--orange timer-btn"
              onClick={() => {
                abandonSession();
                setConfirmingAbandon(false);
              }}
            >
              Yes, abandon
            </button>
            <button
              type="button"
              className="cs-pill-btn timer-btn"
              onClick={() => setConfirmingAbandon(false)}
            >
              Keep going
            </button>
          </div>
        </div>
      ) : (
        <div className="timer-actions">
          {session.running ? (
            <button
              type="button"
              className="cs-pill-btn timer-btn"
              onClick={pauseSession}
            >
              Pause
            </button>
          ) : (
            <button
              type="button"
              className="cs-pill-btn cs-pill-btn--orange timer-btn"
              onClick={resumeSession}
            >
              Resume
            </button>
          )}
          <button
            type="button"
            className="cs-pill-btn timer-btn timer-btn--danger"
            onClick={() => setConfirmingAbandon(true)}
          >
            Abandon
          </button>
        </div>
      )}

      {/* Dev-only growth fast-forward — intentionally unobtrusive */}
      <button
        type="button"
        className="timer-speed"
        title="Dev: time multiplier"
        onClick={() => setSpeed(session.speed === 1 ? 60 : 1)}
      >
        {session.speed === 1 ? '1×' : '60×'}
      </button>
    </section>
  );
}
