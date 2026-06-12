import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useProgress } from '../state/useProgress';
import { STAGES_PER_TOPIC } from '../data/curriculum';
import { allPass, checkExercise } from '../lib/checkExercise';
import { buildJsRunDoc, labelJsResults } from '../lib/jsRunner';
import './LessonPanel.css';

// Stepped lesson experience (choreography per .claude/skills/motion-graphics):
// teaching beats reveal one at a time behind a progress rail, the final step
// is the live code lab, and completing plays the growth-locked ceremony.
// Completion still requires every check passing AND a running focus session
// for this topic — same gate as LessonList.

const DEBOUNCE_MS = 350;

/** Deterministic per-code nonce: stale iframe messages carry an old hash. */
function codeNonce(str) {
  let h = 5381;
  for (let i = 0; i < str.length; i++) h = (h * 33) ^ str.charCodeAt(i);
  return `run-${h >>> 0}-${str.length}`;
}

// A teaching "beat" collects paragraphs and closes on a code or tip block,
// so every step lands on something concrete to look at.
function chunkBlocks(blocks) {
  const steps = [];
  let current = [];
  for (const block of blocks ?? []) {
    current.push(block);
    if (block.type === 'code' || block.type === 'tip') {
      steps.push(current);
      current = [];
    }
  }
  if (current.length) steps.push(current);
  return steps;
}

function Block({ block, index }) {
  const style = { '--i': index };
  if (block.type === 'code') {
    return (
      <pre className="lp-code lp-enter" style={style}>
        <code>{block.text}</code>
      </pre>
    );
  }
  if (block.type === 'tip') {
    return (
      <p className="lp-tip lp-enter" style={style}>
        <span className="lp-tip-bulb" aria-hidden="true">
          💡
        </span>
        <span>{block.text}</span>
      </p>
    );
  }
  return (
    <p className="lp-p lp-enter" style={style}>
      {block.text}
    </p>
  );
}

// T3 macro celebration: the stage that just locked (or a watering refresh),
// as pips + leaf burst.
function Ceremony({ stage, kind, water, onClose }) {
  const mastered = stage >= STAGES_PER_TOPIC;
  return (
    <div className="lp-ceremony" role="status">
      <div className="lp-burst" aria-hidden="true">
        {Array.from({ length: 14 }, (_, i) => (
          <span key={i} className="lp-leaf" style={{ '--n': i }} />
        ))}
      </div>
      <div className="lp-pips lp-enter" style={{ '--i': 0 }} aria-hidden="true">
        {Array.from({ length: STAGES_PER_TOPIC }, (_, i) => (
          <span
            key={i}
            className={`lp-pip${i < stage ? ' is-lit' : ''}${
              i === stage - 1 && !water ? ' is-new' : ''
            }`}
          />
        ))}
      </div>
      <p className="lp-ceremony-kicker lp-enter" style={{ '--i': 1 }}>
        {water ? 'Tree watered' : 'Growth locked'}
      </p>
      <h3 className="lp-ceremony-title lp-enter" style={{ '--i': 2 }}>
        {water ? 'Refreshed' : `Stage ${stage} of ${STAGES_PER_TOPIC}`}
      </h3>
      <p className="lp-ceremony-sub lp-enter" style={{ '--i': 3 }}>
        {water
          ? `Your ${kind} is watered — the knowledge stays fresh.`
          : mastered
            ? `Topic mastered — your ${kind} stands fully grown.`
            : `Your ${kind} just grew taller.`}
      </p>
      <button
        type="button"
        className="cs-pill-btn cs-pill-btn--orange lp-ceremony-btn lp-enter"
        style={{ '--i': 4 }}
        onClick={onClose}
      >
        Back to the grove
      </button>
    </div>
  );
}

