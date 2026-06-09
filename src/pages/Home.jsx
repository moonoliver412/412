import { Link } from 'react-router-dom';
import './stubs.css';

export default function Home() {
  return (
    <main className="cs-page">
      <section className="home-hero cs-card">
        <h1>
          Welcome to <span className="home-hero-accent">CodeSprout</span>
        </h1>
        <p>
          Learn HTML, CSS and JavaScript one focused session at a time. Every
          topic you study grows a tree — finish all five lessons and it stands
          forever in your forest.
        </p>
        <div className="home-hero-actions">
          <Link to="/playground">
            <button type="button" className="cs-pill-btn cs-pill-btn--orange">
              Start coding
            </button>
          </Link>
          <Link to="/forest">
            <button type="button" className="cs-pill-btn">
              Visit your forest
            </button>
          </Link>
          <Link to="/learn">
            <button type="button" className="cs-pill-btn">
              Browse courses
            </button>
          </Link>
        </div>
      </section>

      <section className="home-features">
        <div className="home-feature cs-card">
          <h3>Focus sessions</h3>
          <p>
            Plant a seed, start the timer, and keep coding — your tree only
            grows while you stay focused.
          </p>
        </div>
        <div className="home-feature cs-card">
          <h3>A living forest</h3>
          <p>
            Nine topic trees across HTML, CSS and JS. Abandon a session and
            your tree wilts; finish lessons and it matures for good.
          </p>
        </div>
        <div className="home-feature cs-card">
          <h3>Friendly competition</h3>
          <p>
            Take on challenges, earn achievements and climb the leaderboard
            with other sprouts.
          </p>
        </div>
      </section>

      <section className="home-strip cs-panel">
        <h2 className="cs-panel-title">Ready to grow your first tree?</h2>
        <Link to="/playground">
          <button type="button" className="cs-pill-btn cs-pill-btn--orange">
            Open the Playground
          </button>
        </Link>
      </section>
    </main>
  );
}
