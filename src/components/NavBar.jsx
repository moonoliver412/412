import { NavLink } from 'react-router-dom';
import { useGame } from '../state/useGame';
import './NavBar.css';

const LINKS = [
  { to: '/playground', label: 'Playground' },
  { to: '/', label: 'Home' },
  { to: '/forest', label: 'Forest' },
  { to: '/achievements', label: 'Achievements' },
  { to: '/leaderboard', label: 'Leaderboard' },
];

export default function NavBar() {
  const { game } = useGame();
  return (
    <header className="nav">
      <div className="nav-logo">
        Code<span>Sprout</span>
        <svg className="nav-leaf" viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
          <path
            d="M4 20C4 10 12 4 22 4c0 10-6 16-16 16"
            fill="#ff4500"
          />
        </svg>
      </div>

      <nav className="nav-pill">
        <NavLink to="/" className="nav-home-icon" aria-label="Home">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 11l9-8 9 8" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M5 10v10h14V10" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </NavLink>
        {LINKS.map(({ to, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              'nav-link' + (isActive ? ' nav-link--active' : '')
            }
          >
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="nav-actions">
        <span
          className="nav-stat"
          title="Sprouts — earned from lessons and focus sessions"
        >
          <svg viewBox="0 0 24 24" width="15" height="15" aria-hidden="true">
            <path
              d="M4 20C4 10 12 4 22 4c0 10-6 16-16 16"
              fill="#8fbc70"
            />
          </svg>
          {game.sprouts}
        </span>
        <span
          className={`nav-stat nav-stat--streak${
            game.streak.current > 0 ? ' is-lit' : ''
          }`}
          title={`Daily streak — longest ${game.streak.longest}`}
        >
          <svg viewBox="0 0 24 24" width="15" height="15" aria-hidden="true">
            <path
              d="M12 2c1 4-4 6-4 11a6 6 0 0 0 12 0c0-2.5-1-4.5-2.5-6-.5 2-1.5 3-2.5 3.5C16 7 14 4 12 2Z"
              fill="currentColor"
            />
          </svg>
          {game.streak.current}
        </span>
        <button className="nav-icon-btn" aria-label="Messages">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="5" width="18" height="14" rx="2" />
            <path d="M3 7l9 6 9-6" />
          </svg>
        </button>
        <button className="nav-icon-btn" aria-label="Schedule">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="4" width="18" height="17" rx="2" />
            <path d="M8 2v4M16 2v4M3 9h18" />
          </svg>
        </button>
        <button className="nav-icon-btn" aria-label="Notifications">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M6 9a6 6 0 1 1 12 0c0 5 2 6 2 6H4s2-1 2-6" strokeLinejoin="round" />
            <path d="M10 19a2 2 0 0 0 4 0" />
          </svg>
        </button>
        <div className="nav-avatar" aria-label="Profile">CS</div>
      </div>
    </header>
  );
}