export default function LessonPanel({
  topicId,
  lesson,
  title,
  onClose,
  mode = 'learn',
  onWatered,
}) {
  const { session, completeLesson, getTopicProgress, getTreeKind } =
    useProgress();
  // Review mode ("water the tree"): no focus-session gate, no stage lock —
  // passing the exercise refreshes a thirsty mastered topic via onWatered.
  const isReview = mode === 'review';
  const dialogRef = useRef(null);

  const exercise = lesson?.exercise ?? {};
  const starter = exercise.starter ?? '';
  const checks = exercise.checks;

  const teachSteps = useMemo(() => chunkBlocks(lesson?.blocks), [lesson]);
  const labIndex = teachSteps.length;
  const totalSteps = labIndex + 1;

  const [step, setStep] = useState(0);
  const [dir, setDir] = useState('fwd');
  const [code, setCode] = useState(starter);
  const [debouncedCode, setDebouncedCode] = useState(starter);
  const [ceremony, setCeremony] = useState(null);

  const goTo = useCallback(
    (next) => {
      setDir(next > step ? 'fwd' : 'back');
      setStep(Math.max(0, Math.min(next, labIndex)));
    },
    [step, labIndex]
  );

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

  // Escape closes from anywhere (TreeInspector pattern); Enter / arrow keys
  // page through steps unless focus is on a control that uses them.
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') {
        onClose();
        return;
      }
      if (ceremony) return;
      if (e.target.closest?.('button, textarea, input, select, a')) return;
      if ((e.key === 'Enter' || e.key === 'ArrowRight') && step < labIndex) {
        goTo(step + 1);
      } else if (e.key === 'ArrowLeft' && step > 0) {
        goTo(step - 1);
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose, ceremony, step, labIndex, goTo]);

  // Debounce keystrokes → preview srcDoc + check run. State only changes from
  // the timeout callback, never the effect body.
  useEffect(() => {
    const id = setTimeout(() => setDebouncedCode(code), DEBOUNCE_MS);
    return () => clearTimeout(id);
  }, [code]);

  // JS exercises (exercise.kind === 'js') run in a sandboxed iframe; the
  // runner posts logs + check results back. HTML/CSS exercises stay on the
  // pure DOM grader.
  const isJs = exercise.kind === 'js';
  const [jsRun, setJsRun] = useState({ logs: [], error: null, results: [] });
  const runNonce = useMemo(() => codeNonce(debouncedCode), [debouncedCode]);
  const previewDoc = useMemo(() => {
    if (!isJs) return debouncedCode;
    return buildJsRunDoc({
      code: debouncedCode,
      html: exercise.html,
      checks,
      nonce: runNonce,
    });
  }, [isJs, debouncedCode, exercise.html, checks, runNonce]);

  useEffect(() => {
    if (!isJs) return undefined;
    const onMessage = (e) => {
      if (e.data?.type === 'cs-js-run' && e.data.nonce === runNonce) {
        setJsRun({
          logs: e.data.logs ?? [],
          error: e.data.error ?? null,
          results: e.data.results ?? [],
        });
      }
    };
    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, [isJs, runNonce]);

  const results = useMemo(
    () =>
      isJs
        ? labelJsResults(checks, jsRun.results)
        : checkExercise(debouncedCode, checks ?? []),
    [isJs, jsRun, debouncedCode, checks]
  );
  const ready = allPass(results);
  const runningHere =
    !!session && session.running && session.topicId === topicId;
  const canComplete = ready && (isReview || runningHere);

  // T3 micro celebration fires only on a check's false→true edge: diff the
  // pass list against the previous run, flag flipped indices briefly.
  const [justPassed, setJustPassed] = useState([]);
  const prevPassesRef = useRef(null);
  useEffect(() => {
    const passes = results.map((r) => r.pass);
    const prev = prevPassesRef.current;
    prevPassesRef.current = passes;
    const flipped = prev
      ? passes.flatMap((p, i) => (p && prev[i] === false ? [i] : []))
      : [];
    if (!flipped.length) {
      setJustPassed((cur) => (cur.length ? [] : cur));
      return undefined;
    }
    setJustPassed(flipped);
    const id = setTimeout(() => setJustPassed([]), 700);
    return () => clearTimeout(id);
  }, [results]);

  const reasons = [];
  if (!ready) reasons.push('Pass every check');
  if (!isReview && !runningHere)
    reasons.push('Start a focus session for this topic first');
  const note = reasons.length
    ? reasons.join(' · ')
    : isReview
      ? 'All checks pass — water the tree!'
      : 'All checks pass — lock it in!';

  const heading = title ?? lesson?.name ?? 'Lesson';
  const onLab = step >= labIndex;

  const handleComplete = () => {
    if (isReview) {
      onWatered?.();
      setCeremony({ stage: STAGES_PER_TOPIC, water: true });
      return;
    }
    const next = Math.min(
      getTopicProgress(topicId).lockedStage + 1,
      STAGES_PER_TOPIC
    );
    completeLesson(topicId);
    setCeremony({ stage: next });
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
          {!ceremony && (
            <span className="lp-step-chip">
              {Math.min(step + 1, totalSteps)} / {totalSteps}
            </span>
          )}
          <button
            type="button"
            className="lp-close"
            aria-label="Close lesson"
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        {!ceremony && (
          <div className="lp-progress" aria-hidden="true">
            {Array.from({ length: totalSteps }, (_, i) => (
              <span
                key={i}
                className={`lp-seg${i < step ? ' is-done' : ''}${
                  i === step ? ' is-current' : ''
                }`}
              />
            ))}
          </div>
        )}

        <div className="lp-body">
          {ceremony ? (
            <Ceremony
              stage={ceremony.stage}
              kind={getTreeKind(topicId)}
              water={ceremony.water}
              onClose={onClose}
            />
          ) : !onLab ? (
            <div className="lp-step" key={`t${step}`} data-dir={dir}>
              {teachSteps[step].map((block, i) => (
                <Block key={i} block={block} index={i} />
              ))}
            </div>
          ) : (
            <div className="lp-step lp-step--lab" key="lab" data-dir={dir}>
              <div className="lp-mission lp-enter" style={{ '--i': 0 }}>
                <h3 className="lp-mission-title">Your turn</h3>
                <p>{exercise.instructions}</p>
              </div>
              <div className="lp-lab-grid lp-enter" style={{ '--i': 1 }}>
                <div className="lp-lab-col">
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
                </div>
                <div className="lp-lab-col">
                  <div className="lp-browser">
                    <div className="lp-browser-bar" aria-hidden="true">
                      <span className="lp-dot" />
                      <span className="lp-dot" />
                      <span className="lp-dot" />
                      <span className="lp-browser-url">live preview</span>
                    </div>
                    <iframe
                      className="lp-preview"
                      sandbox={isJs ? 'allow-scripts' : ''}
                      title="preview"
                      srcDoc={previewDoc}
                    />
                  </div>
                  {isJs && (
                    <div className="lp-console" aria-label="Console output">
                      {jsRun.error && (
                        <p className="lp-console-line lp-console-err">
                          {jsRun.error}
                        </p>
                      )}
                      {jsRun.logs.map((line, i) => (
                        <p key={i} className="lp-console-line">
                          {line}
                        </p>
                      ))}
                      {!jsRun.error && jsRun.logs.length === 0 && (
                        <p className="lp-console-line lp-console-dim">
                          // console.log output appears here
                        </p>
                      )}
                    </div>
                  )}
                  <ul className="lp-checks">
                    {results.map((r, i) => (
                      <li
                        key={i}
                        className={`lp-check${r.pass ? ' is-pass' : ''}${
                          justPassed.includes(i) ? ' is-just-passed' : ''
                        }`}
                      >
                        <span
                          className="lp-check-mark"
                          role="img"
                          aria-label={r.pass ? 'Passed' : 'Not passed yet'}
                        >
                          <svg viewBox="0 0 16 16">
                            <path d="M3.5 8.5l3 3 6-7" />
                          </svg>
                        </span>
                        <span className="lp-check-label">{r.label}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>

        {!ceremony && (
          <footer className="lp-footer">
            <button
              type="button"
              className="lp-back-btn"
              disabled={step === 0}
              onClick={() => goTo(step - 1)}
            >
              ← Back
            </button>
            {!onLab ? (
              <button
                type="button"
                className="cs-pill-btn cs-pill-btn--orange lp-next-btn"
                onClick={() => goTo(step + 1)}
              >
                {step === labIndex - 1 ? 'Your turn' : 'Continue'}{' '}
                <span className="lp-arrow" aria-hidden="true">
                  →
                </span>
              </button>
            ) : (
              <>
                <div className="lp-status">
                  <span
                    className={`lp-live${
                      isReview || runningHere ? ' is-on' : ''
                    }`}
                  >
                    <span className="lp-live-dot" aria-hidden="true" />
                    {isReview
                      ? 'Review — keep it green'
                      : runningHere
                        ? 'Focus session live'
                        : 'No focus session'}
                  </span>
                  <p
                    className={`lp-footer-note${canComplete ? ' is-ready' : ''}`}
                    role="status"
                  >
                    {note}
                  </p>
                </div>
                <button
                  type="button"
                  className={`cs-pill-btn cs-pill-btn--orange lp-complete-btn${
                    canComplete ? ' is-armed' : ''
                  }`}
                  disabled={!canComplete}
                  onClick={handleComplete}
                >
                  {isReview ? 'Water the tree' : 'Lock in growth'}
                </button>
              </>
            )}
          </footer>
        )}
      </div>
    </div>
  );
}
