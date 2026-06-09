import { Link } from 'react-router-dom';
import { LANGUAGES, STAGES_PER_TOPIC } from '../data/curriculum';
import { useProgress } from '../state/useProgress';
import Tree from '../components/Tree';
import IsoTile from '../components/IsoTile';
import './Forest.css';

/** Stable small numeric seed from a topic id so each tree gets its own shape. */
function hashSeed(str) {
  let h = 0;
  for (let i = 0; i < str.length; i += 1) {
    h = (h * 31 + str.charCodeAt(i)) % 9973;
  }
  return h;
}

/** Tiles per landscape row inside a grove scene. */
const ROW_SIZE = 3;
/** Cap the depth effect so groves with many rows don't shrink into the horizon. */
const MAX_ROW_DEPTH = 2;

/** Chunk a topic list into landscape rows of up to ROW_SIZE. */
function toRows(topics) {
  const rows = [];
  for (let i = 0; i < topics.length; i += ROW_SIZE) {
    rows.push(topics.slice(i, i + ROW_SIZE));
  }
  return rows;
}

/** Small circular page badge with a tree glyph (matches the mockup title badges). */
function TreeBadge() {
  return (
    <span className="forest-badge" aria-hidden="true">
      <svg viewBox="0 0 24 24" width="26" height="26" fill="none">
        <polygon
          points="12,3 17,10 14.5,10 18.5,16 5.5,16 9.5,10 7,10"
          fill="#111"
        />
        <rect x="10.8" y="16" width="2.4" height="4.5" rx="1" fill="#111" />
      </svg>
    </span>
  );
}

