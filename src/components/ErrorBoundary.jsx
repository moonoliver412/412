import { Component } from 'react';
import './ErrorBoundary.css';

// App-level error boundary: a crash anywhere renders a calm recovery panel
// instead of a white page. Progress lives in localStorage, so a reload is
// always safe; "Reset app data" is the escape hatch for corrupted state.

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    console.error('CodeSprout crashed:', error, info?.componentStack);
  }

  render() {
    if (!this.state.error) return this.props.children;
    return (
      <main className="eb-wrap" role="alert">
        <div className="eb-panel">
          <span className="eb-icon" aria-hidden="true">
            🥀
          </span>
          <h1 className="eb-title">Something wilted</h1>
          <p className="eb-text">
            The app hit an unexpected error. Your forest and progress are safe
            in this browser — reloading almost always fixes it.
          </p>
          <div className="eb-actions">
            <button
              type="button"
              className="eb-btn eb-btn--primary"
              onClick={() => window.location.reload()}
            >
              Reload
            </button>
            <button
              type="button"
              className="eb-btn"
              onClick={() => {
                if (
                  window.confirm(
                    'Reset ALL CodeSprout data (progress, forest, sprouts)? This cannot be undone.'
                  )
                ) {
                  localStorage.clear();
                  window.location.reload();
                }
              }}
            >
              Reset app data
            </button>
          </div>
        </div>
      </main>
    );
  }
}
