import { useMemo } from 'react';
import { findTopic } from '../data/curriculum';
import { useGame } from '../state/useGame';
import './FocusDiary.css';

// ---------------------------------------------------------------------------
// FocusDiary — Focus History panel (Phase 8).
// Heat strip: 12-week GitHub-style calendar + last 8 sessions list.
// ---------------------------------------------------------------------------

const WEEKS = 12;
const DAYS = 7; // 0=Sun … 6=Sat

/** Return 'YYYY-MM-DD' for a Date object. */
function toDateStr(d) {
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const dy = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${m}-${dy}`;
}

/** Parse 'YYYY-MM-DD' into a local-midnight Date. */
function parseDate(str) {
  const [y, m, d] = str.split('-').map(Number);
  return new Date(y, m - 1, d);
}

/** Short month name from Date. */
function monthName(d) {
  return d.toLocaleDateString('en-US', { month: 'short' });
}

/** Format a session timestamp for display. */
function fmtSessionTime(ms) {
  const d = new Date(ms);
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Build the 12×7 grid of day cells.
 * Returns { cells, monthLabels }.
 * cells[col][row] = { dateStr, finMin, abandoned, empty }
 * monthLabels = [{ col, label }]
 */
function buildHeatGrid(history, today) {
  // Anchor: the last cell is today. Align the grid so the LAST column ends
  // with today's day-of-week position.
  const todayDate = parseDate(today);
  const todayDow = todayDate.getDay(); // 0=Sun

  // Total days covered: WEEKS full columns, plus `todayDow+1` days in the
  // last partial column = WEEKS*7 cells, all ending at today.
  const totalDays = WEEKS * DAYS;
  // The grid is WEEKS columns wide, each col is a full week (Sun→Sat).
  // Column 0 is the oldest; column WEEKS-1 ends at today.

  // Build a map of dateStr → { finMin, abandoned }.
  const dayMap = {};
  for (const entry of history) {
    const ds = toDateStr(new Date(entry.at));
    if (!dayMap[ds]) dayMap[ds] = { finMin: 0, abandoned: false };
    if (entry.outcome === 'finished') {
      dayMap[ds].finMin += entry.minutes;
    } else {
      dayMap[ds].abandoned = true;
    }
  }

  // Build cells: col 0 = oldest week, col WEEKS-1 = newest week (ends today).
  // The newest column: row todayDow = today, rows after = future (empty).
  const cells = [];
  const monthLabels = [];
  let prevMonth = null;

  for (let col = 0; col < WEEKS; col++) {
    const column = [];
    for (let row = 0; row < DAYS; row++) {
      // How many days back from today is this cell?
      // column WEEKS-1, row todayDow = today (offset 0).
      const colFromEnd = WEEKS - 1 - col;
      const rowOffset = todayDow - row; // positive = row is before today's dow
      const daysBack = colFromEnd * 7 + rowOffset;

      if (daysBack < 0 || daysBack >= totalDays) {
        // Future cell or beyond range
        column.push({ dateStr: null, finMin: 0, abandoned: false, empty: true });
        continue;
      }

      const cellDate = new Date(todayDate);
      cellDate.setDate(todayDate.getDate() - daysBack);
      const ds = toDateStr(cellDate);
      const data = dayMap[ds] ?? { finMin: 0, abandoned: false };

      column.push({
        dateStr: ds,
        finMin: data.finMin,
        abandoned: data.abandoned && data.finMin === 0,
        empty: false,
      });

      // Month label on the first cell of a new month in row 0.
      if (row === 0) {
        const mn = monthName(cellDate);
        if (mn !== prevMonth) {
          monthLabels.push({ col, label: mn });
          prevMonth = mn;
        }
      }
    }
    cells.push(column);
  }

  return { cells, monthLabels };
}

/** CSS class for a heat cell based on its minutes and abandoned state. */
function heatClass(cell) {
  if (cell.empty || (!cell.finMin && !cell.abandoned)) return 'fd-cell--0';
  if (cell.abandoned) return 'fd-cell--wilt';
  if (cell.finMin < 25) return 'fd-cell--1';
  if (cell.finMin < 60) return 'fd-cell--2';
  return 'fd-cell--3';
}

/** Human-readable tooltip for a heat cell. */
function cellTitle(cell) {
  if (!cell.dateStr) return '';
  const d = parseDate(cell.dateStr);
  const label = d.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
  if (cell.abandoned) return `${label} — wilted session`;
  if (!cell.finMin) return `${label} — no focus`;
  return `${label} — ${cell.finMin} min focused`;
}

const DOW_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const DOW_SHOW = [1, 3, 5]; // Mon, Wed, Fri

export default function FocusDiary() {
  const { game } = useGame();
  const { history } = game;

  const today = useMemo(() => toDateStr(new Date()), []);

  const { cells, monthLabels } = useMemo(
    () => buildHeatGrid(history, today),
    [history, today]
  );

  // Last 8 sessions in reverse-chronological order.
  const recentSessions = useMemo(
    () => [...history].reverse().slice(0, 8),
    [history]
  );

  const isEmpty = history.length === 0;

  return (
    <section
      className="fd-panel cs-panel"
      aria-label="Focus diary"
      style={{ '--i': 0 }}
    >
      <h2 className="cs-panel-title fd-title">Focus Diary</h2>

      {/* ---- Heat strip ---- */}
      <div className="fd-heat" aria-label="12-week focus heat map">
        {/* Month labels row */}
        <div className="fd-month-row" aria-hidden="true">
          <span className="fd-dow-gutter" />
          <div className="fd-month-labels">
            {monthLabels.map(({ col, label }) => (
              <span
                key={`${col}-${label}`}
                className="fd-month-label"
                style={{ '--col': col }}
              >
                {label}
              </span>
            ))}
          </div>
        </div>

        {/* Grid body */}
        <div className="fd-grid-row">
          {/* Day-of-week gutter */}
          <div className="fd-dow-gutter" aria-hidden="true">
            {DOW_LABELS.map((lbl, i) => (
              <span key={lbl} className="fd-dow-label">
                {DOW_SHOW.includes(i) ? lbl : ''}
              </span>
            ))}
          </div>

          {/* Columns */}
          <div className="fd-grid">
            {cells.map((col, ci) =>
              col.map((cell, ri) => (
                <span
                  key={`${ci}-${ri}`}
                  className={`fd-cell ${heatClass(cell)}`}
                  style={{ '--ci': ci, '--ri': ri }}
                  title={cellTitle(cell)}
                  aria-hidden="true"
                />
              ))
            )}
          </div>
        </div>

        {/* Legend */}
        <div className="fd-legend" aria-hidden="true">
          <span className="fd-legend-label">Less</span>
          <span className="fd-cell fd-cell--0 fd-legend-cell" />
          <span className="fd-cell fd-cell--1 fd-legend-cell" />
          <span className="fd-cell fd-cell--2 fd-legend-cell" />
          <span className="fd-cell fd-cell--3 fd-legend-cell" />
          <span className="fd-legend-label">More</span>
        </div>
      </div>

      {/* ---- Session list ---- */}
      <div className="fd-sessions">
        {isEmpty ? (
          <p className="fd-empty">Your diary fills as you focus.</p>
        ) : (
          <ul className="fd-session-list" role="list">
            {recentSessions.map((entry, i) => {
              const found = findTopic(entry.topicId);
              const topicName = found ? found.topic.name : entry.topicId;
              const finished = entry.outcome === 'finished';
              return (
                <li
                  key={`${entry.at}-${i}`}
                  className="fd-session-row"
                  style={{ '--i': i }}
                >
                  <span className="fd-session-time">
                    {fmtSessionTime(entry.at)}
                  </span>
                  <span className="fd-session-topic">{topicName}</span>
                  <span className="fd-session-minutes">{entry.minutes} min</span>
                  {finished ? (
                    <span className="fd-chip fd-chip--done" aria-label="Finished">
                      <svg
                        className="fd-tick"
                        viewBox="0 0 14 14"
                        width="14"
                        height="14"
                        fill="none"
                        aria-hidden="true"
                      >
                        <polyline
                          points="2,7 5.5,11 12,3"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      Done
                    </span>
                  ) : (
                    <span className="fd-chip fd-chip--wilt" aria-label="Abandoned">
                      Wilted
                    </span>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </section>
  );
}
