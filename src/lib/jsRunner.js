// jsRunner — sandboxed execution + grading for JavaScript exercises.
//
// JS exercises can't be graded by parsing markup (checkExercise) — the code
// must RUN. buildJsRunDoc() returns a srcDoc for an <iframe sandbox=
// "allow-scripts"> (opaque origin: no access to the app). Inside, three
// scripts run in order:
//   1. harness setup — console.log capture + window.onerror
//   2. the learner's code, verbatim, as its own top-level script (so even
//      top-level let/const land in the global lexical scope and stay visible
//      to the check script)
//   3. check evaluation — posts { nonce, logs, error, results } to parent
//
// Exercise data contract (lesson authors):
//   exercise: {
//     kind: 'js',
//     starter: '// learner-edited JS',
//     html: '<p id="out"></p>',        // optional host markup the code can touch
//     checks: [
//       { type: 'logIncludes', text: 'hello', label: '…' },
//       { type: 'exprTruthy', expr: 'add(2, 3) === 5', label: '…' },
//       { type: 'selectorExists', selector: '#out .leaf', label: '…', count? },
//       { type: 'textIncludes', text: 'planted', selector: '#out', label: '…' },
//     ],
//   }
// exprTruthy runs AFTER the learner script in global scope: it can see
// learner functions/vars (including top-level let/const), the DOM, and logs.

/** A learner script must not be able to close our <script> tag early. */
function escapeScript(code) {
  return String(code ?? '').replace(/<\/script/gi, '<\\/script');
}

/**
 * Build a runnable iframe document for an executed-code exercise.
 * Options beyond the JS basics let TypeScript/Node/React reuse this path:
 *   preamble   — JS injected BEFORE the learner code (e.g. Node mocks)
 *   source     — the ORIGINAL learner source, for sourceIncludes/sourceMatches
 *                checks (the `code` may be a transformed/stripped version)
 *   headScripts — extra <script> markup for <head> (e.g. React UMD libs)
 *   settleMs   — delay before checks run (React/async need a touch more)
 */
export function buildJsRunDoc({
  code,
  html,
  checks,
  nonce,
  preamble = '',
  source = null,
  headScripts = '',
  settleMs = 250,
}) {
  const checksJson = escapeScript(JSON.stringify(checks ?? []));
  const sourceJson = escapeScript(JSON.stringify(source ?? code ?? ''));
  return `<!doctype html>
<html>
<head>
<meta charset="utf-8">
<style>
  body { margin: 12px; font: 14px/1.5 -apple-system, system-ui, sans-serif; color: #222; }
</style>
${headScripts}
</head>
<body>
${html ?? ''}
<script>
  window.__csLogs = [];
  window.__csError = null;
  window.__csSource = ${sourceJson};
  (function () {
    var orig = console.log;
    console.log = function () {
      window.__csLogs.push(Array.prototype.map.call(arguments, function (a) {
        try { return typeof a === 'object' ? JSON.stringify(a) : String(a); }
        catch (e) { return String(a); }
      }).join(' '));
      orig.apply(console, arguments);
    };
    window.onerror = function (msg) {
      window.__csError = String(msg);
      return true;
    };
  })();
</script>
<script>
${escapeScript(preamble)}
</script>
<script>
${escapeScript(code)}
</script>
<script>
  // Checks run after the learner script so short async work (zero-ish
  // setTimeout, resolved promises, a React render) settles first.
  setTimeout(function () {
    var checks = ${checksJson};
    var logs = window.__csLogs;
    var source = window.__csSource;
    function norm(s){ return String(s == null ? '' : s).replace(/\\s+/g, ' '); }
    var results = checks.map(function (c) {
      try {
        if (c.type === 'logIncludes') {
          var want = String(c.text).toLowerCase();
          return logs.some(function (l) { return l.toLowerCase().indexOf(want) !== -1; });
        }
        if (c.type === 'exprTruthy') {
          return !!(0, eval)(c.expr);
        }
        if (c.type === 'selectorExists') {
          var m = document.querySelectorAll(c.selector);
          return c.count != null ? m.length === c.count : m.length >= 1;
        }
        if (c.type === 'textIncludes') {
          var root = c.selector ? document.querySelector(c.selector) : document.body;
          if (!root) return false;
          var t = root.textContent.replace(/\\s+/g, ' ').toLowerCase();
          return t.indexOf(String(c.text).toLowerCase()) !== -1;
        }
        if (c.type === 'sourceIncludes') {
          var hay = c.flex ? norm(source).replace(/\\s/g, '') : norm(source);
          var nd = c.flex ? norm(c.text).replace(/\\s/g, '') : norm(c.text);
          if (!c.caseSensitive) { hay = hay.toLowerCase(); nd = nd.toLowerCase(); }
          return nd.length > 0 && hay.indexOf(nd) !== -1;
        }
        if (c.type === 'sourceMatches') {
          return new RegExp(c.pattern, c.flags || '').test(String(source || ''));
        }
        return false;
      } catch (e) {
        return false;
      }
    });
    parent.postMessage(
      { type: 'cs-js-run', nonce: ${JSON.stringify(nonce)}, logs: logs, error: window.__csError, results: results },
      '*'
    );
  }, ${settleMs});
</script>
</body>
</html>`;
}

/** Map runner results (booleans) back onto labeled check objects. */
export function labelJsResults(checks, results) {
  return (checks ?? []).map((check, i) => ({
    label: check?.label ?? check?.type ?? 'check',
    pass: results?.[i] === true,
  }));
}
