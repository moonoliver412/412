// Python runner — Skulpt, a pure-JavaScript Python 3 interpreter. It runs
// in-page with no WASM and no network, so Python lessons work offline and are
// unit-testable. It covers the teaching subset (print, variables, numbers,
// strings, booleans, if/loops, functions, lists, dicts) — exactly what teens
// learn first.
//
// exercise: { kind:'python', starter:'…', checks }
// Check types: logIncludes (printed output), plus sourceIncludes /
// sourceMatches on the learner code.

import { runSourceCheck, SOURCE_CHECK_TYPES } from '../sourceChecks.js';

let skPromise = null;

async function getSk() {
  if (!skPromise) {
    skPromise = (async () => {
      await import('skulpt/dist/skulpt.min.js');
      await import('skulpt/dist/skulpt-stdlib.js');
      return globalThis.Sk;
    })();
  }
  return skPromise;
}

export async function runPython(code, checks) {
  let buffer = '';
  let error = null;
  let Sk;
  try {
    Sk = await getSk();
  } catch {
    return {
      logs: [],
      error: 'Python failed to load. Try refreshing.',
      results: (checks ?? []).map(() => false),
    };
  }

  try {
    Sk.configure({
      output: (t) => {
        buffer += t;
      },
      read: (f) => {
        if (!Sk.builtinFiles || Sk.builtinFiles.files[f] === undefined) {
          throw new Error(`File not found: ${f}`);
        }
        return Sk.builtinFiles.files[f];
      },
      __future__: Sk.python3,
      execLimit: 5000,
    });
    await Sk.misceval.asyncToPromise(() =>
      Sk.importMainWithBody('<stdin>', false, String(code ?? ''), true)
    );
  } catch (e) {
    error = String(e?.toString ? e.toString() : e);
  }

  const logs = buffer.split('\n').filter((l) => l.length > 0);
  const results = (checks ?? []).map((c) => {
    try {
      if (c.type === 'logIncludes') {
        const want = String(c.text).toLowerCase();
        return logs.some((l) => l.toLowerCase().includes(want));
      }
      if (SOURCE_CHECK_TYPES.has(c.type)) return runSourceCheck(c, code);
      return false;
    } catch {
      return false;
    }
  });

  return { logs, error, results };
}
