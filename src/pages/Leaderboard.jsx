import { useMemo } from 'react';
import { useGame } from '../state/useGame';
import './Leaderboard.css';

// ---- ISO week helpers ----

/** Returns the ISO week number (1-53) for a Date. */
function isoWeek(date) {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  // Set to nearest Thursday: current date + 4 - current day of week
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil((((d - yearStart) / 86_400_000) + 1) / 7);
}

/** ISO week number string "YYYY-WW" for a Date — used for stable seeding. */
function isoWeekKey(date) {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const year = d.getUTCFullYear();
  const week = isoWeek(date);
  return `${year}-${String(week).padStart(2, '0')}`;
}

/** True if `historyEntry.at` (ms) falls in the same ISO week as `date`. */
function sameIsoWeek(atMs, date) {
  const entryDate = new Date(atMs);
  return isoWeekKey(entryDate) === isoWeekKey(date);
}

// ---- Deterministic PRNG seeded by a string ----
// Simple mulberry32 seeded from a string hash.
function hashSeed(str) {
  let h = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = (Math.imul(h, 0x01000193) >>> 0);
  }
  return h;
}

function mulberry32(seed) {
  let s = seed >>> 0;
  return function () {
    s += 0x6d2b79f5;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t ^= t + Math.imul(t ^ (t >>> 7), 61 | t);
    return ((t ^ (t >>> 14)) >>> 0) / 4_294_967_296;
  };
}

// ---- Rival definitions ----

const RIVAL_HANDLES = [
  'mossrunner',
  'fern_dev',
  'oakheart',
  'willowbyte',
  'sproutcode',
  'pinegrove',
  'ivyloop',
  'thornwick',
  'cedarscript',
];

// Day-of-week index 0=Mon…6=Sun
function dayOfWeekProgress(date) {
  const dow = date.getDay(); // 0=Sun … 6=Sat
  // Map to Mon-based 0-6
  const monBased = (dow + 6) % 7;
  // Fraction of week elapsed: early Monday = 0, Saturday evening ≈ 0.9
  return Math.max(0.08, (monBased * 24 + date.getHours()) / (7 * 24));
}

/**
 * Generate 9 deterministic rivals for `weekKey` with plausible minute spreads.
 * Base minutes are seeded from (weekKey + handle) so each rival is stable all week.
 * Minutes are scaled by how far through the week we are (daily growth illusion).
 */
function generateRivals(weekKey, date) {
  const progress = dayOfWeekProgress(date);

  return RIVAL_HANDLES.map((handle) => {
    const rand = mulberry32(hashSeed(`${weekKey}:${handle}`));
    // Each rival has a full-week "pace" of 30–400 minutes, drawn from a
    // right-skewed distribution (most people cluster around 60-180).
    const tier = rand(); // 0-1 uniform
    let fullWeek;
    if (tier < 0.15) {
      fullWeek = 30 + rand() * 60;      // casual: 30–90
    } else if (tier < 0.65) {
      fullWeek = 60 + rand() * 120;     // regular: 60–180
    } else if (tier < 0.90) {
      fullWeek = 180 + rand() * 140;    // active: 180–320
    } else {
      fullWeek = 320 + rand() * 80;     // top: 320–400
    }
    const minutes = Math.round(fullWeek * progress);
    return { handle, minutes };
  });
}

const MEDALS = ['🥇', '🥈', '🥉'];
const MEDAL_CLASSES = ['is-gold', 'is-silver', 'is-bronze'];

function LeaderboardRow({ rank, handle, minutes, isYou, maxMinutes, index }) {
  const pct = maxMinutes > 0 ? (minutes / maxMinutes) * 100 : 0;
  const medalClass = rank <= 3 ? MEDAL_CLASSES[rank - 1] : '';
  const rowClass = [
    'lb-row-inner',
    isYou ? 'is-you' : '',
    medalClass,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className="lb-row" style={{ '--i': index }}>
      <div className={rowClass}>
        <div className="lb-rank">
          {rank <= 3 ? (
            <span className="lb-rank-medal" aria-label={`Rank ${rank}`}>
              {MEDALS[rank - 1]}
            </span>
          ) : (
            <span aria-label={`Rank ${rank}`}>#{rank}</span>
          )}
        </div>

        <div className="lb-handle-wrap">
          <span className="lb-handle">{handle}</span>
          {isYou && (
            <span className="lb-you-chip" aria-label="This is you">
              YOU
            </span>
          )}
        </div>

        <div className="lb-bar-wrap" aria-hidden="true">
          <div className="lb-bar-track">
            <div className="lb-bar-fill" style={{ width: `${pct}%` }} />
          </div>
        </div>

        <div className="lb-minutes">
          {minutes}
          <span style={{ fontSize: '11px', marginLeft: 3 }}>min</span>
        </div>
      </div>
    </div>
  );
}

export default function Leaderboard() {
  const { game } = useGame();

  const now = new Date();
  const weekKey = isoWeekKey(now);

  // "You" = sum of minutes from finished sessions this ISO week
  const yourMinutes = useMemo(() => {
    return (game.history ?? [])
      .filter((h) => h.outcome === 'finished' && sameIsoWeek(h.at, now))
      .reduce((sum, h) => sum + (h.minutes ?? 0), 0);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [game.history, weekKey]);

  const rivals = useMemo(
    () => generateRivals(weekKey, now),
  // eslint-disable-next-line react-hooks/exhaustive-deps
  [weekKey]
  );

  // Merge + sort descending
  const rows = useMemo(() => {
    const all = [
      { handle: 'you', minutes: yourMinutes, isYou: true },
      ...rivals.map((r) => ({ ...r, isYou: false })),
    ];
    return all.sort((a, b) => b.minutes - a.minutes);
  }, [yourMinutes, rivals]);

  const maxMinutes = rows[0]?.minutes ?? 1;
  const isEmpty = yourMinutes === 0;

  return (
    <main className="cs-page">
      <header className="lb-header">
        <h1 className="lb-title">
          <span className="lb-title-icon" aria-hidden="true">🏆</span>
          Leaderboard
        </h1>
        <p className="lb-subtitle">
          Week {isoWeek(now)} · Focus minutes ranked
        </p>
      </header>

      {isEmpty ? (
        <div className="lb-empty">
          <span className="lb-empty-icon" aria-hidden="true">🌱</span>
          <h2 className="lb-empty-title">Enter the league</h2>
          <p className="lb-empty-sub">
            Plant your first session to enter this week&apos;s league.
          </p>
        </div>
      ) : (
        <section className="lb-table" aria-label="Weekly focus ranking">
          {rows.map((row, i) => (
            <LeaderboardRow
              key={row.handle}
              rank={i + 1}
              handle={row.isYou ? 'you' : row.handle}
              minutes={row.minutes}
              isYou={row.isYou}
              maxMinutes={maxMinutes}
              index={i}
            />
          ))}
        </section>
      )}

      <p className="lb-footer-note">
        Local league — rivals are simulated until accounts arrive.
      </p>
    </main>
  );
}
