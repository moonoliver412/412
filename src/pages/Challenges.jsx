import { Link } from 'react-router-dom';
import './stubs.css';

function CapBadge() {
  return (
    <span className="stub-badge" aria-hidden="true">
      {/* graduation-cap glyph */}
      <svg viewBox="0 0 24 24" width="26" height="26" fill="#111">
        <polygon points="12,4 23,9 12,14 1,9" />
        <path d="M6 11.5v4c0 1.6 2.7 3 6 3s6-1.4 6-3v-4l-6 2.7-6-2.7Z" />
      </svg>
    </span>
  );
}

export default function Challenges() {
  return (
    <main className="cs-page">
      <h1 className="cs-page-title">
        <CapBadge />
        Challenges
      </h1>

      <section className="challenges-big-row">
        <div className="cs-card stub-placeholder">clone a web</div>
        <div className="cs-card stub-placeholder" />
        <div className="cs-card stub-placeholder" />
      </section>

      <section className="challenges-bottom-row">
        <div className="cs-card challenge-slim" />
        <div className="cs-card challenge-slim" />
        <div className="cs-card challenge-slim" />
        <div className="cs-card challenge-slim" />
        <div className="cs-card challenge-slim" />
        <div className="cs-panel challenges-panel">
          <div className="challenges-panel-main" style={{ background: 'var(--card)' }} />
          <div className="challenges-panel-side">
            <div className="challenges-search">
              <span>Search challenges</span>
              <span aria-hidden="true">⌕</span>
            </div>
            <span className="challenges-no">NO. #124</span>
          </div>
        </div>
      </section>

      <p className="stub-muted" style={{ marginTop: 24 }}>
        Challenges are coming soon — sharpen your skills in the{' '}
        <Link to="/playground">Playground</Link> in the meantime.
      </p>
    </main>
  );
}
