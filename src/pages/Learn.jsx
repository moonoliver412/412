import { Link } from 'react-router-dom';
import { LANGUAGES } from '../data/curriculum';
import './stubs.css';

const CATEGORIES = [
  'Software Development',
  'Cyber Security',
  'Data Science',
  'Cloud Computing',
];

function LearnBadge() {
  return (
    <span className="stub-badge" aria-hidden="true">
      {/* open-book glyph */}
      <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="#111" strokeWidth="1.8" strokeLinejoin="round">
        <path d="M12 6c-2-1.4-4.5-2-7-2v14c2.5 0 5 .6 7 2 2-1.4 4.5-2 7-2V4c-2.5 0-5 .6-7 2Z" />
        <path d="M12 6v14" />
      </svg>
    </span>
  );
}

function CourseTreeIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
      <polygon points="12,3 17,10 14.5,10 18.5,16 5.5,16 9.5,10 7,10" fill="#111" />
      <rect x="10.9" y="16" width="2.2" height="4" rx="1" fill="#111" />
    </svg>
  );
}

export default function Learn() {
  return (
    <main className="cs-page">
      <header className="learn-header">
        <h1 className="cs-page-title">
          <LearnBadge />
          Learn
        </h1>
        <div className="learn-chips">
          {CATEGORIES.map((cat) => (
            <button key={cat} type="button" className="cs-pill-btn learn-chip">
              {cat}
            </button>
          ))}
        </div>
      </header>

      <section className="learn-featured">
        <div className="cs-card stub-placeholder">Featured course</div>
        <div className="cs-card stub-placeholder">Community pick</div>
      </section>

      <div className="learn-filter-row">
        <span className="learn-filter-label">Filter</span>
        <div className="learn-search">⌕</div>
        <div className="learn-filter-links">
          <Link to="/learn">Messages</Link>
          <span className="learn-filter-active">Languages</span>
          <Link to="/challenges">Challenges</Link>
        </div>
      </div>

      <section className="learn-courses cs-panel">
        {LANGUAGES.map((lang) => (
          <Link key={lang.id} to="/playground" className="learn-course">
            <div className="learn-course-body">
              <span className="learn-course-icon">
                <CourseTreeIcon />
              </span>
              <span className="learn-course-name">{lang.name}</span>
            </div>
            <div className="learn-course-footer">
              <span>Free</span>
              <span>
                {lang.topics.reduce((n, t) => n + t.lessons.length, 0)} lessons
              </span>
            </div>
          </Link>
        ))}
      </section>
    </main>
  );
}