/** Outlined cartoon cloud, reused for sky ambience and the wilt cloud. */
function Cloud({ className, tone = '#ffffff' }) {
  return (
    <svg className={className} viewBox="0 0 100 48" aria-hidden="true">
      <path
        d="M18 40
           C8 40 4 32 10 26
           C6 16 16 10 24 14
           C27 5 41 3 46 11
           C52 4 66 7 66 16
           C76 14 84 22 79 30
           C84 36 76 40 70 40
           Z"
        fill={tone}
        stroke="#111"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Rising golden sparkle particles for mastered trees (pure CSS animation). */
function Sparkles() {
  return (
    <span className="plot-sparkles" aria-hidden="true">
      {[0, 1, 2, 3, 4].map((i) => (
        <span key={i} className={`plot-sparkle plot-sparkle--${i}`} />
      ))}
    </span>
  );
}

/** Tiny seed mound shown on empty (stage 0) plots. */
function SeedMound() {
  return (
    <svg viewBox="0 0 64 32" width="64" height="32" aria-hidden="true">
      <ellipse
        cx="32"
        cy="22"
        rx="24"
        ry="8"
        fill="var(--soil-light)"
        stroke="#111"
        strokeWidth="1.5"
      />
      <ellipse
        cx="32"
        cy="17"
        rx="6"
        ry="7"
        fill="var(--soil-dark)"
        stroke="#111"
        strokeWidth="1.5"
      />
      <path
        d="M32 11 C32 7 35 5 38 5 C38 9 35 11 32 11 Z"
        fill="var(--grass)"
        stroke="#111"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function GrovePlot({ topic, progress, kind }) {
  const { lockedStage, wilted } = progress;
  const empty = lockedStage === 0;
  const mastered = lockedStage >= STAGES_PER_TOPIC;
  const showWilt = wilted && !empty;

  return (
    <div
      className={[
        'grove-plot',
        empty ? 'grove-plot--empty' : '',
        mastered ? 'grove-plot--mastered' : '',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <div className="grove-plot-scene">
        <IsoTile size={170} highlighted={mastered}>
          <span className="plot-stand">
            {mastered && <span className="plot-halo" aria-hidden="true" />}
            {mastered && <Sparkles />}
            {showWilt && <Cloud className="plot-wilt-cloud" tone="#aab1ae" />}
            <span className="plot-tree">
              {empty ? (
                <SeedMound />
              ) : (
                <Tree
                  stage={lockedStage}
                  wilted={wilted}
                  kind={kind}
                  size={120}
                  seed={hashSeed(topic.id)}
                />
              )}
            </span>
          </span>
        </IsoTile>
      </div>
      <div className="grove-plot-label">
        <span className="grove-plot-name">{topic.name}</span>
        {mastered ? (
          <span className="grove-mastered-pill">Mastered</span>
        ) : (
          <span className="grove-plot-progress">
            {lockedStage}/{STAGES_PER_TOPIC} lessons
            {showWilt && <em className="grove-plot-wilted"> · wilted</em>}
          </span>
        )}
      </div>
    </div>
  );
}

export default function Forest() {
  const { getTopicProgress, getTreeKind, resetAll } = useProgress();

  const topics = LANGUAGES.flatMap((lang) => lang.topics);
  const totalGrown = topics.filter(
    (t) => getTopicProgress(t.id).lockedStage >= STAGES_PER_TOPIC
  ).length;
  const totalMinutes = topics.reduce(
    (sum, t) => sum + getTopicProgress(t.id).focusMinutes,
    0
  );

  const handleReset = () => {
    if (window.confirm('Reset your whole forest? Every tree will be lost.')) {
      resetAll();
    }
  };

  return (
    <main className="cs-page forest-page">
      <h1 className="cs-page-title">
        <TreeBadge />
        Forest
      </h1>
      <p className="forest-intro">
        Your trophy landscape. Finish lessons in the{' '}
        <Link to="/playground">Playground</Link> to grow each topic&apos;s tree to
        maturity.
      </p>

      <div className="forest-summary cs-panel">
        <div className="forest-summary-stat">
          <span className="forest-summary-number">
            {totalGrown}
            <small>/{topics.length}</small>
          </span>
          <span className="forest-summary-label">Trees grown</span>
        </div>
        <span className="forest-summary-divider" aria-hidden="true" />
        <div className="forest-summary-stat">
          <span className="forest-summary-number">{totalMinutes}</span>
          <span className="forest-summary-label">Focus minutes</span>
        </div>
      </div>

      {LANGUAGES.map((lang) => {
        const grown = lang.topics.filter(
          (t) => getTopicProgress(t.id).lockedStage >= STAGES_PER_TOPIC
        ).length;
        const rows = toRows(lang.topics);
        return (
          <section key={lang.id} className="grove">
            <header className="grove-header">
              <span className="grove-header-pill cs-panel">
                <span className="grove-header-name cs-panel-title">
                  {lang.name} Grove
                </span>
                <span className="grove-header-count">
                  {grown}/{lang.topics.length} trees grown
                </span>
              </span>
            </header>
            <div
              className="grove-card cs-card"
              style={{ '--grove-accent': lang.color }}
            >
              <div className="grove-sky" aria-hidden="true">
                <Cloud className="grove-cloud grove-cloud--a" />
                <Cloud className="grove-cloud grove-cloud--b" tone="#f3f1e7" />
                <span className="grove-horizon" />
              </div>
              <div className="grove-plots">
                {rows.map((row, rowIndex) => {
                  // Depth measured from the FRONT row (the last one): the
                  // front row sits lowest/largest, rows behind it step up,
                  // shrink and layer underneath, like terraces in a landscape.
                  const depth = Math.min(
                    rows.length - 1 - rowIndex,
                    MAX_ROW_DEPTH
                  );
                  return (
                    <div
                      key={row[0].id}
                      className="grove-row"
                      style={{ '--row-depth': depth, zIndex: rowIndex + 1 }}
                    >
                      {row.map((topic) => (
                        <GrovePlot
                          key={topic.id}
                          topic={topic}
                          progress={getTopicProgress(topic.id)}
                          kind={getTreeKind(topic.id)}
                        />
                      ))}
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        );
      })}

      <div className="forest-footer">
        <button type="button" className="forest-reset" onClick={handleReset}>
          Reset forest
        </button>
      </div>
    </main>
  );
}
