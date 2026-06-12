import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useGame } from '../state/useGame';
import { fireStreakNotification, streakAtRisk } from '../lib/notify';
import './StreakGuard.css';

// Evening banner when today's inactivity would break the streak (loss
// aversion is the #1 retention lever — docs/research/competitors.md). Also
// fires one browser Notification per day if permission was granted.

const RECHECK_MS = 10 * 60_000;

export default function StreakGuard() {
  const { game } = useGame();
  const [dismissed, setDismissed] = useState(false);
  const [, setTick] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), RECHECK_MS);
    return () => clearInterval(id);
  }, []);

  const atRisk = streakAtRisk(game);

  useEffect(() => {
    if (atRisk) fireStreakNotification(game);
  }, [atRisk, game]);

  if (!atRisk || dismissed) return null;

  return (
    <div className="sg-banner" role="status">
      <span className="sg-flame" aria-hidden="true">
        🔥
      </span>
      <span className="sg-text">
        Your {game.streak.current}-day streak ends tonight. One session keeps
        it alive.
      </span>
      <Link to="/playground" className="sg-cta">
        Focus now
      </Link>
      <button
        type="button"
        className="sg-dismiss"
        aria-label="Dismiss reminder"
        onClick={() => setDismissed(true)}
      >
        ✕
      </button>
    </div>
  );
}
