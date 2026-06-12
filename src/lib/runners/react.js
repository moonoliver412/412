// React runner — transpiles the learner's JSX with Babel (lazy-loaded once)
// and runs it in the JS sandbox with React + ReactDOM available, mounting the
// default-exported (or last-declared) component into #root. DOM checks
// (selectorExists / textIncludes) then grade the rendered output; source
// checks grade the JSX itself.
//
// Babel + React load from a CDN with SRI-free <script> tags inside the
// sandboxed iframe — the iframe has an opaque origin and no app access. They
// cache after first load (and via the service worker once fetched).

import { buildJsRunDoc } from '../jsRunner.js';

const REACT_HEAD = `
<script crossorigin src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
<script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
<script src="https://unpkg.com/@babel/standalone@7/babel.min.js"></script>
`;

/** Wrap learner JSX so Babel transpiles it and we mount the component. The
 *  learner writes a component (function App / export default function …); we
 *  render whichever component is in scope as `App` (convention) or the
 *  default export. */
function reactBootstrap(code) {
  return `
try {
  var __src = ${JSON.stringify(code)};
  // Normalize a default export into a plain declaration Babel can run.
  __src = __src.replace(/export\\s+default\\s+/, 'window.__CSDefault = ');
  var __transpiled = Babel.transform(__src, { presets: ['react'] }).code;
  (0, eval)(__transpiled);
  var Comp = (typeof window.__CSDefault !== 'undefined' && window.__CSDefault)
    || (typeof App !== 'undefined' && App)
    || null;
  if (Comp) {
    var root = ReactDOM.createRoot(document.getElementById('root'));
    root.render(React.createElement(Comp));
  } else {
    window.__csError = 'No component found — name yours App or default-export it.';
  }
} catch (e) { window.__csError = String(e && e.message || e); }
`;
}

/** Build the iframe document for a React exercise (async: ensures the libs
 *  load before checks run by giving React a longer settle window). */
export function buildReactDoc({ code, checks, nonce }) {
  return buildJsRunDoc({
    code: reactBootstrap(code),
    source: code,
    html: '<div id="root"></div>',
    checks,
    nonce,
    headScripts: REACT_HEAD,
    settleMs: 700,
  });
}
