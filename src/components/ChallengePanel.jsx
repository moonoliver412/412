import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useGame } from '../state/useGame';
import { allPass, checkExercise } from '../lib/checkExercise';
import { buildJsRunDoc, labelJsResults } from '../lib/jsRunner';
import './ChallengePanel.css';

const DEBOUNCE_MS = 350;

function codeNonce(str) {
  let h = 5381;
  for (let i = 0; i < str.length; i++) h = (h * 33) ^ str.charCodeAt(i);
  return `cp-run-${h >>> 0}-${str.length}`;
}

// T3 macro celebration after claiming reward
function Ceremony({ name, onClose }) {
  return (
    <div className="cp-ceremony" role="status">
      <div className="cp-burst" aria-hidden="true">
        {Array.from({ length: 14 }, (_, i) => (
          <span key={i} className="cp-leaf" style={{ '--n': i }} />
        ))}
      </div>
      <p className="cp-ceremony-kicker cp-enter" style={{ '--i': 0 }}>
        Field cleared
      </p>
      <h3 className="cp-ceremony-title cp-enter" style={{ '--i': 1 }}>
        {name}
      </h3>
      <p className="cp-ceremony-sub cp-enter" style={{ '--i': 2 }}>
        Challenge complete
      </p>
      <p className="cp-ceremony-reward cp-enter" style={{ '--i': 3 }} aria-hidden="true">
        +15 🌱
      </p>
      <button
        type="button"
        className="cp-ceremony-btn cp-enter"
        style={{ '--i': 4 }}
        onClick={onClose}
      >
        Back to the grove
      </button>
    </div>
  );
}

