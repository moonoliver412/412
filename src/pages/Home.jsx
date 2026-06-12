import { Link } from 'react-router-dom';
import { useGame } from '../state/useGame';
import { useProgress } from '../state/useProgress';
import { LANGUAGES, STAGES_PER_TOPIC } from '../data/curriculum';
import { getAchievement } from '../data/achievements';
import './Home.css';

// Home is the dashboard: a time-of-day greeting with a deep-linked
// "Continue learning" CTA, a live stat strip (streak / sprouts / XP /
// mastered trees), the daily-goal pill, the latest badges and a per-language
// forest teaser. Every number renders straight from useGame()/useProgress().

const GOAL_TARGETS = [1, 2, 4];
const ALL_TOPICS = LANGUAGES.flatMap((lang) => lang.topics);

function greetingFor(hour) {
  if (hour < 5) return 'Up late, gardener';
  if (hour < 12) return 'Good morning, gardener';
  if (hour < 18) return 'Good afternoon, gardener';
  return 'Good evening, gardener';
}

function todayStr(now = new Date()) {
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${now.getFullYear()}-${m}-${d}`;
}

/** First topic (languages in curriculum order) with growth left to lock. */
function nextActionable(progress) {
  for (const language of LANGUAGES) {
    for (const topic of language.topics) {
      const locked = progress[topic.id]?.lockedStage ?? 0;
      if (locked < STAGES_PER_TOPIC) return { language, topic, locked };
    }
  }
  return null; // the whole forest is mastered
}

function Stat({ icon, value, label }) {
  return (
    <div className="home-stat">
      <span className="home-stat-icon" aria-hidden="true">
        {icon}
      </span>
      <span className="home-stat-value">{value}</span>
      <span className="home-stat-label">{label}</span>
    </div>
  );
}

export default function Home() {
  const { game, setGoalTarget } = useGame();
  const { progress } = useProgress();

  const next = nextActionable(progress);
  const masteredCount = ALL_TOPICS.filter(
    (t) => (progress[t.id]?.lockedStage ?? 0) >= STAGES_PER_TOPIC
  ).length;

  // The stored goal only counts for today; a stale date means 0 done so far.
  const goalDone = game.goal.date === todayStr() ? game.goal.done : 0;
  const goalMet = goalDone >= game.goal.target;

  const recentBadges = Object.entries(game.achievements)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([id]) => getAchievement(id))
    .filter(Boolean);

  return (
    <main className="cs-page home">
      <section className="home-section home-hero" style={{ '--i': 0 }}>
        <h1 className="home-greeting">{greetingFor(new Date().getHours())}</h1>
        <p className="home-tagline">
          Your knowledge is alive — keep it growing.
        </p>
        <div className="home-cta-row">
          <Link
            className="home-cta"
            to={next ? `/playground?topic=${next.topic.id}` : '/forest'}
          >
            {next ? 'Continue learning' : 'Visit your forest'}
            <span className="home-cta-arrow" aria-hidden="true">
              →
            </span>
          </Link>
          <span className="home-cta-hint">
            {next
              ? `Next up: ${next.language.name} · ${next.topic.name} — lesson ${
                  next.locked + 1
                } of ${STAGES_PER_TOPIC}`
              : 'Every tree stands tall. Walk among them.'}
          </span>
        </div>
      </section>

      <section
        className="home-section home-stats cs-panel"
        style={{ '--i': 1 }}
        aria-label="Your stats"
      >
        <Stat
          icon="🔥"
          value={game.streak.current}
          label={`day streak · best ${game.streak.longest}`}
        />
        <Stat icon="🌱" value={game.sprouts} label="sprouts to spend" />
        <Stat icon="⚡" value={game.xp} label="experience" />
        <Stat
          icon="🌳"
          value={`${masteredCount}/${ALL_TOPICS.length}`}
          label="trees mastered"
        />
      </section>

      <div className="home-grid">
        <section className="home-section home-card cs-card" style={{ '--i': 2 }}>
          <h2 className="home-card-title">Daily goal</h2>
          <p className="home-goal-status" role="status">
            {goalMet
              ? 'Goal complete — the forest thanks you.'
              : `${goalDone} of ${game.goal.target} session${
                  game.goal.target === 1 ? '' : 's'
                } today`}
          </p>
          <div className="home-goal-pill" aria-hidden="true">
            {Array.from({ length: game.goal.target }, (_, i) => (
              <span
                key={i}
                className={`home-goal-seg${
                  i < goalDone
                    ? ' is-done'
                    : i === goalDone
                      ? ' is-current'
                      : ''
                }`}
              />
            ))}
          </div>
          <div
            className="home-goal-targets"
            role="group"
            aria-label="Sessions per day"
          >
            {GOAL_TARGETS.map((target) => (
              <button
                key={target}
                type="button"
                aria-pressed={game.goal.target === target}
                className={`home-goal-btn${
                  game.goal.target === target ? ' is-active' : ''
                }`}
                onClick={() => setGoalTarget(target)}
              >
                {target}
              </button>
            ))}
            <span className="home-goal-btn-label">sessions / day</span>
          </div>
        </section>

        <section className="home-section home-card cs-card" style={{ '--i': 3 }}>
          <h2 className="home-card-title">Recent badges</h2>
          {recentBadges.length > 0 ? (
            <ul className="home-badge-list">
              {recentBadges.map((badge) => (
                <li key={badge.id} className="home-badge">
                  <span className="home-badge-icon" aria-hidden="true">
                    {badge.icon}
                  </span>
                  <span className="home-badge-text">
                    <span className="home-badge-name">{badge.name}</span>
                    <span className="home-badge-blurb">{badge.blurb}</span>
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="home-badges-empty">
              Your first badge is one lesson away.
            </p>
          )}
        </section>

        <section
          className="home-section home-card cs-panel home-forest"
          style={{ '--i': 4 }}
        >
          <h2 className="cs-panel-title home-forest-title">Your forest</h2>
          {LANGUAGES.map((lang) => {
            const mastered = lang.topics.filter(
              (t) => (progress[t.id]?.lockedStage ?? 0) >= STAGES_PER_TOPIC
            ).length;
            return (
              <Link key={lang.id} to="/learn" className="home-forest-row">
                <span className="home-forest-lang">{lang.name}</span>
                <span className="home-forest-bar" aria-hidden="true">
                  <span
                    className="home-forest-fill"
                    style={{
                      width: `${(mastered / lang.topics.length) * 100}%`,
                      background: lang.color,
                    }}
                  />
                </span>
                <span className="home-forest-count">
                  {mastered}/{lang.topics.length}
                </span>
              </Link>
            );
          })}
        </section>
      </div>
    </main>
  );
}
