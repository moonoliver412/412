import { Link } from 'react-router-dom';
import './stubs.css';

function TrophyBadge() {
  return (
    <span className="stub-badge" aria-hidden="true">
      {/* trophy glyph */}
      <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="#111" strokeWidth="1.8" strokeLinejoin="round">
        <path d="M7 4h10v6a5 5 0 0 1-10 0V4Z" />
        <path d="M7 6H4a3 3 0 0 0 3 4M17 6h3a3 3 0 0 1-3 4" />
        <path d="M12 15v3M8.5 20h7" strokeLinecap="round" />
      </svg>
    </span>
  );
}

export default function Leaderboard() {
  return (
    <main className="cs-page">
      <h1 className="cs-page-title">
        <TrophyBadge />
        Leaderboard
      </h1>
      <p className="stub-muted" style={{ marginBottom: 24 }}>
        See how your forest stacks up against other sprouts. Rankings are
        coming soon — keep growing in the{' '}
        <Link to="/playground">Playground</Link>.
      </p>
      <section className="leaderboard-rows">
        {[1, 2, 3, 4, 5].map((rank) => (
          <div key={rank} className="cs-card leaderboard-row">
            <span className="leaderboard-rank">#{rank}</span>
            <span className="leaderboard-bar" />
          </div>
        ))}
      </section>
    </main>
  );
}
