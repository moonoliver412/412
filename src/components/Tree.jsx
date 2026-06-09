import { memo, useId, useMemo } from 'react';
import './Tree.css';

// ---------------------------------------------------------------------------
// <Tree /> — high-detail procedural SVG tree for the Forest mechanic.
//
//   stage  : float 0–5, continuous. Growth is STRUCTURAL: seed → cotyledon
//            sprout → seedling → sapling (first branches) → young tree →
//            mature celebration (fruit, glow, sparkles).
//   wilted : drooping branches, brown-olive foliage, fallen leaves, no sway.
//   kind   : 'oak' | 'birch' | 'pine' | 'maple' | 'willow' (unknown → oak)
//   size   : rendered pixel width (height = size * 1.25).
//   seed   : optional number — deterministic per-instance shape variation.
//
// All geometry (branches, lobed clusters / conifer tiers, bark, fruit,
// sparkles) is generated ONCE per (kind, seed) with a seeded PRNG inside
// useMemo, so the per-second growth ticks only update stage-driven transforms.
//
// Species notes (matched to the user's reference art):
//   maple : autumn fire — deep-red shadow clusters low/outside, scarlet and
//           vivid-orange mids, golden crown last; dark branches in the gaps.
//   oak   : bold-outlined cartoon clouds in 3 greens on a forked caramel
//           trunk; stage-5 acorns dangle below cluster edges.
//   pine  : flat tall conifer — 13 drooping speckled swag tiers with feathered
//           needle-fan undersides + pointed crown/leader, bare trunk + tuft.
//
// Detail-density pass (trees now render 92–200px): ~1.6× leaf scatter, a
// second finer rim-highlight pass on the lit side, two-tone micro dabs inside
// the biggest clusters, extra bark strokes/knots, limb underside shading,
// and an extra soft shadow layer per canopy. New elements keep births inside
// 2.4–4.9 so density still builds gradually, and all of them wilt/sway with
// their depth layer.
//
// Bottom-center anchored at (120, 292) in a 240x300 viewBox.
// ---------------------------------------------------------------------------

const VIEW_W = 240;
const VIEW_H = 300;
const CX = 120;
const GROUND_Y = 292;

const clamp = (v, lo, hi) => Math.min(Math.max(v, lo), hi);
const lerp = (a, b, t) => a + (b - a) * t;
const R = (v) => Math.round(v * 10) / 10; // compact path numbers