export default function ChallengePanel({ challenge, onClose }) {
  const { game, completeChallenge } = useGame();
  const dialogRef = useRef(null);

  const isCompleted = game.completedChallenges?.includes(challenge.id);
  const isJs = challenge.kind === 'js';

  const [code, setCode] = useState('');
  const [debouncedCode, setDebouncedCode] = useState('');
  const [ceremony, setCeremony] = useState(false);

  // Focus dialog on open; restore focus on close
  useEffect(() => {
    const previouslyFocused = document.activeElement;
    dialogRef.current?.focus();
    return () => {
      if (previouslyFocused && typeof previouslyFocused.focus === 'function') {
        previouslyFocused.focus();
      }
    };
  }, []);

  // Escape to close
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  // Debounce code → preview + checks
  useEffect(() => {
    const id = setTimeout(() => setDebouncedCode(code), DEBOUNCE_MS);
    return () => clearTimeout(id);
  }, [code]);

  // JS runner
  const [jsRun, setJsRun] = useState({ logs: [], error: null, results: [] });
  const runNonce = useMemo(() => codeNonce(debouncedCode), [debouncedCode]);

  const previewDoc = useMemo(() => {
    if (!isJs) return debouncedCode;
    return buildJsRunDoc({
      code: debouncedCode,
      html: challenge.html,
      checks: challenge.checks,
      nonce: runNonce,
    });
  }, [isJs, debouncedCode, challenge.html, challenge.checks, runNonce]);

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
        ? labelJsResults(challenge.checks, jsRun.results)
        : checkExercise(debouncedCode, challenge.checks ?? []),
    [isJs, jsRun, debouncedCode, challenge.checks]
  );

  const ready = allPass(results);

  // T3 micro: fires once per false→true edge
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

  const handleClaim = useCallback(() => {
    completeChallenge(challenge.id, {});
    setCeremony(true);
  }, [challenge.id, completeChallenge]);

  const langLabel = challenge.language?.toUpperCase() ?? '';

  return (
    <div
      className="cp-overlay"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="cp-dialog"
        role="dialog"
        aria-modal="true"
        aria-label={`${challenge.name} challenge`}
        tabIndex={-1}
        ref={dialogRef}
      >
        {/* Head */}
        <div className="cp-head">
          <h2 className="cp-title">{challenge.name}</h2>
          <span className={`cp-lang-chip cp-lang-chip--${challenge.language}`}>
            {langLabel}
          </span>
          <button
            type="button"
            className="cp-close"
            aria-label="Close challenge"
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="cp-body">
          {ceremony ? (
            <Ceremony name={challenge.name} onClose={onClose} />
          ) : (
            <div className="cp-lab">
              {/* Completed review banner */}
              {isCompleted && !ceremony && (
                <div className="cp-review-banner cp-enter" style={{ '--i': 0 }}>
                  <span className="cp-review-banner-icon" aria-hidden="true">✓</span>
                  Completed — replay for fun
                </div>
              )}

              {/* Brief card */}
              <div className="cp-brief cp-enter" style={{ '--i': isCompleted ? 1 : 0 }}>
                <p className="cp-brief-kicker">The challenge</p>
                <p>{challenge.brief}</p>
              </div>

              {/* Lab grid */}
              <div
                className="cp-lab-grid cp-enter"
                style={{ '--i': isCompleted ? 2 : 1 }}
              >
                {/* Left: editor */}
                <div className="cp-lab-col">
                  <div className="cp-lab-head">
                    <h3 className="cp-lab-title">Your solution</h3>
                    <button
                      type="button"
                      style={{
                        background: 'none',
                        border: 'none',
                        padding: 0,
                        color: '#8f8f8f',
                        fontSize: '12.5px',
                        textDecoration: 'underline',
                        cursor: 'pointer',
                        fontFamily: 'var(--font-body)',
                      }}
                      onClick={() => { setCode(''); setDebouncedCode(''); }}
                    >
                      Clear
                    </button>
                  </div>
                  <textarea
                    className="cp-editor"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    spellCheck={false}
                    autoComplete="off"
                    autoCorrect="off"
                    autoCapitalize="off"
                    aria-label="Challenge code editor"
                    placeholder="// No starter code — start from scratch"
                  />
                </div>

                {/* Right: preview + checks */}
                <div className="cp-lab-col">
                  <div className="cp-browser">
                    <div className="cp-browser-bar" aria-hidden="true">
                      <span className="cp-dot" />
                      <span className="cp-dot" />
                      <span className="cp-dot" />
                      <span className="cp-browser-url">live preview</span>
                    </div>
                    <iframe
                      className="cp-preview"
                      sandbox={isJs ? 'allow-scripts' : ''}
                      title="Challenge preview"
                      srcDoc={previewDoc}
                    />
                  </div>

                  {isJs && (
                    <div className="cp-console" aria-label="Console output">
                      {jsRun.error && (
                        <p className="cp-console-line cp-console-err">{jsRun.error}</p>
                      )}
                      {jsRun.logs.map((line, i) => (
                        <p key={i} className="cp-console-line">{line}</p>
                      ))}
                      {!jsRun.error && jsRun.logs.length === 0 && (
                        <p className="cp-console-line cp-console-dim">
                          // console.log output appears here
                        </p>
                      )}
                    </div>
                  )}

                  <ul className="cp-checks">
                    {results.map((r, i) => (
                      <li
                        key={i}
                        className={`cp-check${r.pass ? ' is-pass' : ''}${
                          justPassed.includes(i) ? ' is-just-passed' : ''
                        }`}
                      >
                        <span
                          className="cp-check-mark"
                          role="img"
                          aria-label={r.pass ? 'Passed' : 'Not passed yet'}
                        >
                          <svg viewBox="0 0 16 16">
                            <path d="M3.5 8.5l3 3 6-7" />
                          </svg>
                        </span>
                        <span className="cp-check-label">{r.label}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {!ceremony && (
          <footer className="cp-footer">
            <div className="cp-footer-left">
              <p className="cp-reward-note">Reward: 15 🌱 sprouts</p>
              <p
                className={`cp-footer-status${ready ? ' is-ready' : ''}`}
                role="status"
              >
                {ready
                  ? 'All checks pass — claim your reward!'
                  : 'Pass all checks to claim'}
              </p>
            </div>
            {!isCompleted && (
              <button
                type="button"
                className={`cp-claim-btn${ready ? ' is-armed' : ''}`}
                disabled={!ready}
                onClick={handleClaim}
              >
                Claim 15 sprouts
              </button>
            )}
          </footer>
        )}
      </div>
    </div>
  );
}
