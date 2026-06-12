import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProgress } from '../state/useProgress';
import { useGame } from '../state/useGame';
import Tree from './Tree';
import './Onboarding.css';

// First-run welcome (research: a win in session one lifts retention ~64%).
// Three short steps → pick a daily goal → straight into the first lesson.
// Shows once: a localStorage flag marks it seen; learners with existing
// progress never see it.

const SEEN_KEY = 'codesprout-onboarded-v1';

const STEPS = ['welcome', 'how', 'goal'];

export default function Onboarding() {
  const navigate = useNavigate();
  const { progress } = useProgress();
  const { game, setGoalTarget } = useGame();
  const dialogRef = useRef(null);

  const [open, setOpen] = useState(() => {
    if (localStorage.getItem(SEEN_KEY)) return false;
    const hasProgress = Object.values(progress).some(
      (t) => (t?.lockedStage ?? 0) > 0 || (t?.focusMinutes ?? 0) > 0
    );
    if (hasProgress) {
      localStorage.setItem(SEEN_KEY, '1');
      return false;
    }
    return true;
  });
  const [step, setStep] = useState(0);

  const dismiss = useCallback(() => {
    localStorage.setItem(SEEN_KEY, '1');
    setOpen(false);
  }, []);

  useEffect(() => {
    if (open) dialogRef.current?.focus();
  }, [open]);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') dismiss();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, dismiss]);

  if (!open) return null;

  const start = () => {
    localStorage.setItem(SEEN_KEY, '1');
    setOpen(false);
    navigate('/playground?topic=html-structure');
  };

  return (
    <div className="ob-overlay">
      <div
        className="cs-panel ob-dialog"
        role="dialog"
        aria-modal="true"
        aria-label="Welcome to CodeSprout"
        tabIndex={-1}
        ref={dialogRef}
      >
        <button
          type="button"
          className="ob-skip"
          aria-label="Skip the intro"
          onClick={dismiss}
        >
          ✕
        </button>

        <div className="ob-dots" aria-hidden="true">
          {STEPS.map((s, i) => (
            <span
              key={s}
              className={`ob-dot${i === step ? ' is-current' : ''}${
                i < step ? ' is-done' : ''
              }`}
            />
          ))}
        </div>

        {step === 0 && (
          <div className="ob-step" key="welcome">
            <span className="ob-tree ob-enter" style={{ '--i': 0 }}>
              <Tree stage={4.4} wilted={false} kind="oak" size={150} seed={7} />
            </span>
            <h2 className="ob-title ob-enter" style={{ '--i': 1 }}>
              Welcome to CodeSprout
            </h2>
            <p className="ob-text ob-enter" style={{ '--i': 2 }}>
              Every coding topic here is a tree. Your tree grows while you
              focus and learn. Finish the topic and it joins your forest —
              for good.
            </p>
          </div>
        )}

        {step === 1 && (
          <div className="ob-step" key="how">
            <h2 className="ob-title ob-enter" style={{ '--i': 0 }}>
              How it works
            </h2>
            <ul className="ob-list">
              <li className="ob-enter" style={{ '--i': 1 }}>
                <span className="ob-li-icon" aria-hidden="true">
                  ⏱️
                </span>
                <span>
                  <strong>Focus.</strong> Start a timer. Your tree grows live
                  while you work.
                </span>
              </li>
              <li className="ob-enter" style={{ '--i': 2 }}>
                <span className="ob-li-icon" aria-hidden="true">
                  🌱
                </span>
                <span>
                  <strong>Learn.</strong> Pass each lesson&apos;s exercise to
                  lock the growth in. No faking it.
                </span>
              </li>
              <li className="ob-enter" style={{ '--i': 3 }}>
                <span className="ob-li-icon" aria-hidden="true">
                  💧
                </span>
                <span>
                  <strong>Keep it green.</strong> Finished trees get thirsty
                  over time. Water them with a quick review.
                </span>
              </li>
            </ul>
          </div>
        )}

        {step === 2 && (
          <div className="ob-step" key="goal">
            <h2 className="ob-title ob-enter" style={{ '--i': 0 }}>
              Pick your daily goal
            </h2>
            <p className="ob-text ob-enter" style={{ '--i': 1 }}>
              How many focus sessions a day? Start small — you can change it
              any time.
            </p>
            <div
              className="ob-goals ob-enter"
              style={{ '--i': 2 }}
              role="group"
              aria-label="Daily goal"
            >
              {[1, 2, 4].map((n) => (
                <button
                  key={n}
                  type="button"
                  aria-pressed={game.goal.target === n}
                  className={`ob-goal${
                    game.goal.target === n ? ' is-picked' : ''
                  }`}
                  onClick={() => setGoalTarget(n)}
                >
                  <span className="ob-goal-n">{n}</span>
                  <span className="ob-goal-label">
                    {n === 1 ? 'chill' : n === 2 ? 'steady' : 'serious'}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        <footer className="ob-footer">
          {step > 0 ? (
            <button
              type="button"
              className="ob-back"
              onClick={() => setStep(step - 1)}
            >
              ← Back
            </button>
          ) : (
            <span />
          )}
          {step < STEPS.length - 1 ? (
            <button
              type="button"
              className="cs-pill-btn cs-pill-btn--orange ob-next"
              onClick={() => setStep(step + 1)}
            >
              Next →
            </button>
          ) : (
            <button
              type="button"
              className="cs-pill-btn cs-pill-btn--orange ob-next"
              onClick={start}
            >
              Plant my first lesson
            </button>
          )}
        </footer>
      </div>
    </div>
  );
}
