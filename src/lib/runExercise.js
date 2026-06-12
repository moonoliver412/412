// Unified exercise grading dispatch. Each exercise.kind maps to one of three
// execution modes the lesson lab understands:
//   'dom'     — HTML/CSS, graded by parsing markup (synchronous)
//   'iframe'  — js/ts/node/react, run in a sandboxed iframe (postMessage back)
//   'console' — sql/python/terminal, run in-page (async/sync), console output
//   'quiz'    — multiple-choice, handled directly in LessonPanel
//
// LessonPanel uses exerciseMode() to pick the UI, buildIframeDoc() for the
// iframe srcDoc, and runConsole()/runDom() for the other two.

import { checkExercise } from './checkExercise.js';
import { buildJsRunDoc, labelJsResults } from './jsRunner.js';
import { stripTypes } from './tsStrip.js';
import { NODE_PREAMBLE } from './runners/node.js';
import { runTerminal } from './runners/terminal.js';
import { runSql } from './runners/sql.js';
import { runPython } from './runners/python.js';

const IFRAME_KINDS = new Set(['js', 'ts', 'node']);
const CONSOLE_KINDS = new Set(['sql', 'python', 'terminal']);

export function exerciseMode(exercise) {
  const kind = exercise?.kind;
  if (kind === 'quiz') return 'quiz';
  if (kind === 'react') return 'react'; // rendered in-parent (ReactPreview)
  if (IFRAME_KINDS.has(kind)) return 'iframe';
  if (CONSOLE_KINDS.has(kind)) return 'console';
  return 'dom';
}

/** Console languages have no visual preview — they show output instead. */
export function showsPreview(exercise) {
  return exerciseMode(exercise) !== 'console';
}

/** Build the sandboxed-iframe document for js/ts/node. */
export function buildIframeDoc(exercise, code, nonce) {
  const checks = exercise.checks ?? [];
  switch (exercise.kind) {
    case 'ts':
      return buildJsRunDoc({
        code: stripTypes(code),
        source: code,
        html: exercise.html,
        checks,
        nonce,
      });
    case 'node':
      return buildJsRunDoc({
        code,
        preamble: NODE_PREAMBLE,
        source: code,
        checks,
        nonce,
      });
    case 'js':
    default:
      return buildJsRunDoc({ code, html: exercise.html, checks, nonce });
  }
}

/** Async grading for console languages. */
export async function runConsole(exercise, code) {
  const checks = exercise.checks ?? [];
  if (exercise.kind === 'terminal') return runTerminal(code, checks);
  if (exercise.kind === 'sql') return runSql(code, exercise, checks);
  if (exercise.kind === 'python') return runPython(code, checks);
  return { logs: [], error: null, results: checks.map(() => false) };
}

/** Synchronous grading for HTML/CSS. */
export function runDom(exercise, code) {
  return checkExercise(code, exercise.checks ?? []);
}

export { labelJsResults };
