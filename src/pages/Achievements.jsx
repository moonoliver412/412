import { Link } from 'react-router-dom';
import './stubs.css';

function MedalBadge() {
  return (
    <span className="stub-badge" aria-hidden="true">
      {/* medal glyph */}
      <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="#111" strokeWidth="1.8">
        <circle cx="12" cy="14" r="5" />
        <path d="M9 10 6 3M15 10l3-7M12 9.2 10 3M12 9.2 14 3" strokeLinecap="round" />
      </svg>
    </span>
  );
}

const PLACEHOLDERS = [
  'First sprout',
  'Focus streak',
  'Grove keeper',
  'Bug squasher',
  'Night owl',
  'Forest master',
];

export default function Achievements() {
  return (
    <main className="cs-page">
      <h1 className="cs-page-title">
        <MedalBadge />
        Achievements
      </h1>
      <p className="stub-muted" style={{ marginBottom: 24 }}>
        Badges you earn as your forest grows. Coming soon — start a session in
        the <Link to="/playground">Playground</Link> to get a head start.
      </p>
      <section className="stub-grid">
        {PLACEHOLDERS.map((name) => (
          <div key={name} className="cs-card stub-placeholder">
            {name}
          </div>
        ))}
      </section>
    </main>
  );
}
