import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useProgress } from '../state/useProgress';
import { STAGES_PER_TOPIC } from '../data/curriculum';
import { allPass } from '../lib/checkExercise';
import {
  buildIframeDoc,
  exerciseMode,
  labelJsResults,
  runConsole,
  runDom,
  showsPreview,
} from '../lib/runExercise';
import { play } from '../lib/sound';
import QuizBlock from './QuizBlock';
import ReactPreview from './ReactPreview';
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

/** Placeholder line for the output panel, per language. */
function consolePlaceholder(kind) {
  if (kind === 'sql') return '-- query results appear here';
  if (kind === 'python') return '# print() output appears here';
  if (kind === 'terminal') return '$ output appears here';
  return '// console.log output appears here';
}

// Stuck-help escalation thresholds (distinct graded code snapshots).
const HINT1_AT = 3;
const HINT2_AT = 6;
const SOLUTION_AT = 9;

function Block({ block, index }) {
  const style = { '--i': index };
  if (block.type === 'quiz') {
    return <QuizBlock quiz={block} index={index} />;
  }
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

  const exercise = useMemo(() => lesson?.exercise ?? {}, [lesson]);
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

  // Stuck-help: every distinct graded snapshot counts as an attempt; hints
  // and the solution unlock progressively but stay opt-in buttons.
  const [attempts, setAttempts] = useState(0);
  const [hintsShown, setHintsShown] = useState(0);
  const [solutionShown, setSolutionShown] = useState(false);
  const [solutionUsed, setSolutionUsed] = useState(false);
  const lastCountedRef = useRef(starter);
  const hints = exercise.hints ?? [];
  const solution = exercise.solution ?? null;

  useEffect(() => {
    if (debouncedCode === starter) return;
    if (debouncedCode === lastCountedRef.current) return;
    lastCountedRef.current = debouncedCode;
    setAttempts((n) => n + 1);
  }, [debouncedCode, starter]);

  // Graded quiz exercises (exercise.kind === 'quiz') track per-question
  // correctness instead of running code.
  const isQuiz = exercise.kind === 'quiz';
  const quizQuestions = useMemo(
    () => (isQuiz ? (exercise.questions ?? []) : []),
    [isQuiz, exercise.questions]
  );
  const [quizSolved, setQuizSolved] = useState({});

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

  // Grading mode by exercise.kind: 'iframe' (js/ts/node/react) runs in a
  // sandboxed iframe and posts results back; 'console' (sql/python/terminal)
  // runs in-page; 'dom' (HTML/CSS) parses markup; 'quiz' is handled above.
  const runMode = exerciseMode(exercise);
  const hasPreview = showsPreview(exercise);
  const [run, setRun] = useState({ logs: [], error: null, results: [] });
  const runNonce = useMemo(() => codeNonce(debouncedCode), [debouncedCode]);

  // iframe languages: the doc the preview <iframe> runs.
  const previewDoc = useMemo(() => {
    if (runMode === 'iframe') return buildIframeDoc(exercise, debouncedCode, runNonce);
    return debouncedCode;
  }, [runMode, exercise, debouncedCode, runNonce]);

  // iframe languages: collect results posted back by the sandbox.
  useEffect(() => {
    if (runMode !== 'iframe') return undefined;
    const onMessage = (e) => {
      if (e.data?.type === 'cs-js-run' && e.data.nonce === runNonce) {
        setRun({
          logs: e.data.logs ?? [],
          error: e.data.error ?? null,
          results: e.data.results ?? [],
        });
      }
    };
    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, [runMode, runNonce]);

  // console languages: run in-page (async) on each debounced change.
  useEffect(() => {
    if (runMode !== 'console') return undefined;
    let cancelled = false;
    runConsole(exercise, debouncedCode).then((r) => {
      if (!cancelled) setRun(r);
    });
    return () => {
      cancelled = true;
    };
  }, [runMode, exercise, debouncedCode]);

  const results = useMemo(() => {
    if (isQuiz) {
      return quizQuestions.map((q, i) => ({
        label: `Question ${i + 1}`,
        pass: !!quizSolved[i],
      }));
    }
    if (runMode === 'dom') return runDom(exercise, debouncedCode);
    return labelJsResults(checks, run.results);
  }, [isQuiz, quizQuestions, quizSolved, runMode, exercise, debouncedCode, checks, run]);
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
    play(passes.every(Boolean) ? 'allpass' : 'check');
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
    play('ceremony');
    if (isReview) {
      onWatered?.();
      setCeremony({ stage: STAGES_PER_TOPIC, water: true });
      return;
    }
    const next = Math.min(
      getTopicProgress(topicId).lockedStage + 1,
      STAGES_PER_TOPIC
    );
    completeLesson(topicId, { half: solutionUsed });
    setCeremony({ stage: next });
  };

  // Stuck-help availability ladder.
  const hintsAvailable =
    attempts >= HINT2_AT ? Math.min(2, hints.length) : attempts >= HINT1_AT ? Math.min(1, hints.length) : 0;
  const showCheckHints = attempts >= HINT2_AT;
  const solutionAvailable = !!solution && attempts >= SOLUTION_AT && !ready;

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
              {isQuiz ? (
                <div className="lp-quiz-list lp-enter" style={{ '--i': 1 }}>
                  {quizQuestions.map((q, i) => (
                    <QuizBlock
                      key={i}
                      quiz={q}
                      index={i}
                      onCorrect={() =>
                        setQuizSolved((cur) => ({ ...cur, [i]: true }))
                      }
                    />
                  ))}
                </div>
              ) : (
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
                  {(hintsAvailable > 0 || solutionAvailable) && !ready && (
                    <div className="lp-stuck">
                      {hints.slice(0, hintsShown).map((hint, i) => (
                        <p key={i} className="lp-tip lp-stuck-hint">
                          <span className="lp-tip-bulb" aria-hidden="true">
                            💡
                          </span>
                          <span>{hint}</span>
                        </p>
                      ))}
                      <div className="lp-stuck-actions">
                        {hintsShown < hintsAvailable && (
                          <button
                            type="button"
                            className="lp-stuck-btn"
                            onClick={() => setHintsShown((n) => n + 1)}
                          >
                            💡 Stuck? Get a hint
                          </button>
                        )}
                        {solutionAvailable && !solutionShown && (
                          <button
                            type="button"
                            className="lp-stuck-btn lp-stuck-btn--solution"
                            onClick={() => setSolutionShown(true)}
                          >
                            Show the solution
                          </button>
                        )}
                      </div>
                      {solutionShown && (
                        <div className="lp-solution">
                          <pre className="lp-code lp-solution-code">
                            <code>{solution}</code>
                          </pre>
                          <button
                            type="button"
                            className="lp-stuck-btn lp-stuck-btn--solution"
                            onClick={() => {
                              setCode(solution);
                              setDebouncedCode(solution);
                              setSolutionUsed(true);
                            }}
                          >
                            Use it (half the sprouts)
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
                <div className="lp-lab-col">
                  {hasPreview &&
                    (runMode === 'react' ? (
                      <ReactPreview
                        code={debouncedCode}
                        checks={checks}
                        onResult={setRun}
                      />
                    ) : (
                      <div className="lp-browser">
                        <div className="lp-browser-bar" aria-hidden="true">
                          <span className="lp-dot" />
                          <span className="lp-dot" />
                          <span className="lp-dot" />
                          <span className="lp-browser-url">live preview</span>
                        </div>
                        <iframe
                          className="lp-preview"
                          sandbox={runMode === 'iframe' ? 'allow-scripts' : ''}
                          title="preview"
                          srcDoc={previewDoc}
                        />
                      </div>
                    ))}
                  {(runMode === 'iframe' || runMode === 'console') && (
                    <div
                      className={`lp-console${hasPreview ? '' : ' lp-console--tall'}`}
                      aria-label="Output"
                    >
                      {run.error && (
                        <p className="lp-console-line lp-console-err">
                          {run.error}
                        </p>
                      )}
                      {run.logs.map((line, i) => (
                        <p key={i} className="lp-console-line">
                          {line}
                        </p>
                      ))}
                      {!run.error && run.logs.length === 0 && (
                        <p className="lp-console-line lp-console-dim">
                          {consolePlaceholder(exercise.kind)}
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
                        <span className="lp-check-label">
                          {r.label}
                          {!r.pass && showCheckHints && checks?.[i]?.hint && (
                            <span className="lp-check-hint">
                              {checks[i].hint}
                            </span>
                          )}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              )}
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
