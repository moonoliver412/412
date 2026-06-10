import { useId, useMemo, useState } from 'react';
import './IsometricPlot.css';

// ---------------------------------------------------------------------------
// <IsometricPlot /> — the slide-2 terrain: a rounded light-gray "sky" card
// holding an isometric K×K farm-grid plot (teal grass on a brown soil
// cross-section), with ambient drifting clouds and a sun.
//
//   slots : array of { id, content, caption, sub, highlighted, onClick }
//           content (a bottom-center-anchored node, e.g. <Tree />) stands on
//           the center of its grid cell. The grid is ADAPTIVE:
//           K = max(3, ceil(sqrt(slots.length))) cells per side, and slots
//           are placed on a deterministic staggered (orchard-style) pattern
//           so trees spread across the plot instead of forming one line and
//           never badly hide each other. Slots render back-to-front
//           (sorted by screen Y) with increasing z-index.
//   width : max rendered width in px; scales down responsively below it.
//   label : optional string shown in a small pill badge, top-right.
//
// Ground geometry (viewBox 880×560):
//   diamond top (440,220) — right (880,365) — bottom (440,510) — left (0,365)
//   iso(u,v): u runs top→right edge, v runs top→left edge, both 0..1.
// ---------------------------------------------------------------------------

const W = 880;
const H = 560;
const CX = 440; // diamond center x
const HW = 440; // diamond half-width
const HH = 145; // diamond half-height
const TOP_Y = 220; // diamond top vertex y

const OUTLINE = {
  stroke: '#111',
  strokeWidth: 1.5,
  strokeLinejoin: 'round',
  vectorEffect: 'non-scaling-stroke',
};

/** Map iso grid coords (u along the right axis, v along the left axis) to px. */
function iso(u, v) {
  return [CX + (u - v) * HW, TOP_Y + (u + v) * HH];
}

function pts(list) {
  return list.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(' ');
}

function cellPoints(i, j, K) {
  return pts([
    iso(i / K, j / K),
    iso((i + 1) / K, j / K),
    iso((i + 1) / K, (j + 1) / K),
    iso(i / K, (j + 1) / K),
  ]);
}

// --- slot placement ---------------------------------------------------------
// Deterministic staggered pattern. For n ≤ K everything sits on the classic
// middle iso row (back-left → front-right diagonal). For n > K, slots are
// spread across rows back-to-front with balanced per-row counts, and odd
// rows are offset by half a column gap — orchard planting — so trees never
// line up in a single straight file or stand directly behind one another.

/** Pick `c` well-spread columns in 0..K-1; odd rows get a half-gap stagger. */
function rowCols(c, K, stagger) {
  if (c >= K) return Array.from({ length: K }, (_, i) => i);
  const used = new Set();
  const place = (p) => {
    let col = Math.max(0, Math.min(K - 1, Math.round(p)));
    while (used.has(col)) col = (col + 1) % K; // dedupe after clamping
    used.add(col);
    return col;
  };
  if (c === 1) return [place((K - 1) / 2 + (stagger ? 0.5 : 0))];
  const gap = (K - 1) / (c - 1);
  return Array.from({ length: c }, (_, t) =>
    place(t * gap + (stagger ? gap / 2 : 0))
  );
}

/** Cells (i = right axis, j = left axis) for n slots on a K×K grid. */
function computeCells(n, K) {
  if (n <= 0) return [];
  if (n <= K) {
    // Classic look: the middle row's diagonal, centered (1 slot → center cell).
    const j = Math.floor((K - 1) / 2);
    return rowCols(n, K, false).map((i) => ({ i, j }));
  }
  const cells = [];
  for (let j = 0; j < K; j++) {
    // Balanced row counts: row j gets the t's with floor(t·K/n) === j.
    const c = Math.ceil(((j + 1) * n) / K) - Math.ceil((j * n) / K);
    for (const i of rowCols(c, K, j % 2 === 1)) cells.push({ i, j });
  }
  return cells;
}

// --- deterministic scatter (same terrain for a given occupancy) -------------
function makeRng(seed) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

const GRASS_TONES = ['#577771', '#90b2a8'];

const TUFT_SMALL = 'M-3,0 Q-4.5,-5 -6.5,-7.5 M0,0 Q0,-6.5 0,-10 M3,0 Q4.5,-5 6.5,-7.5';
const TUFT_BIG =
  'M-4,0 Q-6,-6 -9,-8 M-1.8,0 Q-2.6,-8 -3.6,-12 M0.6,0 Q0.6,-9 0.6,-13 M2.6,0 Q3.6,-8 5,-11 M4.8,0 Q7,-5.5 9.5,-7';