// Deterministic PRNG — geometry must NEVER re-randomize between renders.
function mulberry32(a) {
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function mix(h1, h2, t) {
  const a = parseInt(h1.slice(1), 16);
  const b = parseInt(h2.slice(1), 16);
  const ch = (sh) => Math.round(lerp((a >> sh) & 255, (b >> sh) & 255, t));
  return `#${((ch(16) << 16) | (ch(8) << 8) | ch(0)).toString(16).padStart(6, '0')}`;
}

// Bold-outline look on PRIMARY silhouettes only (trunk, canopy silhouette).
const OUTLINE = {
  stroke: '#111',
  strokeWidth: 1.5,
  strokeLinejoin: 'round',
  strokeLinecap: 'round',
  vectorEffect: 'non-scaling-stroke',
};

const GOLD = '#e5b95e';
const WILT_LEAF = '#9a8f6a';
const WILT_TRUNK = '#6f6552';
const WILT_BIRCH_TRUNK = '#c9c2ac';
const wiltLeaf = (c) => mix(c, WILT_LEAF, 0.78);

const KINDS = {
  // oak: classic cartoon — lime tops / kelly mid / dark undersides, caramel trunk
  oak: { seed: 11, trunk: '#b07a3a', trunkDk: '#8a5a26', back: '#2e7a2c', mid: '#55a437', front: '#8dc63f', rim: '#b4e36a' },
  birch: { seed: 23, trunk: '#ece6d6', trunkDk: '#b9b29c', back: '#7c9551', mid: '#9fb86a', front: '#bccd85', rim: '#e0e4a6' },
  // pine: flat modern conifer — dark forest + olive tiers, pale speckles (rim)
  pine: { seed: 37, trunk: '#6b4f33', trunkDk: '#8f7250', back: '#334f39', mid: '#5f7d52', front: '#6f8f5e', rim: '#a8bc8e' },
  // maple: fiery autumn — deep red shadows → scarlet → orange → golden crown
  maple: { seed: 53, trunk: '#7d4633', trunkDk: '#54301f', back: '#9b2a1a', mid: '#d8492b', front: '#ef7c2a', rim: '#f6b73c' },
  willow: { seed: 71, trunk: '#71543a', trunkDk: '#573f28', back: '#577646', mid: '#7da064', front: '#98b97c', rim: '#bfd59b' },
};

// --- real leaf silhouettes (instanced via <defs>/<use>) ---------------------
// Each path is drawn at the origin: stem base at (0,0), tip pointing up (-y),
// ~10–16 units long. A second open subpath is the center vein / stem, which
// renders through the def-level stroke. Leaves carry NO fill of their own —
// they inherit fill from their tonal band group, so wilting and band tones
// are single group-level fill swaps instead of 300 per-leaf updates.

// Pine "leaf" = a needle BUNDLE: n thin filled wedges fanning downward.
function needleBundle(n, len, spreadDeg) {
  let d = '';
  for (let i = 0; i < n; i++) {
    const a = ((i / (n - 1) - 0.5) * spreadDeg * Math.PI) / 180 + Math.PI / 2;
    const ca = Math.cos(a), sa = Math.sin(a);
    const bw2 = 0.5, tw2 = 0.14; // base / tip half-widths
    d += `M ${R(-sa * bw2)} ${R(ca * bw2)} L ${R(ca * len - sa * tw2)} ${R(sa * len + ca * tw2)} L ${R(ca * len + sa * tw2)} ${R(sa * len - ca * tw2)} L ${R(sa * bw2)} ${R(-ca * bw2)} Z `;
  }
  return d.trim();
}

const LEAF_PATHS = {
  // maple: 5-lobed pointed star leaves (3 variants: classic / broad / slim)
  maple: [
    'M 0 0 L -1.2 -0.6 L -3.8 0.9 L -3 -2.4 L -7 -3.8 L -3.4 -5 L -4.8 -8.6 L -1.6 -7 L 0 -11 L 1.6 -7 L 4.8 -8.6 L 3.4 -5 L 7 -3.8 L 3 -2.4 L 3.8 0.9 L 1.2 -0.6 Z M 0 2.6 L 0 -9.2',
    'M 0 0 L -1.4 -0.4 L -4.4 1.2 L -3.2 -2 L -7.6 -3 L -3.8 -4.6 L -5.6 -7.8 L -2 -6.6 L 0 -10 L 2 -6.6 L 5.6 -7.8 L 3.8 -4.6 L 7.6 -3 L 3.2 -2 L 4.4 1.2 L 1.4 -0.4 Z M 0 2.4 L 0 -8.4',
    'M 0 0 L -1 -0.8 L -3.2 0.4 L -2.6 -2.6 L -6 -4.2 L -3 -5.2 L -4 -8.8 L -1.4 -7.2 L 0 -11.8 L 1.4 -7.2 L 4 -8.8 L 3 -5.2 L 6 -4.2 L 2.6 -2.6 L 3.2 0.4 L 1 -0.8 Z M 0 2.6 L 0 -9.8',
  ],
  // oak: round-lobed oblong leaves, 4–5 soft lobes per side
  oak: [
    'M 0 2.4 L 0 0.6 C 1.5 0.7 2.6 0 2.5 -1.2 C 4.1 -1.3 4.7 -2.6 3.6 -3.5 C 5.2 -4 5.4 -5.6 4 -6.3 C 5 -7.3 4.4 -8.9 2.9 -9 C 3.2 -10.4 1.8 -11.4 0 -11 C -1.8 -11.4 -3.2 -10.4 -2.9 -9 C -4.4 -8.9 -5 -7.3 -4 -6.3 C -5.4 -5.6 -5.2 -4 -3.6 -3.5 C -4.7 -2.6 -4.1 -1.3 -2.5 -1.2 C -2.6 0 -1.5 0.7 0 0.6 Z M 0 0 L 0 -9.6',
    'M 0 2.2 L 0 0.5 C 1.8 0.6 3 -0.3 2.8 -1.6 C 4.6 -1.8 5.2 -3.4 3.9 -4.4 C 5.5 -5.2 5.3 -7 3.6 -7.5 C 4.2 -9.2 2.4 -10.6 0 -10.1 C -2.4 -10.6 -4.2 -9.2 -3.6 -7.5 C -5.3 -7 -5.5 -5.2 -3.9 -4.4 C -5.2 -3.4 -4.6 -1.8 -2.8 -1.6 C -3 -0.3 -1.8 0.6 0 0.5 Z M 0 0 L 0 -8.8',
    'M 0 2.6 L 0 0.7 C 1.2 0.8 2.1 0.1 2 -1 C 3.4 -1.1 3.9 -2.2 3 -3 C 4.4 -3.5 4.5 -4.9 3.3 -5.5 C 4.4 -6.3 4.1 -7.8 2.8 -8.1 C 3.4 -9.5 2.2 -10.7 0.9 -10.4 C 0.8 -11.6 -0.8 -11.6 -0.9 -10.4 C -2.2 -10.7 -3.4 -9.5 -2.8 -8.1 C -4.1 -7.8 -4.4 -6.3 -3.3 -5.5 C -4.5 -4.9 -4.4 -3.5 -3 -3 C -3.9 -2.2 -3.4 -1.1 -2 -1 C -2.1 0.1 -1.2 0.8 0 0.7 Z M 0 0 L 0 -10',
  ],
  // birch: pointed ovals with a serrated-tooth hint near the tip
  birch: [
    'M 0 2.2 L 0 0.4 C -2.4 -0.2 -3.6 -2 -3.4 -4.2 L -2.5 -4 L -3 -5.8 L -2 -5.5 L -2.2 -7.4 L -1.2 -6.9 L 0 -10.2 L 1.2 -6.9 L 2.2 -7.4 L 2 -5.5 L 3 -5.8 L 2.5 -4 L 3.4 -4.2 C 3.6 -2 2.4 -0.2 0 0.4 Z M 0 0 L 0 -8.8',
    'M 0 2 L 0 0.4 C -2.8 -0.4 -4 -2.4 -3.6 -4.8 L -2.6 -4.5 L -3 -6.4 L -1.9 -6 L -2 -8 L -1 -7.4 L 0 -9.6 L 1 -7.4 L 2 -8 L 1.9 -6 L 3 -6.4 L 2.6 -4.5 L 3.6 -4.8 C 4 -2.4 2.8 -0.4 0 0.4 Z M 0 0 L 0 -8.2',
    'M 0 2.2 L 0 0.3 C -2 -0.6 -2.9 -2.6 -2.7 -5 L -1.9 -4.7 L -2.3 -6.6 L -1.4 -6.2 L -1.5 -8.4 L -0.7 -7.7 L 0 -10.8 L 0.7 -7.7 L 1.5 -8.4 L 1.4 -6.2 L 2.3 -6.6 L 1.9 -4.7 L 2.7 -5 C 2.9 -2.6 2 -0.6 0 0.3 Z M 0 0 L 0 -9.4',
  ],
  // willow: slender lanceolate blades (straight + gently curved)
  willow: [
    'M 0 1.8 L 0 0.2 C -1.9 -2.2 -2.1 -7.4 0 -12.5 C 2.1 -7.4 1.9 -2.2 0 0.2 Z M 0 -0.8 L 0 -10.8',
    'M 0 1.8 L 0 0.2 C -2.2 -2.4 -1.4 -8 1 -12 C 2.6 -7.2 1.8 -2.4 0 0.2 Z M 0 -0.6 C 0.4 -4 0.6 -7 0.9 -10',
  ],
  // pine: needle bundles — 5 short needles / 7 long needles fanning downward
  pine: [needleBundle(5, 9, 110), needleBundle(7, 11, 150)],
};

// (Leaf instances are scattered by the existing `scatter()` below and
// rendered as <use> references to LEAF_PATHS — one silhouette per species,
// instanced per leaf with its own transform/fill/birth.)

// --- geometry generators ---------------------------------------------------

// Tapered limb: filled quad-curved quadrilateral from (x0,y0)w0 to (x1,y1)w1.
function limb(x0, y0, x1, y1, w0, w1, bend) {
  const dx = x1 - x0, dy = y1 - y0;
  const len = Math.hypot(dx, dy) || 1;
  const px = -dy / len, py = dx / len;
  const mx = (x0 + x1) / 2 + px * bend, my = (y0 + y1) / 2 + py * bend;
  const wm = (w0 + w1) / 2;
  return `M ${R(x0 - px * w0)} ${R(y0 - py * w0)} Q ${R(mx - px * wm)} ${R(my - py * wm)} ${R(x1 - px * w1)} ${R(y1 - py * w1)} L ${R(x1 + px * w1)} ${R(y1 + py * w1)} Q ${R(mx + px * wm)} ${R(my + py * wm)} ${R(x0 + px * w0)} ${R(y0 + py * w0)} Z`;
}

// Lobed cloud silhouette: bumpy closed blob around an ellipse.
function blob(rng, cx, cy, rx, ry, lobes) {
  const pts = [];
  for (let i = 0; i < lobes; i++) {
    const a = (i / lobes) * Math.PI * 2;
    const rr = 0.84 + rng() * 0.28;
    pts.push([cx + Math.cos(a) * rx * rr, cy + Math.sin(a) * ry * rr]);
  }
  let d = `M ${R(pts[0][0])} ${R(pts[0][1])}`;
  for (let i = 0; i < lobes; i++) {
    const p1 = pts[(i + 1) % lobes];
    const m = [(pts[i][0] + p1[0]) / 2, (pts[i][1] + p1[1]) / 2];
    const qx = cx + (m[0] - cx) * 1.32, qy = cy + (m[1] - cy) * 1.32;
    d += ` Q ${R(qx)} ${R(qy)} ${R(p1[0])} ${R(p1[1])}`;
  }
  return d + ' Z';
}

// Toned, layer-tagged lobed cluster (maple / oak canopies are stacks of these).
function clump(rng, x, y, rx, ry, fill, layer, birth, lobes = 9) {
  return { d: blob(rng, x, y, rx, ry, lobes), ox: x, oy: y, fill, wfill: wiltLeaf(fill), layer, birth };
}

// Point on quadratic bezier (used to hang willow leaflets along frond spines).
function qPt(p0, p1, p2, t) {
  const u = 1 - t;
  return [u * u * p0[0] + 2 * u * t * p1[0] + t * t * p2[0], u * u * p0[1] + 2 * u * t * p1[1] + t * t * p2[1]];
}

// Scatter leaf clusters in an ellipse. Leaves nearer the heart are born
// earlier so the canopy fills in structurally from the inside out.
function scatter(rng, pal, { cx, cy, rx, ry, count, rMin, rMax, birthMin, birthMax, round = 0.72 }) {
  const leaves = [];
  for (let i = 0; i < count; i++) {
    const a = rng() * Math.PI * 2;
    const rad = Math.sqrt(rng());
    const x = cx + Math.cos(a) * rx * rad;
    const y = cy + Math.sin(a) * ry * rad;
    const layer = rad > 0.78 ? 'back' : rng() < 0.45 ? 'mid' : 'front';
    const base = layer === 'back' ? pal.back : layer === 'mid' ? pal.mid : pal.front;
    const fill = mix(base, layer === 'front' ? pal.rim : pal.mid, rng() * 0.35);
    const rr = rMin + rng() * (rMax - rMin);
    leaves.push({
      x: R(x), y: R(y), rx: R(rr), ry: R(rr * (round + rng() * 0.2)),
      rot: R(rng() * 360), fill, wfill: wiltLeaf(fill), layer,
      birth: R(lerp(birthMin, birthMax, clamp(rad * 0.75 + rng() * 0.3, 0, 1))),
    });
  }
  return leaves;
}

// Rim-light dots along the upper-left of the canopy (shimmer layer).
function rims(rng, cx, cy, rx, ry, n) {
  const out = [];
  for (let i = 0; i < n; i++) {
    const a = Math.PI * (1.05 + rng() * 0.85); // upper arc
    out.push({
      x: R(cx + Math.cos(a) * rx * (0.55 + rng() * 0.4)),
      y: R(cy + Math.sin(a) * ry * (0.55 + rng() * 0.4)),
      r: R(2 + rng() * 3.4),
    });
  }
  return out;
}

// Second, finer rim pass: smaller and brighter dabs concentrated on the lit
// (upper-left) side — reads as individual catch-light leaves at 120–200px.
function rims2(rng, cx, cy, rx, ry, n) {
  const out = [];
  for (let i = 0; i < n; i++) {
    const a = Math.PI * (1.0 + rng() * 0.62); // lit upper-left arc
    out.push({
      x: R(cx + Math.cos(a) * rx * (0.6 + rng() * 0.36)),
      y: R(cy + Math.sin(a) * ry * (0.6 + rng() * 0.36)),
      r: R(0.9 + rng() * 1.3),
      birth: R(3.4 + rng() * 1.5),
    });
  }
  return out;
}

// Tiny two-tone dabs sprinkled INSIDE the biggest clusters — micro leaf
// texture that only resolves at the new render sizes. Born late (3.6–4.9)
// so density builds gradually. spots: [cx, cy, rx, ry] cluster ellipses.
function microDabs(rng, spots, perSpot, light, dark) {
  const out = [];
  for (const sp of spots) {
    for (let i = 0; i < perSpot; i++) {
      const a = rng() * Math.PI * 2;
      const rad = Math.sqrt(rng()) * 0.8;
      const fill = i % 2 ? light : dark;
      out.push({
        x: R(sp[0] + Math.cos(a) * sp[2] * rad),
        y: R(sp[1] + Math.sin(a) * sp[3] * rad),
        rx: R(1.1 + rng() * 1.2),
        ry: R(0.8 + rng() * 0.9),
        rot: R(rng() * 180),
        fill, wfill: wiltLeaf(fill),
        birth: R(3.6 + rng() * 1.3),
      });
    }
  }
  return out;
}

function sparkles(rng, cx, cy, rx, ry, n) {
  const out = [];
  for (let i = 0; i < n; i++) {
    out.push({
      x: R(cx + (rng() - 0.5) * 2 * rx), y: R(cy + (rng() - 0.5) * 2 * ry),
      r: R(1.4 + rng() * 1.6), delay: R(rng() * 6), dur: R(4.5 + rng() * 3),
    });
  }
  return out;
}

function fallers(rng, cx, cy, rx, n, fill) {
  const out = [];
  for (let i = 0; i < n; i++) {
    out.push({
      x: R(cx + (rng() - 0.5) * 2 * rx), y: R(cy + rng() * 14),
      delay: R(i * 7 + rng() * 5), dur: R(15 + rng() * 6), fill: mix(fill, '#8a6a35', rng() * 0.4),
    });
  }
  return out;
}

function fallenLeaves(rng, n) {
  const out = [];
  for (let i = 0; i < n; i++) {
    out.push({
      x: R(CX + (rng() - 0.5) * 70), y: R(GROUND_Y - 2 - rng() * 3),
      rot: R(rng() * 360), rx: R(3 + rng() * 2),
    });
  }
  return out;
}

// --- species builders --------------------------------------------------
// Trunk coords: base at (0,0), up = -y. Canopy coords: origin at trunk top.

function buildOak(rng, pal) {
  // Classic cartoon oak: wide flattened dome of bold-outlined cloud clusters
  // in 3 greens; smooth caramel trunk that FORKS into limbs reaching into the
  // canopy, wavy skirt at the ground; acorns dangle below cluster edges at 5.
  const h = 56, bw = 13, tw = 8.5;
  const trunkD = [
    `M ${R(-bw - 9)} 0 Q ${R(-bw - 2)} -2 ${R(-bw + 1)} -6`,
    `Q ${R(-bw * 0.78)} ${R(-h * 0.38)} ${-tw} ${-h} L ${tw} ${-h}`,
    `Q ${R(bw * 0.8)} ${R(-h * 0.42)} ${R(bw - 1)} -6 Q ${R(bw + 2)} -2 ${R(bw + 9)} 0`,
    `Q ${R(bw + 2.5)} 1.2 ${R(bw * 0.45)} -1.6 Q 0 1.4 ${R(-bw * 0.45)} -1.6`,
    `Q ${R(-bw - 2.5)} 1.2 ${R(-bw - 9)} 0 Z`,
  ].join(' ');
  const branches = [
    // the caramel FORK: 4 smooth limbs splitting off the trunk top
    { d: limb(-4, 8, -34, -28, 6.5, 2, -8), birth: 2.3, droop: 14, light: true },
    { d: limb(-1, 6, -10, -44, 5.5, 1.8, -3), birth: 2.5, droop: 10, light: true },
    { d: limb(2, 6, 14, -40, 5, 1.7, 3), birth: 2.65, droop: 10, light: true },
    { d: limb(4, 8, 36, -24, 6, 1.9, 8), birth: 2.8, droop: 14, light: true },
  ];
  const clusters = [
    // darker green undersides (bottom row — lifted so the trunk fork shows)
    clump(rng, -14, -23, 16, 12, pal.back, 'back', 2.55),
    clump(rng, 20, -24, 16, 12, pal.back, 'back', 2.65),
    clump(rng, -46, -30, 17, 13, pal.back, 'back', 2.8),
    clump(rng, 48, -30, 16, 12, pal.back, 'back', 2.95),
    clump(rng, -62, -46, 13, 11, pal.back, 'back', 3.5),
    clump(rng, 62, -48, 13, 11, pal.back, 'back', 3.6),
    // kelly-green middle band
    clump(rng, 2, -40, 16, 13, pal.mid, 'mid', 2.75),
    clump(rng, -34, -44, 16, 13, pal.mid, 'mid', 3.0),
    clump(rng, 36, -44, 15, 12, pal.mid, 'mid', 3.1),
    clump(rng, -12, -54, 14, 12, pal.mid, 'mid', 3.25),
    clump(rng, 22, -56, 14, 12, pal.mid, 'mid', 3.4),
    clump(rng, -56, -60, 13, 10, pal.mid, 'mid', 3.9),
    clump(rng, 56, -62, 13, 10, pal.mid, 'mid', 4.0),
    // extra in-fill clusters (reference dome is packed shoulder-to-shoulder)
    clump(rng, -2, -34, 14, 11, pal.back, 'back', 2.85),
    clump(rng, 48, -50, 12, 10, pal.mid, 'mid', 3.45),
    // lime-green highlight tops (flattened dome)
    clump(rng, -10, -74, 15, 12, pal.front, 'front', 3.55),
    clump(rng, -38, -66, 14, 11, pal.front, 'front', 3.7),
    clump(rng, 18, -72, 14, 11, pal.front, 'front', 3.8),
    clump(rng, 44, -64, 12, 10, pal.front, 'front', 4.1),
    clump(rng, 0, -86, 13, 10, pal.front, 'front', 4.3),
    clump(rng, -24, -82, 11, 9, pal.front, 'front', 4.45),
    clump(rng, 26, -82, 11, 9, pal.front, 'front', 4.55),
    clump(rng, 38, -76, 10, 8, pal.front, 'front', 4.65),
  ];
  return {
    trunkH: h, trunkD,
    bark: [
      `M ${R(-bw * 0.4)} -6 Q ${R(-bw * 0.45)} ${R(-h * 0.4)} ${R(-bw * 0.25)} ${R(-h * 0.7)}`,
      `M ${R(bw * 0.32)} -8 Q ${R(bw * 0.42)} ${R(-h * 0.45)} ${R(bw * 0.2)} ${R(-h * 0.72)}`,
      `M -1 -4 Q -2 ${R(-h * 0.35)} 0.5 ${R(-h * 0.6)}`,
      // finer linework: short secondary streaks low and high on the bole
      `M ${R(-bw * 0.62)} -3 Q ${R(-bw * 0.56)} ${R(-h * 0.15)} ${R(-bw * 0.42)} ${R(-h * 0.26)}`,
      `M ${R(bw * 0.52)} ${R(-h * 0.52)} Q ${R(bw * 0.42)} ${R(-h * 0.62)} ${R(bw * 0.3)} ${R(-h * 0.78)}`,
    ],
    knots: [{ x: R(-bw * 0.35), y: R(-h * 0.5), rx: 2, ry: 2.8 }],
    branches,
    // subtle underside shading along each fork limb (kept inside silhouette)
    branchShade: [
      { d: 'M -6 10 Q -20 -2 -32 -22', birth: 2.45 },
      { d: 'M -3 8 Q -8 -16 -10 -40', birth: 2.65 },
      { d: 'M 4 8 Q 10 -14 13 -36', birth: 2.8 },
      { d: 'M 6 10 Q 22 0 34 -18', birth: 2.95 },
    ],
    sils: [],
    clusters,
    leaves: scatter(rng, pal, { cx: 0, cy: -50, rx: 56, ry: 34, count: 100, rMin: 5, rMax: 8, birthMin: 2.7, birthMax: 4.8 }),
    shadeLo: [{ cx: 2, cy: -30, rx: 50, ry: 22 }, { cx: 34, cy: -42, rx: 26, ry: 14 }],
    shadeHi: [{ cx: -8, cy: -72, rx: 30, ry: 15 }],
    rims: rims(rng, 0, -60, 50, 30, 8),
    rims2: rims2(rng, 0, -62, 48, 28, 30),
    dabs: microDabs(
      rng,
      [[-14, -23, 16, 12], [20, -24, 16, 12], [2, -40, 16, 13], [-34, -44, 16, 13], [-10, -74, 15, 12], [36, -44, 15, 12]],
      9,
      mix(pal.front, pal.rim, 0.55),
      mix(pal.mid, pal.back, 0.5)
    ),
    // celebration acorns: dangle below cluster edges around the canopy
    // (last two are the stage-5 birds-eye accents tucked into the mid canopy)
    fruits: [
      { x: -58, y: -34, rot: -8 }, { x: -34, y: -18, rot: 5 }, { x: -6, y: -14, rot: -4 },
      { x: 26, y: -16, rot: 7 }, { x: 54, y: -32, rot: -6 }, { x: 64, y: -52, rot: 10 },
      { x: -64, y: -54, rot: -10 }, { x: 40, y: -52, rot: 4 },
      { x: -20, y: -40, rot: 6 }, { x: 14, y: -46, rot: -5 },
    ],
    sparkles: sparkles(rng, 0, -48, 58, 40, 6),
    fallers: fallers(rng, 0, -24, 50, 3, pal.mid),
    fallen: fallenLeaves(rng, 4),
    glow: [0, -52, 84, 62],
    canopyDX: 0,
  };
}

function buildBirch(rng, pal) {
  const h = 132, bw = 6.5, tw = 3.6;
  const trunkD = [
    `M ${R(-bw - 3)} 0 Q ${R(-bw)} -6 ${R(-bw * 0.85)} ${R(-h * 0.3)}`,
    `Q ${R(-bw * 0.6)} ${R(-h * 0.6)} ${R(-tw + 1.5)} ${-h} L ${R(tw + 2)} ${-h}`,
    `Q ${R(bw * 0.7)} ${R(-h * 0.55)} ${R(bw * 0.9)} ${R(-h * 0.25)}`,
    `Q ${bw} -6 ${R(bw + 3)} 0 Z`,
  ].join(' ');
  const lenticels = Array.from({ length: 13 }, (_, i) => ({
    x: R((rng() - 0.5) * 5), y: R(-h * (0.08 + i * 0.066) - rng() * 4), w: R(3.5 + rng() * 3.5),
  }));
  return {
    trunkH: h, trunkD,
    bark: [
      // faint vertical seams between the lenticel bands
      `M ${R(bw * 0.32)} -10 Q ${R(bw * 0.36)} ${R(-h * 0.3)} ${R(bw * 0.2)} ${R(-h * 0.5)}`,
      `M ${R(-bw * 0.36)} ${R(-h * 0.55)} Q ${R(-bw * 0.3)} ${R(-h * 0.7)} ${R(-bw * 0.15)} ${R(-h * 0.82)}`,
    ],
    lenticels,
    knots: [
      { x: -2.5, y: R(-h * 0.46), rx: 2.2, ry: 3, dark: true },
      { x: 1.8, y: R(-h * 0.74), rx: 1.7, ry: 2.4, dark: true },
    ],
    branches: [
      { d: limb(-1, 8, -22, -32, 3, 1, -5), birth: 2.4, droop: 14 },
      { d: limb(1, 4, 19, -38, 2.8, 0.9, 5), birth: 2.7, droop: 12 },
      { d: limb(0, 0, -7, -52, 2.6, 0.8, -3), birth: 3.0, droop: 8 },
    ],
    sils: [
      { d: blob(rng, -15, -28, 25, 21, 9), ox: -15, oy: -28, birth: 2.7 },
      { d: blob(rng, 13, -46, 27, 23, 9), ox: 13, oy: -46, birth: 3.05 },
      { d: blob(rng, -7, -66, 22, 18, 8), ox: -7, oy: -66, birth: 3.45 },
      { d: blob(rng, 26, -28, 19, 15, 8), ox: 26, oy: -28, birth: 2.95 },
      { d: blob(rng, 0, -82, 16, 13, 8), ox: 0, oy: -82, birth: 3.85 },
    ],
    leaves: scatter(rng, pal, { cx: 0, cy: -46, rx: 38, ry: 42, count: 130, rMin: 2.8, rMax: 5.4, birthMin: 2.6, birthMax: 5.0, round: 0.85 }),
    shadeLo: [{ cx: 4, cy: -30, rx: 30, ry: 22 }, { cx: 16, cy: -52, rx: 20, ry: 16 }],
    shadeHi: [{ cx: -10, cy: -60, rx: 26, ry: 20 }],
    rims: rims(rng, 0, -50, 36, 38, 8),
    rims2: rims2(rng, 0, -52, 34, 36, 28),
    dabs: microDabs(
      rng,
      [[-15, -28, 25, 21], [13, -46, 27, 23], [-7, -66, 22, 18]],
      14,
      mix(pal.front, pal.rim, 0.5),
      mix(pal.mid, pal.back, 0.5)
    ),
    fruits: Array.from({ length: 8 }, () => ({ x: R((rng() - 0.5) * 64), y: R(-44 + (rng() - 0.5) * 64), rot: R((rng() - 0.5) * 30) })),
    sparkles: sparkles(rng, 0, -46, 42, 46, 6),
    fallers: fallers(rng, 0, -24, 34, 3, pal.mid),
    fallen: fallenLeaves(rng, 4),
    canopyDX: 0,
  };
}

// Scalloped frond swag for the pine: apex at (0, y-th), sides flare out and
// the tips DROOP below the baseline, underside is a run of downward scallops.
function swagTier(rng, y, hw, droop) {
  const th = hw * 0.5 + 7;
  let d = `M ${R(-hw)} ${R(y + droop)}`;
  const n = Math.max(6, Math.round(hw / 7));
  let px = -hw, py = y + droop;
  for (let i = 1; i <= n; i++) {
    const x = -hw + (2 * hw * i) / n;
    const yy = y + droop * Math.pow(Math.abs(x) / hw, 1.6) - rng() * 1.5;
    d += ` Q ${R((px + x) / 2)} ${R((py + yy) / 2 + 3.2 + rng() * 2)} ${R(x)} ${R(yy)}`;
    px = x; py = yy;
  }
  d += ` Q ${R(hw * 0.6)} ${R(y - th * 0.3)} ${R(hw * 0.16)} ${R(y - th * 0.82)}`;
  d += ` Q 0 ${R(y - th)} ${R(-hw * 0.16)} ${R(y - th * 0.82)}`;
  d += ` Q ${R(-hw * 0.6)} ${R(y - th * 0.3)} ${R(-hw)} ${R(y + droop)} Z`;
  return d;
}

function buildPine(rng, pal) {
  // Tall narrow flat-illustration conifer: 10 drooping swag tiers + pointed
  // crown, alternating dark-forest / olive fills with pale speckles, straight
  // bare trunk at the bottom (~15% of height) and a grass tuft at the base.
  const h = 52, bw = 7, tw = 5.5;
  const trunkD = [
    `M ${R(-bw - 2.5)} 0 Q ${R(-bw + 0.5)} -4 ${R(-bw * 0.9)} -10 L ${-tw} ${-h}`,
    `L ${tw} ${-h} L ${R(bw * 0.9)} -10 Q ${R(bw - 0.5)} -4 ${R(bw + 2.5)} 0 Z`,
  ].join(' ');
  // bottom → top; births bottom-first so a young pine reads as 2–3 tiers.
  // 13 tightly stacked tiers — the reference conifer reads as ~13 swags.
  const specs = [
    [0, 52, 12, 2.4], [-20, 47, 11, 2.58], [-39, 42.5, 10.5, 2.76], [-57, 38, 10, 2.94],
    [-74, 34, 9.5, 3.12], [-90, 30, 9, 3.3], [-105, 26.5, 8.5, 3.48], [-119, 23, 8, 3.66],
    [-132, 20, 7.5, 3.84], [-144, 17, 7, 4.02], [-155, 14, 6, 4.2], [-165, 11, 5.5, 4.38],
    [-174, 8.5, 4.5, 4.52],
  ];
  const needleStroke = mix(pal.back, '#16241a', 0.45);
  const tiers = specs.map(([y, hw, droop, birth], i) => {
    const fill = i % 2 ? pal.mid : pal.back;
    const speckles = Array.from({ length: hw > 30 ? 8 : 5 }, () => [
      R((rng() - 0.5) * hw * 1.3), R(y - 6 + rng() * (droop + 8)), R(0.7 + rng() * 0.7),
    ]);
    // feathered underside: little needle fans hanging off the scallop fringe
    const fanN = hw > 35 ? 5 : hw > 20 ? 4 : 3;
    let fans = '';
    for (let f = 0; f < fanN; f++) {
      const fx = R((rng() - 0.5) * hw * 1.5);
      const fy = R(y + droop * Math.pow(Math.abs(fx) / hw, 1.6) + 1 + rng() * 2);
      fans += `M ${fx} ${fy} l -2.2 4.2 M ${fx} ${fy} l 0 5 M ${fx} ${fy} l 2.2 4.2 `;
    }
    return { d: swagTier(rng, y, hw, droop), y, birth, fill, wfill: wiltLeaf(fill), speckles, fans: fans.trim(), fanStroke: needleStroke, wfanStroke: wiltLeaf(needleStroke) };
  });
  tiers.reverse(); // draw top tiers first so each fringe overlaps the one above
  return {
    trunkH: h, trunkD,
    bark: [
      `M ${R(-bw * 0.4)} -5 L ${R(-bw * 0.32)} ${R(-h * 0.75)}`,
      `M ${R(bw * 0.28)} -8 L ${R(bw * 0.22)} ${R(-h * 0.6)}`,
      `M -0.5 -4 L 0 ${R(-h * 0.5)}`,
      // finer linework: short broken streaks between the long seams
      `M ${R(-bw * 0.14)} -12 L ${R(-bw * 0.1)} ${R(-h * 0.36)}`,
      `M ${R(bw * 0.5)} -4 L ${R(bw * 0.46)} ${R(-h * 0.28)}`,
    ],
    knots: [{ x: 1.5, y: R(-h * 0.55), rx: 1.6, ry: 2.4 }],
    branches: [],
    tiers,
    leader: { d: 'M 0 -176 L 0 -192 M 0 -183 L -4.5 -188 M 0 -186 L 4.5 -191', oy: -176, birth: 4.7 },
    tuft: [
      'M -11 0 Q -13 -4 -12.5 -8', 'M -8 0 Q -8.5 -5 -6.5 -9', 'M 6 0 Q 6.5 -4.5 8 -7',
      'M 9 0 Q 10.5 -4 10 -8', 'M 12 0 Q 14 -3 14.5 -6',
      'M -14 0 Q -15.5 -3 -15 -5.5', 'M 3 0 Q 3.5 -4 2 -7.5',
    ],
    sils: [],
    leaves: [],
    shadeLo: [{ cx: 2, cy: -46, rx: 22, ry: 34 }],
    shadeHi: [],
    rims: Array.from({ length: 7 }, (_, i) => ({ x: R(-8 - rng() * 18), y: R(-18 - i * 23 - rng() * 10), r: R(1 + rng() * 0.8) })),
    rims2: rims2(rng, 0, -90, 30, 78, 18),
    dabs: microDabs(
      rng,
      [[0, -4, 38, 8], [0, -24, 34, 8]],
      10,
      pal.rim,
      mix(pal.back, '#16241a', 0.4)
    ),
    // small cones tucked near tier tips mark stage 5 (with glow/fireflies);
    // last two are the birds-eye accents on the upper tiers
    fruits: [
      { x: -27, y: -34, rot: 6 }, { x: 24, y: -73, rot: -8 }, { x: -17, y: -110, rot: 5 },
      { x: 19, y: -52, rot: 7 }, { x: -14, y: -136, rot: -5 },
    ],
    sparkles: sparkles(rng, 0, -90, 32, 78, 6),
    fallers: fallers(rng, 0, -40, 30, 2, pal.mid),
    fallen: fallenLeaves(rng, 3),
    glow: [0, -85, 70, 112],
    canopyDX: 0,
  };
}

function buildMaple(rng, pal) {
  // Fiery autumn maple: deep-red shadow clusters along the bottom/edges,
  // scarlet + vivid-orange mids, golden-yellow crown; dark branches thread
  // through gaps; thick tapered red-brown trunk with streaks and root flare.
  const h = 66, bw = 12, tw = 7;
  const trunkD = [
    `M ${R(-bw - 9)} 0 Q ${R(-bw - 4)} -2.5 ${R(-bw - 1.5)} -8`,
    `Q ${R(-bw * 0.8)} ${R(-h * 0.34)} ${R(-bw * 0.66)} ${R(-h * 0.56)}`,
    `Q ${R(-bw * 0.6)} ${R(-h * 0.76)} ${-tw} ${-h} L ${tw} ${-h}`,
    `Q ${R(bw * 0.64)} ${R(-h * 0.72)} ${R(bw * 0.72)} ${R(-h * 0.5)}`,
    `Q ${R(bw * 0.84)} ${R(-h * 0.3)} ${R(bw + 1.5)} -8`,
    `Q ${R(bw + 4)} -2.5 ${R(bw + 9)} 0 Z`,
  ].join(' ');
  const star = 'M 0 -6.2 L 1.8 -2.2 L 5.6 -3.5 L 3.1 0.2 L 5.1 3.7 L 1.5 2.7 L 0 6.2 L -1.5 2.7 L -5.1 3.7 L -3.1 0.2 L -5.6 -3.5 L -1.8 -2.2 Z';
  const deepRed = mix(pal.back, '#5e1408', 0.4); // bottom shadow clusters
  const darkScarlet = mix(pal.mid, pal.back, 0.35);
  const clusters = [
    // deep-red shadow clusters — bottom edge and outer rim
    clump(rng, -16, -10, 15, 12, deepRed, 'back', 2.6),
    clump(rng, 18, -9, 15, 12, deepRed, 'back', 2.7),
    clump(rng, -46, -22, 17, 13, deepRed, 'back', 2.95),
    clump(rng, 44, -20, 16, 13, deepRed, 'back', 3.05),
    clump(rng, -62, -40, 13, 11, pal.back, 'back', 3.6),
    clump(rng, 60, -38, 13, 11, pal.back, 'back', 3.7),
    clump(rng, -48, -58, 12, 10, pal.back, 'back', 3.95),
    clump(rng, 46, -56, 12, 10, pal.back, 'back', 4.05),
    // scarlet mid clusters
    clump(rng, -6, -30, 14, 12, pal.mid, 'mid', 2.75),
    clump(rng, -30, -40, 15, 13, pal.mid, 'mid', 3.0),
    clump(rng, 28, -42, 15, 13, pal.mid, 'mid', 3.15),
    clump(rng, 8, -48, 13, 11, pal.mid, 'mid', 3.3),
    clump(rng, -52, -50, 12, 10, darkScarlet, 'mid', 3.8),
    clump(rng, 50, -50, 12, 10, darkScarlet, 'mid', 3.9),
    // extra in-fill (reference canopy is packed — no sky gaps between masses)
    clump(rng, -58, -28, 12, 10, deepRed, 'back', 3.2),
    clump(rng, -18, -44, 12, 10, darkScarlet, 'mid', 3.45),
    // vivid orange upper-mid clusters
    clump(rng, 0, -46, 13, 11, pal.front, 'front', 3.2),
    clump(rng, -22, -56, 13, 11, pal.front, 'front', 3.5),
    clump(rng, 24, -58, 13, 11, pal.front, 'front', 3.65),
    clump(rng, -8, -64, 12, 10, pal.front, 'front', 3.85),
    clump(rng, 12, -60, 11, 9, pal.front, 'front', 3.75),
    clump(rng, -40, -68, 11, 9, pal.front, 'front', 4.15),
    clump(rng, 38, -66, 11, 9, pal.front, 'front', 4.25),
    // golden-yellow crown — last to fill in, the mature payoff
    clump(rng, -16, -78, 11, 9, pal.rim, 'front', 4.3),
    clump(rng, 14, -80, 11, 9, pal.rim, 'front', 4.4),
    clump(rng, 6, -70, 8, 7, mix(pal.front, pal.rim, 0.6), 'front', 4.45),
    clump(rng, 0, -88, 12, 10, pal.rim, 'front', 4.55),
    clump(rng, -30, -76, 9, 8, pal.rim, 'front', 4.65),
    clump(rng, 28, -78, 9, 8, pal.rim, 'front', 4.75),
  ];
  return {
    trunkH: h, trunkD,
    bark: [
      `M ${R(-bw * 0.45)} -8 Q ${R(-bw * 0.5)} ${R(-h * 0.35)} ${R(-bw * 0.28)} ${R(-h * 0.62)}`,
      `M ${R(bw * 0.32)} -6 Q ${R(bw * 0.46)} ${R(-h * 0.4)} ${R(bw * 0.2)} ${R(-h * 0.68)}`,
      `M -1 -10 Q -2.5 ${R(-h * 0.4)} 0 ${R(-h * 0.72)}`,
      `M ${R(-bw * 0.75)} -3 Q ${R(-bw * 0.7)} ${R(-h * 0.18)} ${R(-bw * 0.5)} ${R(-h * 0.32)}`,
      // finer linework: short streaks echoing the reference's furrowed bole
      `M ${R(bw * 0.6)} -4 Q ${R(bw * 0.58)} ${R(-h * 0.15)} ${R(bw * 0.4)} ${R(-h * 0.26)}`,
      `M ${R(-bw * 0.22)} ${R(-h * 0.5)} Q ${R(-bw * 0.1)} ${R(-h * 0.62)} ${R(-bw * 0.18)} ${R(-h * 0.78)}`,
    ],
    knots: [
      { x: R(bw * 0.35), y: R(-h * 0.42), rx: 2.2, ry: 3 },
      { x: R(-bw * 0.3), y: R(-h * 0.62), rx: 1.8, ry: 2.6 },
    ],
    branches: [
      // dark skeleton threading up through the canopy
      { d: limb(-3, 8, -34, -34, 5.6, 1.6, -8), birth: 2.3, droop: 14 },
      { d: limb(3, 8, 30, -38, 5.2, 1.5, 7), birth: 2.45, droop: 14 },
      { d: limb(0, 4, 2, -56, 3.4, 1.1, 3), birth: 2.7, droop: 8 },
      { d: limb(-26, -26, -50, -50, 1.9, 0.7, -4), birth: 2.9, droop: 12 },
      { d: limb(24, -30, 46, -54, 1.8, 0.7, 4), birth: 3.05, droop: 12 },
      { d: limb(-2, -40, -18, -68, 1.5, 0.6, -3), birth: 3.3, droop: 10 },
      { d: limb(4, -44, 22, -72, 1.4, 0.5, 3), birth: 3.5, droop: 10 },
    ],
    // thin twigs drawn OVER the back clusters so branches read through gaps
    overBranches: [
      { d: limb(-16, -36, -38, -58, 1.4, 0.5, -3), birth: 3.4 },
      { d: limb(14, -40, 34, -62, 1.3, 0.5, 3), birth: 3.6 },
      { d: limb(0, -52, -8, -76, 1.1, 0.4, -2), birth: 3.9 },
      // two extra fine twigs threading the upper gaps (per the reference)
      { d: limb(-30, -50, -48, -68, 1.1, 0.4, -3), birth: 3.75 },
      { d: limb(26, -52, 44, -70, 1, 0.4, 3), birth: 3.95 },
    ],
    sils: [],
    clusters,
    leaves: scatter(rng, pal, { cx: 0, cy: -46, rx: 50, ry: 36, count: 112, rMin: 4.5, rMax: 8, birthMin: 2.6, birthMax: 4.9 }),
    starLeaves: Array.from({ length: 9 }, () => ({
      x: R((rng() - 0.5) * 86), y: R(-46 + (rng() - 0.5) * 56), s: R(0.9 + rng() * 0.6), rot: R(rng() * 360), birth: R(3.2 + rng() * 1.4),
    })),
    starPath: star,
    shadeLo: [{ cx: 3, cy: -22, rx: 44, ry: 24 }, { cx: -34, cy: -36, rx: 24, ry: 16 }],
    shadeHi: [{ cx: -6, cy: -74, rx: 30, ry: 18 }],
    rims: rims(rng, 0, -58, 46, 30, 9),
    rims2: rims2(rng, 0, -60, 44, 28, 30),
    dabs: microDabs(
      rng,
      [[-46, -22, 17, 13], [44, -20, 16, 13], [-30, -40, 15, 13], [28, -42, 15, 13], [0, -88, 12, 10], [-16, -78, 11, 9]],
      9,
      mix(pal.front, pal.rim, 0.5),
      mix(pal.mid, '#5e1408', 0.35)
    ),
    // celebration: golden glints living in the yellow crown clusters
    // (last two are the stage-5 birds-eye accents on the crown shoulders)
    fruits: [
      { x: -14, y: -78, rot: 0 }, { x: 10, y: -84, rot: 15 }, { x: 0, y: -92, rot: -10 },
      { x: -28, y: -70, rot: 8 }, { x: 24, y: -72, rot: -12 }, { x: -4, y: -66, rot: 20 },
      { x: 18, y: -90, rot: 5 },
      { x: -22, y: -86, rot: -6 }, { x: 30, y: -82, rot: 12 },
    ],
    sparkles: sparkles(rng, 0, -74, 36, 26, 6),
    fallers: fallers(rng, 0, -22, 46, 3, pal.front),
    fallen: fallenLeaves(rng, 4),
    glow: [0, -50, 82, 66],
    canopyDX: 0,
  };
}

function buildWillow(rng, pal) {
  const h = 86, bw = 10, tw = 5.5;
  const trunkD = [
    `M ${R(-bw - 4.5)} 0 Q ${R(-bw)} -8 ${R(-bw * 0.7)} ${R(-h * 0.35)}`,
    `Q ${R(-bw * 0.2)} ${R(-h * 0.68)} ${R(8 - tw)} ${-h} L ${R(8 + tw)} ${-h}`,
    `Q ${R(bw * 0.9)} ${R(-h * 0.6)} ${R(bw)} ${R(-h * 0.28)}`,
    `Q ${R(bw + 1)} -6 ${R(bw + 4.5)} 0 Z`,
  ].join(' ');
  const fronds = [];
  for (let i = 0; i < 10; i++) {
    const ax = -47 + i * 10.5 + (rng() - 0.5) * 5;
    const ay = -14 - Math.cos((i / 9 - 0.5) * Math.PI) * 12 + rng() * 4;
    const p0 = [ax, ay];
    const p1 = [ax + (rng() - 0.5) * 8, ay + 36 + rng() * 8];
    const p2 = [ax + (rng() - 0.5) * 16, ay + 72 + rng() * 16];
    const leaflets = [];
    for (let j = 0; j < 11; j++) {
      const t = 0.14 + (j / 10) * 0.86;
      const [lx, ly] = qPt(p0, p1, p2, t);
      const [tx, ty] = qPt(p0, p1, p2, Math.min(t + 0.05, 1));
      const ang = (Math.atan2(ty - ly, tx - lx) * 180) / Math.PI;
      leaflets.push({
        x: R(lx + (j % 2 ? 3 : -3)), y: R(ly), rot: R(ang + (j % 2 ? 32 : -32)),
        fill: j % 3 === 0 ? pal.front : j % 3 === 1 ? pal.mid : mix(pal.mid, pal.rim, 0.4),
      });
    }
    fronds.push({
      spine: `M ${R(p0[0])} ${R(p0[1])} Q ${R(p1[0])} ${R(p1[1])} ${R(p2[0])} ${R(p2[1])}`,
      ox: R(p0[0]), oy: R(p0[1]), leaflets,
      birth: R(2.7 + rng() * 1.7), dur: R(5 + rng() * 2.5), delay: R(rng() * -6),
    });
  }
  return {
    trunkH: h, trunkD,
    bark: [
      `M ${R(-bw * 0.35)} -8 Q ${R(-bw * 0.2)} ${R(-h * 0.4)} ${R(2)} ${R(-h * 0.7)}`,
      `M ${R(bw * 0.4)} -6 Q ${R(bw * 0.4)} ${R(-h * 0.35)} ${R(6)} ${R(-h * 0.62)}`,
      // finer linework: short weathered streaks on the leaning bole
      `M ${R(-bw * 0.62)} -4 Q ${R(-bw * 0.5)} ${R(-h * 0.2)} ${R(-bw * 0.2)} ${R(-h * 0.36)}`,
      `M 0 ${R(-h * 0.5)} Q 3 ${R(-h * 0.62)} 5.5 ${R(-h * 0.78)}`,
    ],
    knots: [
      { x: -3, y: R(-h * 0.3), rx: 2.4, ry: 3.2 },
      { x: 4, y: R(-h * 0.54), rx: 1.8, ry: 2.6 },
    ],
    branches: [
      { d: limb(0, 6, -32, -16, 4.6, 1.6, -11), birth: 2.4, droop: 16 },
      { d: limb(2, 4, 28, -20, 4.2, 1.5, 9), birth: 2.6, droop: 14 },
      { d: limb(0, 0, -4, -34, 3.2, 1.1, -3), birth: 2.85, droop: 8 },
    ],
    sils: [
      { d: blob(rng, 0, -24, 47, 25, 11), ox: 0, oy: -24, birth: 2.75 },
      { d: blob(rng, -22, -32, 30, 16, 9), ox: -22, oy: -32, birth: 3.1 },
      { d: blob(rng, 20, -34, 28, 15, 9), ox: 20, oy: -34, birth: 3.3 },
    ],
    leaves: scatter(rng, pal, { cx: 0, cy: -26, rx: 42, ry: 21, count: 72, rMin: 4.5, rMax: 8, birthMin: 2.6, birthMax: 4.6 }),
    fronds,
    shadeLo: [{ cx: 3, cy: -16, rx: 38, ry: 17 }, { cx: -22, cy: -26, rx: 22, ry: 12 }],
    shadeHi: [{ cx: -12, cy: -32, rx: 28, ry: 14 }],
    rims: rims(rng, 0, -28, 40, 19, 7),
    rims2: rims2(rng, 0, -30, 38, 18, 26),
    dabs: microDabs(
      rng,
      [[0, -24, 40, 20], [-22, -32, 26, 13], [20, -34, 24, 12]],
      14,
      mix(pal.front, pal.rim, 0.5),
      mix(pal.mid, pal.back, 0.5)
    ),
    // last two fruits are the stage-5 birds-eye accents low in the curtain
    fruits: Array.from({ length: 9 }, () => ({ x: R((rng() - 0.5) * 88), y: R(8 + rng() * 44), rot: 0 })),
    sparkles: sparkles(rng, 0, -16, 46, 40, 6),
    fallers: fallers(rng, 0, -10, 40, 3, pal.mid),
    fallen: fallenLeaves(rng, 4),
    canopyDX: 8, // arching trunk: canopy hangs off the leaned top
  };
}

const BUILDERS = { oak: buildOak, birch: buildBirch, pine: buildPine, maple: buildMaple, willow: buildWillow };

// Species-specific stage-5 celebration fruit (drawn around local 0,0).
const FRUIT_STROKE = { stroke: '#111', strokeWidth: 1, vectorEffect: 'non-scaling-stroke' };
function Fruit({ kind }) {
  switch (kind) {
    case 'birch': // golden catkin dangling from a tiny stem
      return (
        <g>
          <path d="M 0 0 C 0.6 1.6 0.2 2.6 0 3.6" fill="none" stroke="#3a3325" strokeWidth="1" vectorEffect="non-scaling-stroke" />
          <path d="M 0 4 L 0 11.5" stroke={GOLD} strokeWidth="3.6" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
        </g>
      );
    case 'pine': // small discreet cone, self-outlined to keep the flat look
      return (
        <g>
          <ellipse cx="0" cy="2.4" rx="2.6" ry="3.8" fill="#7a5638" stroke="#1e2f23" strokeWidth="1" vectorEffect="non-scaling-stroke" />
          <path d="M -1.8 0.8 Q 0 2 1.8 0.8 M -2 3 Q 0 4.2 2 3" fill="none" stroke="#4f3a25" strokeWidth="1" vectorEffect="non-scaling-stroke" />
          <circle cx="-0.8" cy="0.6" r="1" fill={GOLD} />
        </g>
      );
    case 'maple': // golden glint nestled in the yellow crown clusters
      return (
        <g>
          <path d="M 0 -5 L 1.3 -1.3 L 5 0 L 1.3 1.3 L 0 5 L -1.3 1.3 L -5 0 L -1.3 -1.3 Z" fill={GOLD} stroke="#a87b22" strokeWidth="1" vectorEffect="non-scaling-stroke" />
          <circle cx="0" cy="0" r="1.2" fill="#fff7df" />
        </g>
      );
    case 'willow': // bud on a curl
      return (
        <g>
          <path d="M 0 -2 Q 1.6 -4.2 0.6 -6.4" fill="none" stroke="#3a3325" strokeWidth="1" vectorEffect="non-scaling-stroke" />
          <circle cx="0" cy="0" r="2.4" fill={GOLD} {...FRUIT_STROKE} />
        </g>
      );
    case 'oak': // acorn: brown nut, darker textured cap, little stem
    default:
      return (
        <g>
          <path d="M 0 -3.4 L 0 -6.2" stroke="#5a3d1e" strokeWidth="1.2" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
          <ellipse cx="0" cy="1.6" rx="3" ry="4" fill="#b5773a" {...FRUIT_STROKE} />
          <path d="M -3.6 -1.6 Q 0 -5 3.6 -1.6 Q 3.4 -0.2 0 0.4 Q -3.4 -0.2 -3.6 -1.6 Z" fill="#6b4a26" {...FRUIT_STROKE} />
          <path d="M -2 -2.8 L -1.4 -1 M 0 -3.4 L 0 -1.2 M 2 -2.8 L 1.4 -1" fill="none" stroke="#4a3118" strokeWidth="1" vectorEffect="non-scaling-stroke" />
          <circle cx="-1.1" cy="1.2" r="0.9" fill="#d09a5c" />
        </g>
      );
  }
}

function Tree({ stage = 0, wilted = false, kind = 'oak', size = 140, seed }) {
  const safeKind = KINDS[kind] ? kind : 'oak';
  const pal = KINDS[safeKind];
  const sd = Number.isFinite(Number(seed)) ? Number(seed) >>> 0 : pal.seed;
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, '');

  // Geometry is built exactly once per (kind, seed) — growth ticks only
  // re-evaluate the cheap stage→transform math below.
  const T = useMemo(() => BUILDERS[safeKind](mulberry32(sd * 9301 + 49297), KINDS[safeKind]), [safeKind, sd]);

  const s = clamp(Number(stage) || 0, 0, 5);
  const mature = s >= 4.995 && !wilted;
  const grow = (birth, span = 0.55) => clamp((s - birth) / span, 0, 1);

  // --- structural growth schedule ---------------------------------------
  const moundScale = (0.4 + 0.6 * clamp(s, 0, 1)) * clamp((1.8 - s) / 0.8, 0, 1);
  const sproutScale = clamp((s - 0.3) / 0.7, 0, 1) * clamp((2.4 - s) / 0.5, 0, 1);
  const cotOpen = clamp((s - 0.45) / 0.75, 0, 1); // cotyledon pair unfurls
  const trueLeafK = clamp((s - 1.05) / 0.7, 0, 1); // first true leaves
  const trunkT = clamp((s - 1.6) / 3.4, 0, 1);
  const trunkScaleY = Math.pow(trunkT, 0.8);
  const trunkScaleX = lerp(0.32, 1, trunkT);
  const trunkTopY = GROUND_Y - T.trunkH * trunkScaleY;
  const canopyT = clamp((s - 2.3) / 2.7, 0, 1);
  const canopyScale = lerp(0.5, 1, Math.pow(canopyT, 0.85)) * (mature ? 1.04 : 1);
  const canopyOn = s > 2.35;
  const shadowK = 0.15 + 0.85 * clamp(s / 5, 0, 1);

  const trunkFill = wilted ? (safeKind === 'birch' ? WILT_BIRCH_TRUNK : WILT_TRUNK) : pal.trunk;
  const branchFill = wilted ? WILT_TRUNK : pal.trunkDk;
  const lf = (c) => (wilted ? wiltLeaf(c) : c);
  const rim2Fill = lf(mix(pal.rim, '#ffffff', 0.55)); // finer, brighter rim pass

  // REAL leaf instances: every texture leaf is a <use> of a species leaf
  // silhouette (5-lobed maple star, lobed oak leaf, serrated birch oval,
  // lanceolate willow blade) — scaled so it covers the old dab's footprint.
  const leafVariants = LEAF_PATHS[safeKind] ? LEAF_PATHS[safeKind].length : 0;
  const leafEls = (layer) =>
    T.leaves
      .filter((l) => l.layer === layer)
      .map((l, i) => {
        const k = grow(l.birth);
        const leafScale = clamp(l.rx / 5, 0.55, 1.7);
        return leafVariants ? (
          <use
            key={`${layer}${i}`}
            href={`#leaf-${uid}-${i % leafVariants}`}
            fill={wilted ? l.wfill : l.fill}
            className="cs-tree__leaf cs-tree__tint"
            style={{
              transform: `translate(${l.x}px, ${l.y}px) rotate(${l.rot}deg) scale(${R(Math.max(k, 0.001) * leafScale)})`,
              opacity: k > 0.02 ? 1 : 0,
            }}
          />
        ) : (
          <ellipse
            key={`${layer}${i}`}
            cx="0" cy="0" rx={l.rx} ry={l.ry}
            fill={wilted ? l.wfill : l.fill}
            className="cs-tree__leaf cs-tree__tint"
            style={{
              transform: `translate(${l.x}px, ${l.y}px) rotate(${l.rot}deg) scale(${Math.max(k, 0.001)})`,
              opacity: k > 0.02 ? 1 : 0,
            }}
          />
        );
      });

  // bold-outlined lobed clusters (maple / oak canopies), per depth layer
  const clusterEls = (layer) =>
    (T.clusters || [])
      .filter((c) => c.layer === layer)
      .map((c, i) => {
        const k = grow(c.birth, 0.7);
        return (
          <path
            key={`c${layer}${i}`}
            d={c.d}
            fill={wilted ? c.wfill : c.fill}
            className="cs-tree__leaf cs-tree__tint"
            style={{ transform: `scale(${Math.max(k, 0.001)})`, transformOrigin: `${c.ox}px ${c.oy}px`, opacity: k > 0.02 ? 1 : 0 }}
            {...OUTLINE}
          />
        );
      });

  const glowE = T.glow || [0, -40, 80, 64];

  // wilt slump per depth layer (sway is disabled while wilted, so these apply)
  const slump = (deg, dy) =>
    wilted ? { transform: `rotate(${deg}deg) translate(0px, ${dy}px)`, transformOrigin: '0px 0px' } : undefined;

  return (
    <svg
      className={`cs-tree${wilted ? ' cs-tree--wilted' : ''}${mature ? ' cs-tree--mature' : ''}`}
      width={size}
      height={(size * VIEW_H) / VIEW_W}
      viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
      role="img"
      aria-label={`${safeKind} tree, growth stage ${s.toFixed(1)} of 5${wilted ? ', wilted' : ''}${mature ? ', fully grown' : ''}`}
    >
      <defs>
        <radialGradient id={`hi-${uid}`}>
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.42" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </radialGradient>
        <radialGradient id={`lo-${uid}`}>
          <stop offset="0%" stopColor="#13240f" stopOpacity="0.38" />
          <stop offset="100%" stopColor="#13240f" stopOpacity="0" />
        </radialGradient>
        <radialGradient id={`glow-${uid}`}>
          <stop offset="0%" stopColor={GOLD} stopOpacity="0.45" />
          <stop offset="100%" stopColor={GOLD} stopOpacity="0" />
        </radialGradient>
        <radialGradient id={`shadow-${uid}`}>
          <stop offset="0%" stopColor="#1d2a18" stopOpacity="0.32" />
          <stop offset="100%" stopColor="#1d2a18" stopOpacity="0" />
        </radialGradient>
        {/* species leaf silhouettes — instanced by every texture leaf below.
            The open vein subpath strokes; the closed blade takes the per-use
            fill (defs paths carry no fill of their own). */}
        {(LEAF_PATHS[safeKind] || []).map((d, v) => (
          <path
            key={v}
            id={`leaf-${uid}-${v}`}
            d={d}
            stroke="rgba(20, 24, 12, 0.35)"
            strokeWidth="0.7"
            strokeLinecap="round"
          />
        ))}
      </defs>

      {/* soft elliptical ground shadow */}
      <ellipse
        className="cs-tree__grow"
        cx="0" cy="0" rx="52" ry="11"
        fill={`url(#shadow-${uid})`}
        style={{ transform: `translate(${CX}px, ${GROUND_Y + 2}px) scale(${shadowK})` }}
      />

      <g
        className="cs-tree__grow"
        style={{ transform: `rotate(${wilted ? -3 : 0}deg)`, transformOrigin: `${CX}px ${GROUND_Y}px` }}
      >
        {/* seed mound (stage 0–1.8) */}
        <g
          className="cs-tree__grow"
          style={{
            transform: `translate(${CX}px, ${GROUND_Y}px) scale(${Math.max(moundScale, 0.001)})`,
            opacity: moundScale > 0.02 ? 1 : 0,
          }}
        >
          <ellipse cx="0" cy="0" rx="15" ry="6.5" fill="#5c400f" {...OUTLINE} />
          <ellipse cx="-4" cy="-1.5" rx="6" ry="3" fill="#6d4d15" stroke="none" />
          <circle cx="1" cy="-4" r="3.2" fill="#3d2e0f" {...OUTLINE} />
        </g>

        {/* trunk + bark texture */}
        <g
          className="cs-tree__grow"
          style={{
            transform: `translate(${CX}px, ${GROUND_Y}px) scale(${Math.max(trunkScaleX, 0.001)}, ${Math.max(trunkScaleY, 0.001)})`,
            opacity: trunkScaleY > 0.02 ? 1 : 0,
          }}
        >
          <path d={T.trunkD} fill={trunkFill} className="cs-tree__tint" {...OUTLINE} />
          {T.bark.map((d) => (
            <path key={d} d={d} fill="none" stroke={pal.trunkDk} strokeWidth="1.6" strokeLinecap="round" opacity="0.7" vectorEffect="non-scaling-stroke" />
          ))}
          {T.lenticels &&
            T.lenticels.map((m, i) => (
              <path key={i} d={`M ${m.x - m.w / 2} ${m.y} h ${m.w}`} stroke="#23201a" strokeWidth="2.2" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
            ))}
          {T.knots.map((k, i) => (
            <ellipse key={i} cx={k.x} cy={k.y} rx={k.rx} ry={k.ry} fill={k.dark ? '#23201a' : 'none'} stroke={pal.trunkDk} strokeWidth="1.3" vectorEffect="non-scaling-stroke" />
          ))}
          {T.tuft &&
            T.tuft.map((d, i) => (
              <path key={d} d={d} fill="none" stroke={wilted ? WILT_LEAF : i % 2 ? '#4d6b40' : '#5f8350'} strokeWidth="1.6" strokeLinecap="round" vectorEffect="non-scaling-stroke" className="cs-tree__tintstroke" />
            ))}
        </g>

        {/* sprout: stem + unfurling cotyledon pair + first true leaves */}
        <g
          className="cs-tree__grow"
          style={{
            transform: `translate(${CX}px, ${GROUND_Y}px) scale(${Math.max(sproutScale, 0.001)})`,
            opacity: sproutScale > 0.02 ? 1 : 0,
          }}
        >
          <path d="M 0 -2 C 1.2 -10 -1 -17 0 -25" fill="none" stroke="#111" strokeWidth="4.6" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
          <path d="M 0 -2 C 1.2 -10 -1 -17 0 -25" fill="none" stroke={lf(pal.mid)} strokeWidth="2.6" strokeLinecap="round" vectorEffect="non-scaling-stroke" className="cs-tree__tint" />
          <g className="cs-tree__grow" style={{ transform: `rotate(${lerp(52, 4, cotOpen)}deg)`, transformOrigin: '0px -18px' }}>
            <path d="M 0 -18 C -5 -20 -12 -20 -16.5 -26 C -9.5 -29.5 -2 -25 0 -18 Z" fill={lf(pal.mid)} className="cs-tree__tint" {...OUTLINE} />
          </g>
          <g className="cs-tree__grow" style={{ transform: `rotate(${lerp(-52, -4, cotOpen)}deg)`, transformOrigin: '0px -19px' }}>
            <path d="M 0 -19 C 5 -21 12 -21 16.5 -27 C 9.5 -30.5 2 -26 0 -19 Z" fill={lf(pal.front)} className="cs-tree__tint" {...OUTLINE} />
          </g>
          <g className="cs-tree__grow" style={{ transform: `scale(${Math.max(trueLeafK, 0.001)})`, transformOrigin: '0px -25px', opacity: trueLeafK > 0.02 ? 1 : 0 }}>
            <path d="M 0 -25 C -3 -29 -8 -31 -9.5 -36.5 C -4 -38 0.5 -32 0 -25 Z" fill={lf(pal.front)} className="cs-tree__tint" {...OUTLINE} />
            <path d="M 0 -27 C 3 -31 8 -33 9.5 -38.5 C 4 -40 -0.5 -34 0 -27 Z" fill={lf(pal.rim)} className="cs-tree__tint" {...OUTLINE} />
          </g>
        </g>

        {/* fallen brown leaves at the base while wilted */}
        <g className="cs-tree__grow" style={{ opacity: wilted && s > 2.2 ? 1 : 0 }}>
          {T.fallen.map((l, i) => (
            <ellipse key={i} cx={l.x} cy={l.y} rx={l.rx} ry={l.rx * 0.45} fill="#8a7c55" stroke="#5f553a" strokeWidth="1" vectorEffect="non-scaling-stroke" transform={`rotate(${l.rot} ${l.x} ${l.y})`} />
          ))}
        </g>

        {/* canopy assembly, anchored to the (moving) trunk top */}
        <g
          className="cs-tree__grow"
          style={{
            transform: `translate(${CX + T.canopyDX * trunkScaleY}px, ${trunkTopY + 4}px) scale(${Math.max(canopyScale, 0.001)}) rotate(${wilted ? -7 : 0}deg) translate(0px, ${wilted ? 5 : 0}px)`,
            opacity: canopyOn ? 1 : 0,
          }}
        >
          {/* mature ambient glow (per-species extent) */}
          <ellipse className="cs-tree__glow" cx={glowE[0]} cy={glowE[1]} rx={glowE[2]} ry={glowE[3]} fill={`url(#glow-${uid})`} style={{ opacity: mature ? 1 : 0 }} />

          {/* main branches + secondary twigs, each growing from the trunk top */}
          <g className="cs-tree__grow" style={slump(-2, 2)}>
            {T.branches.map((b, i) => {
              const k = grow(b.birth, 0.7);
              return (
                <path
                  key={i}
                  d={b.d}
                  fill={b.light ? trunkFill : branchFill}
                  className="cs-tree__leaf cs-tree__tint"
                  style={{ transform: `scale(${Math.max(k, 0.001)})`, transformOrigin: '0px 4px', opacity: k > 0.02 ? 1 : 0 }}
                  {...OUTLINE}
                />
              );
            })}
            {/* fine underside shading strokes along limbs (oak fork volume) */}
            {(T.branchShade || []).map((b, i) => {
              const k = grow(b.birth, 0.7);
              return (
                <path
                  key={`bs${i}`}
                  d={b.d}
                  fill="none"
                  stroke={wilted ? WILT_TRUNK : mix(pal.trunkDk, '#111111', 0.3)}
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  vectorEffect="non-scaling-stroke"
                  className="cs-tree__leaf cs-tree__tintstroke"
                  style={{ transform: `scale(${Math.max(k, 0.001)})`, transformOrigin: '0px 4px', opacity: k > 0.02 ? 0.55 : 0 }}
                />
              );
            })}
          </g>

          {/* BACK depth layer: lobed silhouettes (primary outline) + dark leaves */}
          <g className="cs-tree__layer cs-tree__layer--back" style={slump(-2.5, 2)}>
            {T.sils.map((sil, i) => {
              const k = grow(sil.birth, 0.8);
              return (
                <path
                  key={i}
                  d={sil.d}
                  fill={lf(pal.back)}
                  className="cs-tree__leaf cs-tree__tint"
                  style={{ transform: `scale(${Math.max(k, 0.001)})`, transformOrigin: `${sil.ox}px ${sil.oy}px`, opacity: k > 0.02 ? 1 : 0 }}
                  {...OUTLINE}
                />
              );
            })}
            {T.tiers &&
              T.tiers.map((t) => {
                const k = grow(t.birth, 0.7);
                return (
                  <g
                    key={t.y}
                    className="cs-tree__leaf"
                    style={{ transform: `scale(${Math.max(k, 0.001)})`, transformOrigin: `0px ${t.y}px`, opacity: k > 0.02 ? 1 : 0 }}
                  >
                    {/* flat-look swag: dark-green self-outline, not the ink outline */}
                    <path
                      d={t.d}
                      fill={wilted ? t.wfill : t.fill}
                      className="cs-tree__tint"
                      stroke="#1e2f23" strokeWidth="1.5" strokeLinejoin="round" vectorEffect="non-scaling-stroke"
                    />
                    {t.speckles.map((sp, j) => (
                      <circle key={j} cx={sp[0]} cy={sp[1]} r={sp[2]} fill={pal.rim} opacity="0.55" />
                    ))}
                    {/* feathered needle fans hanging under the scallop fringe */}
                    {t.fans && (
                      <path
                        d={t.fans}
                        fill="none"
                        stroke={wilted ? t.wfanStroke : t.fanStroke}
                        strokeWidth="1"
                        strokeLinecap="round"
                        vectorEffect="non-scaling-stroke"
                        className="cs-tree__tintstroke"
                        opacity="0.85"
                      />
                    )}
                  </g>
                );
              })}
            {T.leader &&
              (() => {
                const k = grow(T.leader.birth, 0.4);
                return (
                  <path
                    d={T.leader.d}
                    fill="none"
                    stroke={lf(pal.back)}
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    vectorEffect="non-scaling-stroke"
                    className="cs-tree__leaf cs-tree__tintstroke"
                    style={{ transform: `scale(${Math.max(k, 0.001)})`, transformOrigin: `0px ${T.leader.oy}px`, opacity: k > 0.02 ? 1 : 0 }}
                  />
                );
              })()}
            {clusterEls('back')}
            {leafEls('back')}
          </g>

          {/* thin twigs over the back clusters (maple: branches thread the gaps) */}
          {T.overBranches && (
            <g className="cs-tree__grow" style={slump(-2.5, 2)}>
              {T.overBranches.map((b, i) => {
                const k = grow(b.birth, 0.7);
                return (
                  <path
                    key={i}
                    d={b.d}
                    fill={branchFill}
                    className="cs-tree__leaf cs-tree__tint"
                    style={{ transform: `scale(${Math.max(k, 0.001)})`, transformOrigin: '0px 4px', opacity: k > 0.02 ? 1 : 0 }}
                    {...OUTLINE}
                  />
                );
              })}
            </g>
          )}

          {/* core shading (ambient occlusion) */}
          {T.shadeLo.map((e, i) => (
            <ellipse key={i} cx={e.cx} cy={e.cy} rx={e.rx} ry={e.ry} fill={`url(#lo-${uid})`} className="cs-tree__grow" style={{ opacity: canopyT }} />
          ))}

          {/* MID depth layer */}
          <g className="cs-tree__layer cs-tree__layer--mid" style={slump(-4, 4)}>
            {clusterEls('mid')}
            {leafEls('mid')}
            {T.starLeaves &&
              T.starLeaves.map((sl, i) => {
                const k = grow(sl.birth);
                return (
                  <path
                    key={i}
                    d={T.starPath}
                    fill={lf(mix(pal.back, '#5e1f10', 0.4))}
                    className="cs-tree__leaf cs-tree__tint"
                    style={{
                      transform: `translate(${sl.x}px, ${sl.y}px) rotate(${sl.rot}deg) scale(${Math.max(k * sl.s, 0.001)})`,
                      opacity: k > 0.02 ? 0.9 : 0,
                    }}
                  />
                );
              })}
          </g>

          {/* willow: cascading fronds of leaflets hanging below the branch line */}
          {T.fronds && (
            <g style={slump(-3, 3)}>
              {T.fronds.map((f, i) => {
                const k = grow(f.birth, 0.7);
                return (
                  <g
                    key={i}
                    className="cs-tree__frond"
                    style={{ transformOrigin: `${f.ox}px ${f.oy}px`, animationDuration: `${f.dur}s`, animationDelay: `${f.delay}s` }}
                  >
                    <g
                      className="cs-tree__leaf"
                      style={{ transform: `scale(${Math.max(k, 0.001)})`, transformOrigin: `${f.ox}px ${f.oy}px`, opacity: k > 0.02 ? 1 : 0 }}
                    >
                      <path d={f.spine} fill="none" stroke={lf(pal.back)} strokeWidth="1.7" strokeLinecap="round" vectorEffect="non-scaling-stroke" className="cs-tree__tintstroke" />
                      {f.leaflets.map((l, j) => (
                        <ellipse
                          key={j}
                          cx="0" cy="0" rx="4.4" ry="1.9"
                          fill={lf(l.fill)}
                          className="cs-tree__tint"
                          transform={`translate(${l.x} ${l.y}) rotate(${l.rot})`}
                        />
                      ))}
                    </g>
                  </g>
                );
              })}
            </g>
          )}

          {/* FRONT depth layer: brightest leaves */}
          <g className="cs-tree__layer cs-tree__layer--front" style={slump(-5.5, 5)}>
            {clusterEls('front')}
            {leafEls('front')}
            {/* tiny two-tone dabs inside the biggest clusters — micro texture */}
            {(T.dabs || []).map((d, i) => {
              const k = grow(d.birth, 0.5);
              return (
                <ellipse
                  key={`d${i}`}
                  cx="0" cy="0" rx={d.rx} ry={d.ry}
                  fill={wilted ? d.wfill : d.fill}
                  className="cs-tree__leaf cs-tree__tint"
                  style={{
                    transform: `translate(${d.x}px, ${d.y}px) rotate(${d.rot}deg) scale(${Math.max(k, 0.001)})`,
                    opacity: k > 0.02 ? 0.9 : 0,
                  }}
                />
              );
            })}
          </g>

          {/* top-light volume + shimmering rim highlights */}
          {T.shadeHi.map((e, i) => (
            <ellipse key={i} cx={e.cx} cy={e.cy} rx={e.rx} ry={e.ry} fill={`url(#hi-${uid})`} className="cs-tree__grow" style={{ opacity: canopyT * 0.9 }} />
          ))}
          <g className="cs-tree__rims" style={{ opacity: wilted ? 0 : undefined }}>
            {T.rims.map((r, i) => {
              const k = grow(3.4 + i * 0.18, 0.5);
              return <circle key={i} cx={r.x} cy={r.y} r={r.r} fill={lf(pal.rim)} className="cs-tree__leaf cs-tree__tint" style={{ opacity: k * 0.85 }} />;
            })}
            {/* second, finer rim pass: smaller brighter dabs on the lit side */}
            {(T.rims2 || []).map((r, i) => {
              const k = grow(r.birth, 0.5);
              return <circle key={`r2${i}`} cx={r.x} cy={r.y} r={r.r} fill={rim2Fill} className="cs-tree__leaf cs-tree__tint" style={{ opacity: k * 0.9 }} />;
            })}
          </g>

          {/* stage-5 celebration: species fruit pops in */}
          <g className="cs-tree__grow cs-tree__fruit" style={{ transform: `scale(${mature ? 1 : 0.001})`, opacity: mature ? 1 : 0 }}>
            {T.fruits.map((fr, i) => (
              <g key={i} transform={`translate(${fr.x} ${fr.y}) rotate(${fr.rot})`}>
                <Fruit kind={safeKind} />
              </g>
            ))}
          </g>

          {/* mature fireflies */}
          <g className="cs-tree__grow" style={{ opacity: mature ? 1 : 0 }}>
            {T.sparkles.map((sp, i) => (
              <circle
                key={i}
                cx={sp.x} cy={sp.y} r={sp.r}
                fill={GOLD}
                className="cs-tree__sparkle"
                style={{ animationDelay: `${sp.delay}s`, animationDuration: `${sp.dur}s` }}
              />
            ))}
          </g>

          {/* occasional falling leaves */}
          <g className="cs-tree__grow" style={{ opacity: canopyOn && !wilted ? 1 : 0 }}>
            {T.fallers.map((fl, i) => (
              <g key={i} className="cs-tree__fall" style={{ animationDelay: `${fl.delay}s`, animationDuration: `${fl.dur}s` }}>
                <ellipse cx={fl.x} cy={fl.y} rx="3.6" ry="1.9" fill={fl.fill} stroke="#33401f" strokeWidth="1" vectorEffect="non-scaling-stroke" />
              </g>
            ))}
          </g>
        </g>
      </g>
    </svg>
  );
}



// Memoized: on the 1s growth tick only the actively-growing tree changes
// props; every other tree on the plot/groves (hundreds of SVG elements each)
// skips re-rendering entirely.
export default memo(Tree);
