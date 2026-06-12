// Python runner — real CPython via Pyodide (WASM), loaded from a CDN the
// first time (cached afterwards). Captures stdout and exposes the final
// global namespace to expression checks.
//
// exercise: { kind:'python', starter:'…', checks }
// Check types:
//   { type:'logIncludes', text }        printed output contains text
//   { type:'exprTruthy', expr:'add(2,3)==5' }   Python expression is truthy
//   plus sourceIncludes / sourceMatches on the learner code.

import { runSourceCheck, SOURCE_CHECK_TYPES } from '../sourceChecks.js';

const PYODIDE_VERSION = 'v0.26.2';
const PYODIDE_URL = `https://cdn.jsdelivr.net/pyodide/${PYODIDE_VERSION}/full/`;

let pyPromise = null;

function loadScript(src) {
  return new Promise((resolve, reject) => {
    if (window.loadPyodide) return resolve();
    const s = document.createElement('script');
    s.src = src;
    s.onload = resolve;
    s.onerror = () => reject(new Error('offline'));
    document.head.appendChild(s);
  });
}

async function getPyodide() {
  if (!pyPromise) {
    pyPromise = (async () => {
      await loadScript(`${PYODIDE_URL}pyodide.js`);
      return window.loadPyodide({ indexURL: PYODIDE_URL });
    })();
  }
  return pyPromise;
}

export async function runPython(code, checks) {
  const logs = [];
  let error = null;
  let py = null;
  try {
    py = await getPyodide();
  } catch {
    return {
      logs,
      error:
        'Python needs an internet connection the first time so it can download. Try again online.',
      results: (checks ?? []).map(() => false),
    };
  }

  try {
    py.setStdout({ batched: (s) => logs.push(s) });
    py.setStderr({ batched: (s) => logs.push(s) });
    await py.runPythonAsync(code);
  } catch (e) {
    error = String(e?.message ?? e).split('\n').slice(-3).join('\n');
  }

  const results = (checks ?? []).map((c) => {
    try {
      if (c.type === 'logIncludes') {
        const want = String(c.text).toLowerCase();
        return logs.some((l) => String(l).toLowerCase().includes(want));
      }
      if (c.type === 'exprTruthy') {
        return !!py.runPython(`bool(${c.expr})`);
      }
      if (SOURCE_CHECK_TYPES.has(c.type)) return runSourceCheck(c, code);
      return false;
    } catch {
      return false;
    }
  });

  return { logs, error, results };
}