const FLOWER_TONES = [
  { petal: '#f6f3ea', heart: '#e5b95e' },
  { petal: '#ffd98a', heart: '#d9744a' },
  { petal: '#ff9d73', heart: '#7a3014' },
];

/** Tufts/flowers/pebbles scattered on UNOCCUPIED cells only (seeded). */
function makeScatter(K, occupied) {
  const rand = makeRng(20260609 ^ Math.imul(K, 2654435761));
  const isFree = (u, v) => {
    const i = Math.min(K - 1, Math.floor(u * K));
    const j = Math.min(K - 1, Math.floor(v * K));
    return !occupied.has(`${i},${j}`);
  };
  const sample = (count, make) => {
    const out = [];
    let guard = 0;
    while (out.length < count && guard++ < count * 60) {
      const u = 0.05 + rand() * 0.9;
      const v = 0.05 + rand() * 0.9;
      if (!isFree(u, v)) continue;
      out.push(make(u, v));
    }
    return out;
  };
  const tufts = sample(34, (u, v) => ({
    p: iso(u, v),
    big: rand() > 0.55,
    tone: rand() > 0.5 ? 1 : 0,
  }));
  const flowers = sample(8, (u, v) => ({
    p: iso(u, v),
    ...FLOWER_TONES[Math.floor(rand() * FLOWER_TONES.length) % FLOWER_TONES.length],
  }));
  const pebbles = sample(4, (u, v) => ({
    p: iso(u, v),
    rx: 4.5 + rand() * 3,
    ry: 2.8 + rand() * 1.6,
  }));
  return { tufts, flowers, pebbles };
}

// Worn dirt patch spots (u,v) — skipped when a tree occupies any of them.
const PATCH_SPOTS = [
  [0.52, 0.84],
  [0.66, 0.76],
  [0.4, 0.78],
];

