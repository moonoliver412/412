import { useState } from 'react';
import { useGame } from '../state/useGame';
import { CHALLENGES } from '../data/challenges';
import ChallengePanel from '../components/ChallengePanel';
import './Challenges.css';

function ChallengeCard({ challenge, isCompleted, index, onClick }) {
  return (
    <div className="chl-card" style={{ '--i': index }}>
      <button
        type="button"
        className={`chl-card-inner${isCompleted ? ' is-done' : ''}`}
        onClick={onClick}
        aria-label={`Open ${challenge.name} challenge`}
      >
        <div className="chl-card-top">
          <span className={`chl-lang-chip chl-lang-chip--${challenge.language}`}>
            {challenge.language.toUpperCase()}
          </span>
          {isCompleted && (
            <span className="chl-done-check" aria-label="Completed">✓</span>
          )}
        </div>
        <h3 className="chl-name">{challenge.name}</h3>
        <p className="chl-brief">{challenge.brief}</p>
        <div className="chl-card-footer">
          <span className="chl-reward">+{challenge.reward} 🌱</span>
          <span className="chl-cta">
            {isCompleted ? 'Replay →' : 'Start →'}
          </span>
        </div>
      </button>
    </div>
  );
}

export default function Challenges() {
  const { game } = useGame();
  const [open, setOpen] = useState(null);

  const completedSet = new Set(game.completedChallenges ?? []);

  return (
    <main className="cs-page">
      <header className="chl-header">
        <h1 className="chl-title">
          <span className="chl-title-icon" aria-hidden="true">🌾</span>
          Challenges
        </h1>
        <p className="chl-tagline">
          No starter code. No hints. Just you and the field.
        </p>
      </header>

      <section className="chl-grid" aria-label="Available challenges">
        {CHALLENGES.map((ch, i) => (
          <ChallengeCard
            key={ch.id}
            challenge={ch}
            isCompleted={completedSet.has(ch.id)}
            index={i}
            onClick={() => setOpen(ch)}
          />
        ))}
      </section>

      {open && (
        <ChallengePanel
          challenge={open}
          onClose={() => setOpen(null)}
        />
      )}
    </main>
  );
}
