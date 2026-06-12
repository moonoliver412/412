import { Link } from 'react-router-dom';
import { isThirsty, needsPractice, useProgress } from '../state/useProgress';
import { LANGUAGES, STAGES_PER_TOPIC } from '../data/curriculum';
import { hasLesson } from '../data/lessons';
import './Learn.css';

// Learn is the course catalog: one black panel per language with its overall
// lesson progress, then a grid of topic cards. Card state mirrors real
// progress — mastered (amber glow), in-progress (orange edge), authored
// (normal) and unauthored "ghost" topics (Coming soon). Every card deep-links
// into the Playground with that topic selected.

const TOTAL_LESSONS = LANGUAGES.reduce(
  (n, lang) => n + lang.topics.length * STAGES_PER_TOPIC,
  0
);

function lockedFor(progress, topicId) {
  return Math.min(progress[topicId]?.lockedStage ?? 0, STAGES_PER_TOPIC);
}

function TopicCard({ topic, locked, stagger }) {
  const ghost = !hasLesson(topic.lessons[0].id);
  const mastered = locked >= STAGES_PER_TOPIC;
  const inProgress = locked > 0 && !mastered;
  const state = mastered
    ? ' is-mastered'
    : inProgress
      ? ' is-active'
      : ghost
        ? ' is-ghost'
        : '';
  const status = mastered
    ? 'Mastered'
    : inProgress
      ? `${locked}/${STAGES_PER_TOPIC} lessons`
      : ghost
        ? 'Coming soon'
        : 'Not started';

  return (
    <Link
      to={`/playground?topic=${topic.id}`}
      className={`learn-topic${state}`}
      style={{ '--i': stagger }}
    >
      <span className="learn-topic-name">{topic.name}</span>
      <span className="learn-topic-pips" aria-hidden="true">
        {Array.from({ length: STAGES_PER_TOPIC }, (_, p) => (
          <span
            key={p}
            className={`learn-pip${p < locked ? ' is-filled' : ''}`}
          />
        ))}
      </span>
      <span className="learn-topic-status">{status}</span>
    </Link>
  );
}

function LanguageSection({ language, progress, index }) {
  const totalLessons = language.topics.length * STAGES_PER_TOPIC;
  const done = language.topics.reduce(
    (n, t) => n + lockedFor(progress, t.id),
    0
  );

  return (
    <section
      className="cs-panel learn-lang learn-rise"
      style={{ '--i': index + 1 }}
      aria-label={`${language.name} course`}
    >
      <div className="learn-lang-head">
        <h2 className="cs-panel-title learn-lang-name">{language.name}</h2>
        <span className="learn-lang-count">
          {done} / {totalLessons} lessons
        </span>
      </div>
      <div className="learn-lang-bar" aria-hidden="true">
        <span
          className="learn-lang-fill"
          style={{
            width: `${(done / totalLessons) * 100}%`,
            background: language.color,
          }}
        />
      </div>
      <div className="learn-topic-grid">
        {language.topics.map((topic, i) => (
          <TopicCard
            key={topic.id}
            topic={topic}
            locked={lockedFor(progress, topic.id)}
            // 50ms sibling stagger, max 6 distinct delays (the rest land with
            // the last), offset past this section's own entrance.
            stagger={index + 2 + Math.min(i, 5)}
          />
        ))}
      </div>
    </section>
  );
}

export default function Learn() {
  const { progress, getTopicProgress } = useProgress();
  const doneLessons = LANGUAGES.reduce(
    (n, lang) =>
      n + lang.topics.reduce((m, t) => m + lockedFor(progress, t.id), 0),
    0
  );

  // Trees that need attention: thirsty mastered topics + stale in-progress
  // ones. The Playground's side panel offers Water / Practice on arrival.
  const needy = LANGUAGES.flatMap((lang) =>
    lang.topics
      .map((topic) => {
        const tp = getTopicProgress(topic.id);
        if (isThirsty(tp)) return { topic, lang, kind: 'water' };
        if (needsPractice(tp)) return { topic, lang, kind: 'practice' };
        return null;
      })
      .filter(Boolean)
  );

  return (
    <main className="cs-page learn">
      <header className="learn-head learn-rise" style={{ '--i': 0 }}>
        <h1 className="cs-page-title learn-title">Learn</h1>
        <p className="learn-sub">
          {doneLessons} of {TOTAL_LESSONS} lessons completed across{' '}
          {LANGUAGES.length} languages. Each topic is one tree in your forest.
        </p>
      </header>

      {needy.length > 0 && (
        <section
          className="cs-panel learn-tend learn-rise"
          style={{ '--i': 1 }}
          aria-label="Trees that need attention"
        >
          <div className="learn-lang-head">
            <h2 className="cs-panel-title learn-lang-name">Tend the grove</h2>
            <span className="learn-lang-count">
              {needy.length} {needy.length === 1 ? 'tree needs' : 'trees need'}{' '}
              you
            </span>
          </div>
          <div className="learn-tend-row">
            {needy.slice(0, 6).map(({ topic, lang, kind }) => (
              <Link
                key={topic.id}
                to={`/playground?topic=${topic.id}`}
                className="learn-tend-card"
              >
                <span className="learn-tend-icon" aria-hidden="true">
                  {kind === 'water' ? '💧' : '🌿'}
                </span>
                <span className="learn-tend-text">
                  <span className="learn-tend-name">{topic.name}</span>
                  <span className="learn-tend-action">
                    {kind === 'water'
                      ? `Thirsty — water it (${lang.name})`
                      : `Practice keeps it growing (${lang.name})`}
                  </span>
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {LANGUAGES.map((language, i) => (
        <LanguageSection
          key={language.id}
          language={language}
          progress={progress}
          index={i}
        />
      ))}
    </main>
  );
}
