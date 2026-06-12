import { useGame } from '../state/useGame';
import { ACHIEVEMENTS } from '../data/achievements';
import './Achievements.css';

function formatDate(ms) {
  if (!ms) return null;
  const d = new Date(ms);
  return d.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function AchievementCard({ def, unlockedAtMs, index }) {
  const unlocked = unlockedAtMs != null;
  return (
    <article
      className={`ach-card ach-card--${unlocked ? 'unlocked' : 'locked'}`}
      style={{ '--i': index }}
      aria-label={`${def.name} — ${unlocked ? 'unlocked' : 'locked'}`}
    >
      {unlocked ? (
        <span className="ach-icon" aria-hidden="true">{def.icon}</span>
      ) : (
        <span className="ach-lock-glyph" aria-hidden="true">🔒</span>
      )}
      <h3 className="ach-name">{def.name}</h3>
      <p className="ach-blurb">{def.blurb}</p>
      {unlocked && (
        <p className="ach-date" role="status">
          Unlocked {formatDate(unlockedAtMs)}
        </p>
      )}
    </article>
  );
}

export default function Achievements() {
  const { game } = useGame();
  const unlockedCount = Object.keys(game.achievements).length;
  const total = ACHIEVEMENTS.length;
  const pct = total > 0 ? (unlockedCount / total) * 100 : 0;

  return (
    <main className="cs-page">
      <header className="ach-header">
        <h1 className="ach-title">
          <span className="ach-title-icon" aria-hidden="true">🏅</span>
          Achievements
        </h1>
        <p className="ach-counter">
          <strong>{unlockedCount}</strong> of <strong>{total}</strong> unlocked
        </p>
        <div
          className="ach-rail"
          role="progressbar"
          aria-valuenow={unlockedCount}
          aria-valuemin={0}
          aria-valuemax={total}
          aria-label="Achievements progress"
        >
          <div
            className="ach-rail-fill"
            aria-hidden="true"
            style={{ width: `${pct}%` }}
          />
        </div>
      </header>

      <section className="ach-grid" aria-label="All achievements">
        {ACHIEVEMENTS.map((def, i) => (
          <AchievementCard
            key={def.id}
            def={def}
            unlockedAtMs={game.achievements[def.id] ?? null}
            index={i}
          />
        ))}
      </section>
    </main>
  );
}
