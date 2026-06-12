// Headless React grading — compile the learner's JSX with Babel, render it
// with the app's React into a detached node, run DOM + source checks, then
// tear down. Shared by ReactPreview (live lab) and the lesson-verification
// harness so both grade identically.

import * as React from 'react';
import { createRoot } from 'react-dom/client';
import { runSourceCheck, SOURCE_CHECK_TYPES } from '../sourceChecks.js';

let babelPromise = null;
function getBabel() {
  if (!babelPromise) babelPromise = import('@babel/standalone');
  return babelPromise;
}

/** Compile learner JSX into a component function. { Comp } or { error }. */
export function compileComponent(Babel, code) {
  try {
    const src = String(code ?? '')
      .replace(/^\s*import[^\n]*\n/gm, '')
      .replace(/export\s+default\s+function\s+([A-Za-z0-9_]+)/, 'function $1')
      .replace(/export\s+default\s+/, 'return ');
    const out = Babel.transform(src, {
      presets: [['react', { runtime: 'classic' }]],
    }).code;
    const factory = new Function(
      'React',
      'useState',
      'useEffect',
      'useRef',
      `${out}\nreturn (typeof App !== 'undefined' ? App : (typeof Welcome !== 'undefined' ? Welcome : null));`
    );
    const Comp = factory(React, React.useState, React.useEffect, React.useRef);
    if (typeof Comp !== 'function') {
      return { error: 'Name your component App (or default-export it).' };
    }
    return { Comp };
  } catch (e) {
    return { error: String(e?.message ?? e) };
  }
}

/** Grade DOM + source checks against a rendered node. */
export function gradeReactDom(node, source, checks) {
  return (checks ?? []).map((c) => {
    try {
      if (c.type === 'selectorExists') {
        const m = node.querySelectorAll(c.selector);
        return c.count != null ? m.length === c.count : m.length >= 1;
      }
      if (c.type === 'textIncludes') {
        const root = c.selector ? node.querySelector(c.selector) : node;
        if (!root) return false;
        const t = root.textContent.replace(/\s+/g, ' ').toLowerCase();
        return t.includes(String(c.text).toLowerCase());
      }
      if (SOURCE_CHECK_TYPES.has(c.type)) return runSourceCheck(c, source);
      return false;
    } catch {
      return false;
    }
  });
}

/** Compile, render to a detached node, grade, tear down. Returns booleans. */
export async function gradeReactCode(code, checks) {
  const Babel = await getBabel();
  const { Comp, error } = compileComponent(Babel, code);
  if (!Comp) {
    return (checks ?? []).map((c) =>
      SOURCE_CHECK_TYPES.has(c.type) ? runSourceCheck(c, code) : false
    );
  }
  void error;
  const host = document.createElement('div');
  document.body.appendChild(host);
  const root = createRoot(host);
  root.render(React.createElement(Comp));
  await new Promise((r) => setTimeout(r, 80));
  const results = gradeReactDom(host, code, checks);
  root.unmount();
  host.remove();
  return results;
}
