import { useEffect, useMemo, useRef, useState } from 'react';
import { useProgress } from '../state/useProgress';
import { allPass, checkExercise } from '../lib/checkExercise';
import './LessonPanel.css';

// Modal lesson experience: teaching blocks on the left, a live HTML lab on
// the right (editor → sandboxed preview → auto-graded checks). Completing a
// lesson locks in the next growth stage and is only allowed while a focus
// session is running for this topic — same rule as LessonList.

const DEBOUNCE_MS = 350;

export default function LessonPanel({ topicId, lesson, title, onClose }) {
  const { session, completeLesson } = useProgress();
  const dialogRef = useRef(null);

  const exercise = lesson?.exercise ?? {};
  const starter = exercise.starter ?? '';
  const checks = exercise.checks;

  const [code, setCode] = useState(starter);
  const [debouncedCode, setDebouncedCode] = useState(starter);

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

  // Escape must close even when focus has wandered out of the dialog, so the
  // listener lives on the document (TreeInspector pattern).
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  // Debounce keystrokes → preview srcDoc + check run. State only changes from
  // the timeout callback, never the effect body.
  useEffect(() => {
    const id = setTimeout(() => setDebouncedCode(code), DEBOUNCE_MS);
    return () => clearTimeout(id);
  }, [code]);

  const results = useMemo(
    () => checkExercise(debouncedCode, checks ?? []),
    [debouncedCode, checks]
  );
  const ready = allPass(results);
  const runningHere =
    !!session && session.running && session.topicId === topicId;
  const canComplete = ready && runningHere;

  const reasons = [];
  if (!ready) reasons.push('Make all checks pass');
  if (!runningHere)
    reasons.push('Start a focus session for this topic to complete');
  const note = reasons.length
    ? reasons.join(' · ')
    : 'All checks pass — focus session running. Lock it in!';

  const heading = title ?? lesson?.name ?? 'Lesson';

  const handleComplete = () => {
    completeLesson(topicId);
    onClose();
  };

  return (
    <div
      className="lp-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="cs-panel lp-dialog"
        role="dialog"
        aria-modal="true"
        aria-label={`${heading} lesson`}
        tabIndex={-1}
        ref={dialogRef}
      >
        <div className="lp-head">
          <h2 className="cs-panel-title lp-title">{heading}</h2>
          <button
            type="button"
            className="lp-close"
            aria-label="Close lesson"
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        <div className="lp-columns">
          <div className="lp-content">
            {(lesson?.blocks ?? []).map((block, i) => {
              if (block.type === 'code') {
                return (
                  <pre key={i} className="lp-code">
                    <code>{block.text}</code>
                  </pre>
                );
              }
              if (block.type === 'tip') {
                return (
                  <p key={i} className="lp-tip">
                    <span className="lp-tip-bulb" aria-hidden="true">
                      💡
                    </span>
                    <span>{block.text}</span>
                  </p>
                );
              }
              return (
                <p key={i} className="lp-p">
                  {block.text}
                </p>
              );
            })}

            <div className="lp-instructions">
              <h3 className="lp-instructions-title">Your turn</h3>
              <p>{exercise.instructions}</p>
            </div>
          </div>

          <div className="lp-lab">
            <div className="lp-lab-head">
              <h3 className="lp-lab-title">Code lab</h3>
              <button
                type="button"
                className="lp-reset"
                onClick={() => {
                  setCode(starter);
                  setDebouncedCode(starter);
                }}
              >
                Reset code
              </button>
            </div>
            <textarea
              className="lp-editor"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              spellCheck={false}
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              aria-label="Exercise code editor"
            />
            <iframe
              className="lp-preview"
              sandbox=""
              title="preview"
              srcDoc={debouncedCode}
            />
            <ul className="lp-checks">
              {results.map((r, i) => (
                <li key={i} className={`lp-check${r.pass ? ' is-pass' : ''}`}>
                  <span
                    className="lp-check-mark"
                    aria-label={r.pass ? 'Passed' : 'Not passed yet'}
                  >
                    {r.pass ? '✓' : '✗'}
                  </span>
                  <span className="lp-check-label">{r.label}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <footer className="lp-footer">
          <p
            className={`lp-footer-note${canComplete ? ' is-ready' : ''}`}
            role="status"
          >
            {note}
          </p>
          <button
            type="button"
            className="cs-pill-btn cs-pill-btn--orange lp-complete-btn"
            disabled={!canComplete}
            onClick={handleComplete}
          >
            Complete lesson
          </button>
        </footer>
      </div>
    </div>
  );
}
