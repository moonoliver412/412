import './IsoTile.css';

// ---------------------------------------------------------------------------
// <IsoTile /> — a single detailed isometric ground tile: a mini version of
// the Playground plot (teal grass top with tufts, outlined soil block with
// sediment strata). Shared by the Forest page.
//
//   size        : rendered pixel width (height follows the 200:170 viewBox).
//   children    : bottom-center-anchored node (e.g. <Tree />) standing on the
//                 grass diamond's center.
//   highlighted : orange outline glow on the grass top.
//
// Geometry (viewBox 200×170):
//   diamond top (100,30) — right (196,79) — bottom (100,128) — left (4,79)
//   soil depth 34px; children anchor = diamond center (100,79).
// ---------------------------------------------------------------------------

const OUTLINE = {
  stroke: '#111',
  strokeWidth: 1.5,
  strokeLinejoin: 'round',
  vectorEffect: 'non-scaling-stroke',
};

const DIAMOND = '100,30 196,79 100,128 4,79';
const LEFT_FACE = '4,79 100,128 100,162 4,113';
const RIGHT_FACE = '196,79 100,128 100,162 196,113';

const TUFTS = [
  { x: 62, y: 60, flip: 1 },
  { x: 142, y: 90, flip: -1 },
  { x: 92, y: 110, flip: 1 },
  { x: 124, y: 58, flip: -1 },
  { x: 44, y: 84, flip: 1 },
  { x: 158, y: 76, flip: 1 },
];

export default function IsoTile({ size = 180, children, highlighted = false }) {
  return (
    <div className="cs-iso-tile" style={{ width: size }}>
      <svg
        className="cs-iso-tile__svg"
        viewBox="0 0 200 170"
        preserveAspectRatio="xMidYMid meet"
        aria-hidden="true"
      >
        {/* soil block with sediment strata */}
        <polygon points={LEFT_FACE} fill="var(--soil-dark, #3d2e0f)" {...OUTLINE} />
        <polygon points={RIGHT_FACE} fill="var(--soil-light, #5c400f)" {...OUTLINE} />
        <line x1="4" y1="91" x2="100" y2="140" stroke="#4f3c14" strokeWidth="1.4" opacity="0.9" vectorEffect="non-scaling-stroke" />
        <line x1="4" y1="102" x2="100" y2="151" stroke="#2e2208" strokeWidth="1.4" opacity="0.9" vectorEffect="non-scaling-stroke" />
        <line x1="196" y1="91" x2="100" y2="140" stroke="#7a5a1e" strokeWidth="1.4" opacity="0.9" vectorEffect="non-scaling-stroke" />
        <line x1="196" y1="102" x2="100" y2="151" stroke="#46300a" strokeWidth="1.4" opacity="0.9" vectorEffect="non-scaling-stroke" />
        <polygon points="150,118 159,114 165,120 160,127 152,125" fill="#7d6f55" {...OUTLINE} />
        {/* extra soil micro-detail: embedded pebble + dangling rootlet */}
        <polygon points="46,112 53,109 58,113 54,119 48,118" fill="#5d5a50" {...OUTLINE} />
        <path
          d="M72,122 q-3,8 1,14 m-1,-7 q4,3 6,7"
          fill="none"
          stroke="#8a6a33"
          strokeWidth="1.8"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />

        {/* grass top */}
        <polygon
          points={DIAMOND}
          className={`cs-iso-tile__grass${highlighted ? ' is-highlighted' : ''}`}
          fill="var(--grass, #6e8c8a)"
          {...OUTLINE}
        />

        {/* grass tufts */}
        {TUFTS.map((t, n) => (
          <path
            key={n}
            d="M-2.6,0 Q-4,-4.5 -5.6,-6.5 M0,0 Q0,-5.5 0,-8.5 M2.6,0 Q4,-4.5 5.6,-6.5"
            transform={`translate(${t.x} ${t.y}) scale(${t.flip} 1)`}
            fill="none"
            stroke={n % 2 ? '#90b2a8' : '#577771'}
            strokeWidth="1.6"
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
          />
        ))}

        {/* tiny wildflower on the lit side */}
        <g transform="translate(136 102)">
          <path d="M0,1 q0,-4 0,-6.5" stroke="#577771" strokeWidth="1.2" fill="none" vectorEffect="non-scaling-stroke" />
          {[[-2.4, -7.5], [2.4, -7.5], [0, -10], [0, -5.4]].map(([px, py], q) => (
            <circle key={q} cx={px} cy={py} r={2} fill="#f6f3ea" stroke="#111" strokeWidth="0.7" vectorEffect="non-scaling-stroke" />
          ))}
          <circle cx="0" cy="-7.5" r="1.4" fill="#e5b95e" stroke="#111" strokeWidth="0.7" vectorEffect="non-scaling-stroke" />
        </g>
      </svg>

      {/* whatever stands on the tile, feet on the diamond's center */}
      <div className="cs-iso-tile__stage">{children}</div>
    </div>
  );
}
