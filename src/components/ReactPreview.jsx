import { Component, useEffect, useMemo, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { runSourceCheck, SOURCE_CHECK_TYPES } from '../lib/sourceChecks';
import { compileComponent, gradeReactDom } from '../lib/runners/reactGrade';
import './ReactPreview.css';

// Live React lab. The learner's JSX is transpiled with Babel (bundled, lazy)
// and rendered with the app's own React into an isolated root, wrapped in an
// error boundary so a broken component never crashes CodeSprout. Compilation
// and grading are shared with the lesson-verification harness via
// runners/reactGrade. After each render, DOM checks grade the output and are
// lifted up via onResult — the same { logs, error, results } shape the iframe
// runner posts back.

let babelPromise = null;
function getBabel() {
  if (!babelPromise) babelPromise = import('@babel/standalone');
  return babelPromise;
}

class Boundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }
  static getDerivedStateFromError(error) {
    return { error };
  }
  componentDidUpdate(prev) {
    if (prev.resetKey !== this.props.resetKey && this.state.error) {
      this.setState({ error: null });
    }
  }
  render() {
    if (this.state.error) {
      this.props.onError?.(String(this.state.error.message ?? this.state.error));
      return null;
    }
    return this.props.children;
  }
}

export default function ReactPreview({ code, checks, onResult }) {
  const hostRef = useRef(null);
  const rootRef = useRef(null);
  const [babel, setBabel] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let on = true;
    getBabel().then((b) => on && setBabel(b));
    return () => {
      on = false;
    };
  }, []);

  const compiled = useMemo(
    () => (babel ? compileComponent(babel, code) : null),
    [babel, code]
  );

  useEffect(() => {
    if (!hostRef.current) return undefined;
    if (!rootRef.current) rootRef.current = createRoot(hostRef.current);
    setError(compiled?.error ?? null);

    if (compiled?.Comp) {
      const { Comp } = compiled;
      let renderError = null;
      rootRef.current.render(
        <Boundary resetKey={code} onError={(e) => (renderError = e)}>
          <Comp />
        </Boundary>
      );
      // Grade after the render commits and the boundary has run.
      const id = setTimeout(() => {
        const err = renderError || compiled?.error || null;
        setError(err);
        const results = err
          ? (checks ?? []).map((c) =>
              SOURCE_CHECK_TYPES.has(c.type) ? runSourceCheck(c, code) : false
            )
          : gradeReactDom(hostRef.current, code, checks);
        onResult?.({ logs: [], error: err, results });
      }, 60);
      return () => clearTimeout(id);
    }

    // Compile error: only source checks can pass.
    const results = (checks ?? []).map((c) =>
      SOURCE_CHECK_TYPES.has(c.type) ? runSourceCheck(c, code) : false
    );
    onResult?.({ logs: [], error: compiled?.error ?? null, results });
    return undefined;
  }, [compiled, code, checks, onResult]);

  // Tear the root down on unmount (async to dodge React's warning).
  useEffect(() => {
    return () => {
      const root = rootRef.current;
      rootRef.current = null;
      if (root) setTimeout(() => root.unmount(), 0);
    };
  }, []);

  return (
    <div className="rp-wrap">
      <div className="rp-bar" aria-hidden="true">
        <span className="rp-dot" />
        <span className="rp-dot" />
        <span className="rp-dot" />
        <span className="rp-url">react preview</span>
      </div>
      <div className="rp-stage">
        {!babel && <p className="rp-loading">Loading React…</p>}
        <div ref={hostRef} className="rp-host" />
        {error && <p className="rp-error">{error}</p>}
      </div>
    </div>
  );
}