function Cloud({ className }) {
  return (
    <svg className={className} viewBox="0 0 130 56" aria-hidden="true">
      <path
        d="M18 44 a13 13 0 0 1 -1 -26 a18 18 0 0 1 34 -8 a15 15 0 0 1 27 3 a13 13 0 0 1 9 31 z"
        fill="#f3f1ea"
        stroke="#111"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function IsometricPlot({ slots = [], width = 880, label }) {
  const uid = useId();
  const K = Math.max(3, Math.ceil(Math.sqrt(Math.max(slots.length, 1))));
  const n = Math.min(slots.length, K * K);
  const shown = slots.slice(0, n);

  const cells = useMemo(() => computeCells(n, K), [n, K]);
  const occupied = useMemo(
    () => new Set(cells.map((c) => `${c.i},${c.j}`)),
    [cells]
  );
  const scatter = useMemo(() => makeScatter(K, occupied), [K, occupied]);

  // Free cells stay PURE GRASS — every cell is a tree or a future tree.
  // (Pond/bench/rock props removed by user request: "I want it to all be trees.")

  // Pair each slot with its cell + screen anchor; render back-to-front.
  // Anchors get a small deterministic jitter so the planting reads organic,
  // not parking-lot — clicks still go to the (unjittered) cell polygon.
  const placed = shown.map((s, idx) => {
    const cell = cells[idx];
    let [x, y] = iso((cell.i + 0.5) / K, (cell.j + 0.5) / K);
    let h = 2166136261;
    const id = String(s.id ?? idx);
    for (let c = 0; c < id.length; c++) h = Math.imul(h ^ id.charCodeAt(c), 16777619);
    x += (((h >>> 8) % 100) / 100 - 0.5) * (HW / K) * 0.22;
    y += (((h >>> 16) % 100) / 100 - 0.5) * (HH / K) * 0.3;
    return { slot: s, cell, x, y, key: s.id ?? idx };
  });
  const byDepth = [...placed].sort((a, b) => a.y - b.y);
  // Depth cue: trees farther back render smaller, nearer larger.
  const ys = placed.map((p) => p.y);
  const yMin = Math.min(...ys), ySpan = Math.max(...ys) - yMin || 1;
  const depthScale = (y) => 0.86 + ((y - yMin) / ySpan) * 0.22;

  const showPatch = PATCH_SPOTS.every(
    ([u, v]) => !occupied.has(`${Math.floor(u * K)},${Math.floor(v * K)}`)
  );

  // Labels are hover-revealed tooltips, not permanent pills — hover state is
  // driven from the cell polygon, the tree's painted pixels, and the label.
  const [hoveredId, setHoveredId] = useState(null);
  const hoverProps = (key) => ({
    onMouseEnter: () => setHoveredId(key),
    onMouseLeave: () => setHoveredId((h) => (h === key ? null : h)),
  });

  const clipLeftId = `${uid}-soil-left`;
  const clipRightId = `${uid}-soil-right`;

  const leftFace = pts([[0, 365], [440, 510], [440, H], [0, H]]);
  const rightFace = pts([[880, 365], [440, 510], [440, H], [880, H]]);
  const diamond = pts([iso(0, 0), iso(1, 0), iso(1, 1), iso(0, 1)]);

  return (
    <div
      className={`cs-iso-plot${K > 3 ? ' cs-iso-plot--dense' : ''}`}
      style={{ maxWidth: width }}
    >
      {/* ambient sky: sun, distant hills, drifting clouds, pollen motes */}
      <div className="cs-iso-plot__sky" aria-hidden="true">
        <div className="cs-iso-sun" />
        {/* two hazy rolling-hill silhouettes peeking above the terrain */}
        <svg className="cs-iso-hills cs-iso-hills--far" viewBox="0 0 880 130" preserveAspectRatio="none">
          <path
            d="M0,130 L0,84 Q90,38 215,66 Q330,90 440,52 Q560,14 680,58 Q790,92 880,62 L880,130 Z"
            fill="#aebfae"
          />
        </svg>
        <svg className="cs-iso-hills cs-iso-hills--near" viewBox="0 0 880 110" preserveAspectRatio="none">
          <path
            d="M0,110 L0,72 Q120,30 260,64 Q400,96 540,58 Q700,18 880,74 L880,110 Z"
            fill="#9cb29b"
          />
        </svg>
        <Cloud className="cs-iso-cloud cs-iso-cloud--1" />
        <Cloud className="cs-iso-cloud cs-iso-cloud--2" />
        <Cloud className="cs-iso-cloud cs-iso-cloud--3" />
        {/* pollen motes drifting through the sun's light */}
        <span className="cs-iso-pollen">
          {Array.from({ length: 8 }, (_, m) => (
            <i key={m} className="cs-iso-mote" />
          ))}
        </span>
      </div>

      <svg
        className="cs-iso-plot__ground"
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="xMidYMid meet"
        aria-hidden="true"
      >
        <defs>
          <clipPath id={clipLeftId}>
            <polygon points={leftFace} />
          </clipPath>
          <clipPath id={clipRightId}>
            <polygon points={rightFace} />
          </clipPath>
        </defs>

        {/* ---- soil cross-section: faces, strata, rocks, roots ---- */}
        <polygon points={leftFace} fill="var(--soil-dark, #3d2e0f)" {...OUTLINE} />
        <polygon points={rightFace} fill="var(--soil-light, #5c400f)" {...OUTLINE} />

        <g clipPath={`url(#${clipLeftId})`}>
          {/* sediment strata following the face slope */}
          {[16, 32, 50, 70].map((d, k) => (
            <path
              key={d}
              d={`M0,${365 + d} q110,${78 + (k % 2 ? 7 : -6)} 220,72.5 t220,72.5`}
              fill="none"
              stroke={k % 2 ? '#2e2208' : '#4f3c14'}
              strokeWidth={1.5}
              opacity={0.9}
              vectorEffect="non-scaling-stroke"
            />
          ))}
          {/* embedded rocks */}
          <polygon points="118,432 134,427 144,436 138,447 122,446" fill="#5d5a50" {...OUTLINE} />
          <polygon points="305,505 318,500 327,508 320,517 308,515" fill="#6a6759" {...OUTLINE} />
          {/* dangling root */}
          <path
            d="M210,435 q-7,18 1,32 q7,13 -3,26 m2,-26 q10,6 14,15"
            fill="none"
            stroke="#8a6a33"
            strokeWidth={2.5}
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
          />
        </g>

        <g clipPath={`url(#${clipRightId})`}>
          {[14, 30, 48, 68].map((d, k) => (
            <path
              key={d}
              d={`M880,${365 + d} q-110,${78 + (k % 2 ? -6 : 7)} -220,72.5 t-220,72.5`}
              fill="none"
              stroke={k % 2 ? '#7a5a1e' : '#46300a'}
              strokeWidth={1.5}
              opacity={0.9}
              vectorEffect="non-scaling-stroke"
            />
          ))}
          <polygon points="640,470 657,464 668,473 661,485 645,483" fill="#7d6f55" {...OUTLINE} />
          <path
            d="M700,422 q9,16 2,30 q-6,12 4,24"
            fill="none"
            stroke="#8a6a33"
            strokeWidth={2.5}
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
          />
        </g>

        {/* ---- grass top: base, checker shading, worn patch, grid ---- */}
        <polygon points={diamond} fill="var(--grass, #6e8c8a)" {...OUTLINE} />

        {/* grass overhang lip over the soil cliff + hanging blades */}
        <path
          d={`M0,365 L440,510 L880,365 L880,372 Q662,448 446,519 L440,521 L434,519 Q218,448 0,372 Z`}
          fill="#5d7a76"
          opacity="0.95"
        />
        {[
          [118, 412, -1], [236, 451, 1], [352, 489, -1],
          [528, 489, 1], [644, 451, -1], [762, 412, 1],
        ].map(([hx, hy, flip], m) => (
          <path
            key={m}
            d="M0,0 q1.5,7 0.5,13 M3.5,1 q2,6 1,11 M-3,1 q-2,6 -1.5,10"
            transform={`translate(${hx} ${hy}) scale(${flip} 1)`}
            fill="none"
            stroke="#5d7a76"
            strokeWidth={2}
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
          />
        ))}

        {Array.from({ length: K * K }, (_, m) => {
          const i = m % K;
          const j = Math.floor(m / K);
          if ((i + j) % 2 === 0) return null;
          return (
            <polygon
              key={m}
              points={cellPoints(i, j, K)}
              fill="#7b9894"
              opacity={0.26}
            />
          );
        })}

        {/* wooden fence along the two BACK edges (gap left mid-edge) */}
        {(() => {
          const posts = [];
          const rails = [];
          for (const side of [0, 1]) {
            // side 0: top vertex → left corner (v axis); side 1: → right corner
            const pts = [0.12, 0.3, 0.48, 0.84].map((t) =>
              side === 0 ? iso(0.02, t) : iso(t, 0.02)
            ); // 0.48→0.84 skips one slot = the gap
            posts.push(...pts);
            for (const [a, b] of [[0, 1], [1, 2], [2, 3]]) {
              if (a === 2) continue; // the gap
              rails.push([pts[a], pts[b]]);
            }
          }
          return (
            <g>
              {rails.map(([p, q], m) => (
                <g key={`r${m}`}>
                  <line x1={p[0]} y1={p[1] - 19} x2={q[0]} y2={q[1] - 19} stroke="#7a5634" strokeWidth={3.5} vectorEffect="non-scaling-stroke" />
                  <line x1={p[0]} y1={p[1] - 11} x2={q[0]} y2={q[1] - 11} stroke="#6b4a2b" strokeWidth={3.5} vectorEffect="non-scaling-stroke" />
                </g>
              ))}
              {posts.map(([px, py], m) => (
                <g key={`p${m}`}>
                  <rect x={px - 2.6} y={py - 26} width={5.2} height={27} rx={1.5} fill="#8a6a3e" stroke="#111" strokeWidth={1.2} vectorEffect="non-scaling-stroke" />
                  <ellipse cx={px} cy={py + 1.5} rx={5} ry={2} fill="rgba(0,0,0,0.18)" />
                </g>
              ))}
            </g>
          );
        })()}

        {/* worn dirt patch near the front edge — only when no tree stands there */}
        {showPatch && (
          <g opacity={0.92}>
            <ellipse
              cx={iso(0.52, 0.84)[0]}
              cy={iso(0.52, 0.84)[1]}
              rx={62}
              ry={20}
              fill="#97875c"
              stroke="#6f6140"
              strokeWidth={1}
              vectorEffect="non-scaling-stroke"
            />
            <ellipse cx={iso(0.66, 0.76)[0]} cy={iso(0.66, 0.76)[1]} rx={15} ry={5.5} fill="#97875c" />
            <ellipse cx={iso(0.4, 0.78)[0]} cy={iso(0.4, 0.78)[1]} rx={11} ry={4.5} fill="#97875c" />
          </g>
        )}

        {/* iso grid lines along both axes */}
        {Array.from({ length: K - 1 }, (_, m) => m + 1).map((k) => (
          <line
            key={`u${k}`}
            x1={iso(k / K, 0)[0]}
            y1={iso(k / K, 0)[1]}
            x2={iso(k / K, 1)[0]}
            y2={iso(k / K, 1)[1]}
            stroke="#9fbcb7"
            strokeWidth={1.1}
            opacity={0.32}
            vectorEffect="non-scaling-stroke"
          />
        ))}
        {Array.from({ length: K - 1 }, (_, m) => m + 1).map((k) => (
          <line
            key={`v${k}`}
            x1={iso(0, k / K)[0]}
            y1={iso(0, k / K)[1]}
            x2={iso(1, k / K)[0]}
            y2={iso(1, k / K)[1]}
            stroke="#9fbcb7"
            strokeWidth={1.1}
            opacity={0.32}
            vectorEffect="non-scaling-stroke"
          />
        ))}

        {/* slot cell highlights / click targets */}
        {placed.map(({ slot: s, cell, key }) => (
          <polygon
            key={key}
            points={cellPoints(cell.i, cell.j, K)}
            className={`cs-iso-cell${s.highlighted ? ' is-highlighted' : ''}${
              s.onClick ? ' is-clickable' : ''
            }`}
            onClick={s.onClick}
            {...hoverProps(key)}
          />
        ))}

        {/* grass detail scatter: tufts, wildflowers, pebbles (free cells only).
            Outer g carries the position (attribute transform); the inner path
            takes the CSS gust skew so the two transforms don't fight. */}
        {scatter.tufts.map((t, m) => (
          <g key={m} transform={`translate(${t.p[0].toFixed(1)} ${t.p[1].toFixed(1)})`}>
            <path
              className="cs-iso-tuft"
              d={t.big ? TUFT_BIG : TUFT_SMALL}
              fill="none"
              stroke={GRASS_TONES[t.tone]}
              strokeWidth={1.7}
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
            />
          </g>
        ))}
        {scatter.flowers.map((f, m) => (
          <g key={m} transform={`translate(${f.p[0].toFixed(1)} ${f.p[1].toFixed(1)})`}>
            <path d="M0,1 q0,-5 0,-8" stroke="#577771" strokeWidth={1.4} fill="none" vectorEffect="non-scaling-stroke" />
            {[[-3.1, -9], [3.1, -9], [0, -12], [0, -6.2]].map(([px, py], q) => (
              <circle key={q} cx={px} cy={py} r={2.5} fill={f.petal} stroke="#111" strokeWidth={0.8} vectorEffect="non-scaling-stroke" />
            ))}
            <circle cx={0} cy={-9} r={1.7} fill={f.heart} stroke="#111" strokeWidth={0.8} vectorEffect="non-scaling-stroke" />
          </g>
        ))}
        {scatter.pebbles.map((pb, m) => (
          <g key={m}>
            <ellipse cx={pb.p[0]} cy={pb.p[1]} rx={pb.rx} ry={pb.ry} fill="#b6b0a2" stroke="#111" strokeWidth={1.2} vectorEffect="non-scaling-stroke" />
            <ellipse cx={pb.p[0] - pb.rx * 0.3} cy={pb.p[1] - pb.ry * 0.35} rx={pb.rx * 0.35} ry={pb.ry * 0.35} fill="#d3cebf" />
          </g>
        ))}


        {/* stepping-stone path meandering in from the front vertex */}
        {[0.86, 0.78, 0.7, 0.62, 0.55, 0.485].map((t, m) => {
          const wob = m % 2 ? 0.045 : -0.045;
          const [sx, sy] = iso(t + wob, t - wob);
          return (
            <g key={m}>
              <ellipse cx={sx} cy={sy} rx={11 - m * 0.8} ry={5 - m * 0.3} fill="#b6b0a2" stroke="#74705f" strokeWidth={1.2} vectorEffect="non-scaling-stroke" />
              <ellipse cx={sx - 3} cy={sy - 1.4} rx={(11 - m * 0.8) * 0.4} ry={(5 - m * 0.3) * 0.4} fill="#d3cebf" />
            </g>
          );
        })}



        {/* crisp diamond rim back on top of the details */}
        <polygon points={diamond} fill="none" {...OUTLINE} />

        {/* signpost near the front-left corner showing the plot label */}
        {label != null && label !== '' && (() => {
          const [gx, gy] = iso(0.16, 0.78);
          return (
            <g transform={`translate(${gx} ${gy})`}>
              <ellipse cx={0} cy={3} rx={9} ry={3.4} fill="rgba(0,0,0,0.16)" />
              <rect x={-3} y={-46} width={6} height={49} rx={1.8} fill="#8a6a3e" stroke="#111" strokeWidth={1.3} vectorEffect="non-scaling-stroke" />
              <g>
                <path
                  d="M-34,-46 L30,-46 L42,-36 L30,-26 L-34,-26 Q-39,-26 -39,-31 L-39,-41 Q-39,-46 -34,-46 Z"
                  fill="#9a7544"
                  stroke="#111"
                  strokeWidth={1.4}
                  vectorEffect="non-scaling-stroke"
                />
                <text
                  x={-1}
                  y={-31.5}
                  textAnchor="middle"
                  fontFamily="var(--font-display, 'Oswald', sans-serif)"
                  fontSize="14"
                  fontWeight="600"
                  letterSpacing="1"
                  fill="#f6f3ea"
                >
                  {String(label).toUpperCase()}
                </text>
              </g>
            </g>
          );
        })()}
      </svg>

      {/* slot contents standing on their cells, back-to-front (sorted by Y) */}
      <div className="cs-iso-plot__slots">
        {byDepth.map(({ slot: s, x, y, key }, order) => {
          const Stand = s.onClick ? 'button' : 'div';
          return (
            <div
              key={key}
              className="cs-iso-plot__slot"
              style={{
                left: `${((x / W) * 100).toFixed(3)}%`,
                bottom: `${(((H - y) / H) * 100).toFixed(3)}%`,
                transform: `translateX(-50%) scale(${depthScale(y).toFixed(3)})`,
                transformOrigin: '50% 100%',
                // Selected slot jumps in front so its label/tree never hide
                // behind a taller foreground neighbour.
                zIndex: order + 1 + (s.highlighted ? n : 0),
              }}
            >
              <Stand
                type={s.onClick ? 'button' : undefined}
                className={`cs-iso-slot__stand${s.onClick ? ' is-clickable' : ''}`}
                onClick={s.onClick}
                aria-pressed={s.onClick ? !!s.highlighted : undefined}
                aria-label={s.onClick && s.caption ? `Select ${s.caption}` : undefined}
                {...hoverProps(key)}
              >
                {s.content}
              </Stand>
              {(s.caption || s.sub) && (() => {
                // Hover-revealed minimalist tooltip (also shown on keyboard
                // focus via :focus-within). Clickable slots keep it as a
                // button so it remains a reliable click target while shown.
                const Label = s.onClick ? 'button' : 'div';
                return (
                  <Label
                    type={s.onClick ? 'button' : undefined}
                    onClick={s.onClick}
                    tabIndex={s.onClick ? -1 : undefined}
                    className={`cs-iso-slot__label${s.highlighted ? ' is-highlighted' : ''}${
                      hoveredId === key ? ' is-visible' : ''
                    }`}
                    {...hoverProps(key)}
                  >
                    {s.caption && <span className="cs-iso-slot__caption">{s.caption}</span>}
                    {s.sub && <span className="cs-iso-slot__sub">{s.sub}</span>}
                  </Label>
                );
              })()}
            </div>
          );
        })}
      </div>

      {/* ambient life above the terrain: butterflies, bee, bird flyby */}
      <div className="cs-iso-plot__life" aria-hidden="true">
        <span className="cs-iso-butterfly cs-iso-butterfly--1">
          <i className="cs-iso-wing cs-iso-wing--l" />
          <i className="cs-iso-wing cs-iso-wing--r" />
          <i className="cs-iso-body" />
        </span>
        <span className="cs-iso-butterfly cs-iso-butterfly--2">
          <i className="cs-iso-wing cs-iso-wing--l" />
          <i className="cs-iso-wing cs-iso-wing--r" />
          <i className="cs-iso-body" />
        </span>
        <span className="cs-iso-bee">
          <i className="cs-iso-bee-wing" />
          <i className="cs-iso-bee-body" />
        </span>
        <svg className="cs-iso-bird" viewBox="0 0 28 14" aria-hidden="true">
          <path className="cs-iso-bird-wings" d="M1,9 Q7,1 14,8 Q21,1 27,9" fill="none" stroke="#2c2c2c" strokeWidth="2.2" strokeLinecap="round" />
        </svg>
      </div>
    </div>
  );
}
