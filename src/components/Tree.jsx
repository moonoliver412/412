import { memo, useId, useMemo } from 'react';
import './Tree.css';

// ---------------------------------------------------------------------------
// <Tree /> — high-detail procedural SVG tree for the Forest mechanic.
//
//   stage  : float 0–5, continuous. Growth is STRUCTURAL: seed → cotyledon
//            sprout → seedling → sapling (first branches) → young tree →
//            mature celebration (fruit, glow, sparkles).
//   wilted : drooping branches, brown-olive foliage, fallen leaves, no sway.
//   kind   : 'oak' | 'birch' | 'pine' | 'maple' | 'willow' | 'cherry' |
//            'bamboo' | 'sunflower' (unknown → oak)
//   size   : rendered pixel width (height = size * 1.25).
//   seed   : optional number — deterministic per-instance shape variation.
//
// All geometry (branches, lobed clusters / conifer tiers, bark, fruit,
// sparkles) is generated ONCE per (kind, seed) with a seeded PRNG inside
// useMemo, so the per-second growth ticks only update stage-driven transforms.
//
// Forest-style redesign pass (P1–P8):
//   P1 toy proportions — chunky short trunks, oversized rounded canopies.
//   P2 mass construction — every canopy is 2–4 big rounded masses, each with
//      a TWO-TONE lighter scallop cap on the upper-left lit side; the
//      instanced real-leaf detail stays, but as texture INSIDE the masses.
//   P3 soft linework — foliage edges are low-contrast darker SELF-edges
//      (deep tone of the same fill); only trunks/wood keep the bold outline.
//   P4 calmer palette — milkier, less saturated fills, identity hue kept.
//   P5 silhouette-first — eight distinct silhouette classes (dome, slim
//      column, tiered spike, flame dome, weeping curtain, blossom cloud,
//      pole grove, lollipop flower).
//   P6 one signature each — oak acorns, maple golden crown, pine droop+cones,
//      birch bold lenticels, willow floor-length fronds, cherry blossom dots,
//      bamboo segmented culms, sunflower giant golden head.
//   P7 universal seedling — shared seed → cotyledon sprout for all kinds.
//   P8 pop-and-settle — birth/stage transitions overshoot then settle.
//
// Species notes (matched to the user's reference art):
//   maple : autumn fire — deep-red shadow clusters low/outside, scarlet and
//           vivid-orange mids, golden crown last; dark branches in the gaps.
//   oak   : cartoon clouds in 3 greens on a forked caramel trunk;
//           stage-5 acorns dangle below cluster edges.
//   pine  : flat tall conifer — 13 drooping speckled swag tiers with feathered
//           needle-fan undersides + pointed crown/leader, bare trunk + tuft.
//   cherry: slender dark trunk under a cloud of soft pink masses, white-pink
//           blossom dots, falling petals; full bloom + white highlights at 5.
//   bamboo: grove of 3–5 segmented culms (node rings, blade tufts at upper
//           nodes), no canopy mass; grows culm-by-culm and node-by-node;
//           mature = tallest culm + golden glints at the tips.
//   sunflower: thick green stem, big leaves low, giant head (brown seed disc
//           + golden petal ring) that lifts upright as it grows; mature =
//           open head with seed spiral + glow; wilted = head bows over.
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

// P4 calmer palette: every fill is shifted milkier / pastel-ward (lower
// saturation, higher lightness) while keeping the species' identity hue.
const KINDS = {
  // oak: classic 3-green cloud dome, caramel trunk — softened lime/kelly/deep
  oak: { seed: 11, trunk: '#c79a63', trunkDk: '#9a7244', back: '#4f8f51', mid: '#79b865', front: '#a3d385', rim: '#cdeaa9' },
  // birch: chalk-white trunk (signature), milky sage canopy
  birch: { seed: 23, trunk: '#f4f0e4', trunkDk: '#c9c2ad', back: '#84a05e', mid: '#a6bf78', front: '#c4d693', rim: '#e3eab2' },
  // pine: deep conifer hue kept, lifted toward milky sage tiers
  pine: { seed: 37, trunk: '#937352', trunkDk: '#74573c', back: '#455f44', mid: '#6c8a63', front: '#87a378', rim: '#b5c99c' },
  // maple: autumn fire kept — rust → soft scarlet → apricot → creamy gold
  maple: { seed: 53, trunk: '#9b6a50', trunkDk: '#71492f', back: '#b34d33', mid: '#df7a4a', front: '#f2a055', rim: '#f7cd7e' },
  willow: { seed: 71, trunk: '#95764f', trunkDk: '#74573a', back: '#6b8c58', mid: '#90ae74', front: '#b1ca90', rim: '#d6e5ad' },
  // cherry: slender cocoa trunk, cloud of milky pink blossom masses
  cherry: { seed: 83, trunk: '#6b5048', trunkDk: '#4f3a33', back: '#eaa0b8', mid: '#f3bccd', front: '#f9d4df', rim: '#fdeaf0' },
  // bamboo: fresh celadon culms — trunk slots double as culm tones
  bamboo: { seed: 97, trunk: '#a8cc8b', trunkDk: '#7ca261', back: '#79a763', mid: '#97c07d', front: '#b6d698', rim: '#d9ebbb' },
  // sunflower: leafy green stem, butter-gold petal tones
  sunflower: { seed: 113, trunk: '#93b069', trunkDk: '#6f8b4a', back: '#e0a945', mid: '#ecc163', front: '#f5d781', rim: '#fbe9ad' },
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
  // cherry: small rounded blossom petals / petal-oval leaf with a notched tip
  cherry: [
    'M 0 1.8 L 0 0.3 C -3.2 -0.6 -4.6 -3.4 -3.8 -6.6 C -3 -9.4 -1.4 -10.6 -0.3 -9 L 0 -8.4 L 0.3 -9 C 1.4 -10.6 3 -9.4 3.8 -6.6 C 4.6 -3.4 3.2 -0.6 0 0.3 Z M 0 -0.6 L 0 -7.6',
    'M 0 1.6 L 0 0.3 C -2.6 -0.4 -3.9 -2.6 -3.5 -5.4 C -3.1 -8 -1.6 -9.6 0 -10.2 C 1.6 -9.6 3.1 -8 3.5 -5.4 C 3.9 -2.6 2.6 -0.4 0 0.3 Z M 0 -0.5 L 0 -8.6',
    'M 0 2 L 0 0.4 C -2.2 -0.8 -3 -3.2 -2.4 -5.8 C -1.9 -8.2 -0.9 -9.8 0 -11 C 0.9 -9.8 1.9 -8.2 2.4 -5.8 C 3 -3.2 2.2 -0.8 0 0.4 Z M 0 -0.6 L 0 -9.2',
  ],
  // bamboo: slender tapering blades (straight + wind-bent), long thin midrib
  bamboo: [
    'M 0 1.4 L 0 0.2 C -1.4 -1.8 -1.7 -6.2 -0.9 -10 C -0.5 -12 0.5 -13.4 0.7 -13.8 C 1.5 -10.8 1.7 -5.4 0.9 -1.6 C 0.7 -0.8 0.3 -0.2 0 0.2 Z M 0 -0.8 L 0.5 -11.6',
    'M 0 1.4 L 0 0.2 C -1.8 -2.2 -2.6 -6 -1.6 -9.4 C -0.9 -11.6 1 -13 2.2 -13.2 C 2.4 -10 1.6 -5 0.4 -1.8 C 0.2 -1 0.1 -0.4 0 0.2 Z M 0 -0.8 L 1.2 -11',
  ],
  // sunflower: plump rounded ray petal with a softly creased midline
  sunflower: [
    'M 0 1.2 L 0 0.2 C -2.6 -1 -3.8 -4 -3.4 -7.4 C -3 -10.6 -1.6 -12.6 0 -13.2 C 1.6 -12.6 3 -10.6 3.4 -7.4 C 3.8 -4 2.6 -1 0 0.2 Z M 0 -0.6 L 0 -11.4',
    'M 0 1.2 L 0 0.2 C -3 -0.8 -4.4 -3.6 -4 -6.6 C -3.6 -9.6 -1.8 -11.6 0 -12.2 C 1.8 -11.6 3.6 -9.6 4 -6.6 C 4.4 -3.6 3 -0.8 0 0.2 Z M 0 -0.6 L 0 -10.4',
  ],
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

// P3 soft linework: foliage edges are darker SELF-tones of the fill, not ink.
const selfEdge = (fill) => mix(fill, '#13240f', 0.42);
// P2 two-tone shading: lighter scallop cap on the upper-left lit side.
const capTone = (fill) => mix(fill, '#ffffff', 0.3);

// Toned, layer-tagged lobed cluster (canopies are stacks of these). Each
// cluster carries its lit-side cap blob + soft self-edge color (P2/P3).
function clump(rng, x, y, rx, ry, fill, layer, birth, lobes = 9) {
  return {
    d: blob(rng, x, y, rx, ry, lobes),
    capD: blob(rng, x - rx * 0.2, y - ry * 0.34, rx * 0.58, ry * 0.5, Math.max(6, lobes - 2)),
    ox: x, oy: y, fill, wfill: wiltLeaf(fill),
    cap: capTone(fill), wcap: wiltLeaf(capTone(fill)),
    edge: selfEdge(fill), wedge: wiltLeaf(selfEdge(fill)),
    layer, birth,
  };
}

// Big back-silhouette mass with the same two-tone lit cap (birch / willow).
function silo(rng, x, y, rx, ry, lobes, birth) {
  return {
    d: blob(rng, x, y, rx, ry, lobes),
    capD: blob(rng, x - rx * 0.2, y - ry * 0.34, rx * 0.56, ry * 0.48, Math.max(6, lobes - 2)),
    ox: x, oy: y, birth,
  };
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
  // P1 toy proportions: stubby chunky bole, dome ≈ 2× the trunk's visual mass.
  const h = 46, bw = 14.5, tw = 9.5;
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
    // P2 masses-first: three BIG unifying dome masses appear before any
    // cluster, so the canopy reads as rounded masses with clusters as texture.
    sils: [
      silo(rng, -28, -42, 42, 30, 11, 2.5),
      silo(rng, 26, -44, 40, 29, 11, 2.7),
      silo(rng, 0, -64, 34, 25, 10, 3.0),
    ],
    // subtle underside shading along each fork limb (kept inside silhouette)
    branchShade: [
      { d: 'M -6 10 Q -20 -2 -32 -22', birth: 2.45 },
      { d: 'M -3 8 Q -8 -16 -10 -40', birth: 2.65 },
      { d: 'M 4 8 Q 10 -14 13 -36', birth: 2.8 },
      { d: 'M 6 10 Q 22 0 34 -18', birth: 2.95 },
    ],
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
  // P1: trunk shortened/widened (still the roster's slim column silhouette);
  // P6: chalk-white bark with BOLDER black lenticel dashes.
  const h = 100, bw = 8, tw = 4.6;
  const trunkD = [
    `M ${R(-bw - 3)} 0 Q ${R(-bw)} -6 ${R(-bw * 0.85)} ${R(-h * 0.3)}`,
    `Q ${R(-bw * 0.6)} ${R(-h * 0.6)} ${R(-tw + 1.5)} ${-h} L ${R(tw + 2)} ${-h}`,
    `Q ${R(bw * 0.7)} ${R(-h * 0.55)} ${R(bw * 0.9)} ${R(-h * 0.25)}`,
    `Q ${bw} -6 ${R(bw + 3)} 0 Z`,
  ].join(' ');
  const lenticels = Array.from({ length: 15 }, (_, i) => ({
    x: R((rng() - 0.5) * 7), y: R(-h * (0.07 + i * 0.058) - rng() * 4), w: R(5.5 + rng() * 4.5),
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
      silo(rng, -15, -28, 27, 23, 9, 2.7),
      silo(rng, 13, -46, 29, 25, 9, 3.05),
      silo(rng, -7, -66, 24, 20, 8, 3.45),
      silo(rng, 26, -28, 20, 16, 8, 2.95),
      silo(rng, 0, -82, 17, 14, 8, 3.85),
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
  // bare trunk at the bottom and a grass tuft at the base.
  // P1: shorter, chunkier bole — the drooping tier stack carries the mass.
  const h = 40, bw = 8.5, tw = 6.5;
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
    // P2 two-tone: lighter lit stroke along each tier's upper-left edge.
    const th = hw * 0.5 + 7;
    const capLine = `M ${R(-hw * 0.9)} ${R(y + droop * 0.55)} Q ${R(-hw * 0.5)} ${R(y - th * 0.32)} ${R(-hw * 0.12)} ${R(y - th * 0.78)}`;
    return {
      d: swagTier(rng, y, hw, droop), y, birth, fill, wfill: wiltLeaf(fill),
      edge: selfEdge(fill), wedge: wiltLeaf(selfEdge(fill)),
      capLine, cap: capTone(fill), wcap: wiltLeaf(capTone(fill)),
      speckles, fans: fans.trim(), fanStroke: needleStroke, wfanStroke: wiltLeaf(needleStroke),
    };
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
  // P1: trunk shortened + widened so the flame dome dominates.
  const h = 50, bw = 13.5, tw = 8;
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
    // P2 masses-first: big rust under-masses lay down the flame dome before
    // the scarlet/orange/gold clusters texture it.
    sils: [
      silo(rng, -26, -36, 40, 28, 11, 2.45),
      silo(rng, 24, -38, 38, 27, 11, 2.6),
      silo(rng, 0, -60, 34, 25, 10, 2.9),
    ],
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
  // P1: shorter arching bole; P6 signature: FLOOR-LENGTH fronds — the curtain
  // sweeps all the way down to the ground line (local +h below the crown).
  const h = 64, bw = 11, tw = 6;
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
    const p1 = [ax + (rng() - 0.5) * 8, ay + 40 + rng() * 8];
    const p2 = [ax + (rng() - 0.5) * 16, 56 + rng() * 8]; // tips kiss the ground
    const leaflets = [];
    for (let j = 0; j < 12; j++) {
      const t = 0.12 + (j / 11) * 0.88;
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
      silo(rng, 0, -24, 49, 27, 11, 2.75),
      silo(rng, -22, -34, 31, 17, 9, 3.1),
      silo(rng, 20, -36, 29, 16, 9, 3.3),
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

function buildCherry(rng, pal) {
  // New silhouette class: blossom cloud — slender curved cocoa trunk under
  // 3 oversized milky-pink masses (P1/P2). P6 signature: white-pink blossom
  // dots; PETALS (not leaves) drift down; stage 5 = full bloom with white
  // five-petal highlight blossoms.
  const h = 48, bw = 6, tw = 3.4;
  const trunkD = [
    `M ${R(-bw - 3.5)} 0 Q ${R(-bw + 0.5)} -8 ${R(-bw * 0.55)} ${R(-h * 0.4)}`,
    `Q ${R(-bw * 0.1)} ${R(-h * 0.72)} ${R(3 - tw)} ${-h} L ${R(3 + tw)} ${-h}`,
    `Q ${R(bw * 0.95)} ${R(-h * 0.55)} ${R(bw * 0.9)} ${R(-h * 0.22)}`,
    `Q ${R(bw + 1)} -6 ${R(bw + 3.5)} 0 Z`,
  ].join(' ');
  const clusters = [
    // three BIG masses (left / right / crown) + two small fillers
    clump(rng, -22, -24, 23, 17, pal.back, 'back', 2.6, 10),
    clump(rng, 22, -26, 22, 16, pal.mid, 'back', 2.8, 10),
    clump(rng, -1, -26, 16, 12, pal.back, 'mid', 2.95),
    clump(rng, 0, -50, 25, 18, pal.mid, 'mid', 3.15, 10),
    clump(rng, -17, -58, 14, 11, pal.front, 'front', 3.8),
    clump(rng, 16, -58, 13, 10, pal.front, 'front', 3.95),
  ];
  return {
    trunkH: h, trunkD,
    bark: [
      `M ${R(-bw * 0.3)} -8 Q ${R(-bw * 0.1)} ${R(-h * 0.4)} ${R(1.5)} ${R(-h * 0.68)}`,
      `M ${R(bw * 0.4)} -5 Q ${R(bw * 0.42)} ${R(-h * 0.3)} ${R(4)} ${R(-h * 0.56)}`,
    ],
    knots: [{ x: -1.5, y: R(-h * 0.42), rx: 1.6, ry: 2.2 }],
    branches: [
      { d: limb(-2, 6, -26, -28, 4, 1.2, -7), birth: 2.4, droop: 14 },
      { d: limb(2, 4, 24, -32, 3.6, 1.1, 6), birth: 2.6, droop: 12 },
      { d: limb(0, 2, -3, -48, 2.8, 0.9, -3), birth: 2.85, droop: 8 },
    ],
    sils: [],
    clusters,
    leaves: scatter(rng, pal, { cx: 0, cy: -38, rx: 44, ry: 28, count: 64, rMin: 3, rMax: 5.5, birthMin: 2.7, birthMax: 4.8, round: 0.9 }),
    shadeLo: [{ cx: 2, cy: -24, rx: 40, ry: 18 }],
    shadeHi: [{ cx: -8, cy: -52, rx: 26, ry: 14 }],
    rims: rims(rng, 0, -44, 40, 24, 7),
    rims2: rims2(rng, 0, -46, 38, 22, 26),
    dabs: microDabs(
      rng,
      [[-22, -24, 23, 17], [22, -26, 22, 16], [0, -50, 25, 18]],
      10,
      mix(pal.front, '#ffffff', 0.5),
      mix(pal.back, '#9c5a74', 0.5)
    ),
    // stage-5 white five-petal highlight blossoms scattered over the cloud
    fruits: [
      { x: -30, y: -22, rot: 0 }, { x: 26, y: -20, rot: 10 }, { x: -8, y: -36, rot: -8 },
      { x: 12, y: -52, rot: 6 }, { x: -20, y: -48, rot: -5 }, { x: 32, y: -38, rot: 8 },
      { x: 0, y: -62, rot: 0 }, { x: -36, y: -34, rot: -10 },
    ],
    sparkles: sparkles(rng, 0, -40, 42, 30, 6),
    // falling petals: soft pink, never browned
    fallers: Array.from({ length: 5 }, (_, i) => ({
      x: R((rng() - 0.5) * 80), y: R(-24 + rng() * 16),
      delay: R(i * 6 + rng() * 4), dur: R(13 + rng() * 5),
      fill: mix(pal.front, '#ffffff', rng() * 0.5),
    })),
    fallen: fallenLeaves(rng, 4),
    glow: [0, -40, 76, 56],
    canopyDX: 3, // curved trunk leans the cloud slightly off-axis
  };
}

function buildBamboo(rng, pal) {
  // New silhouette class: pole grove — NO canopy mass at all. Five segmented
  // culms of varying heights grow culm-by-culm AND node-by-node (every
  // section has its own birth); node rings + blade tufts at the upper nodes
  // are the P6 signature; stage 5 = the tall center culm tops out and golden
  // glints sit at the tips.
  const h = 9; // tiny root crown — the culms rise straight from the grove base
  const trunkD = 'M -12 0 Q -10 -6.5 -4.5 -8 L 4.5 -8 Q 10 -6.5 12 0 Q 6 -2.2 0 -1.6 Q -6 -2.2 -12 0 Z';
  const culmSpecs = [
    { x: -24, ch: 62, w: 4.6, birth: 2.5, layer: 'back', lean: -2.4 },
    { x: -11, ch: 104, w: 5.6, birth: 2.95, layer: 'mid', lean: -1.2 },
    { x: 1, ch: 136, w: 6.2, birth: 3.95, layer: 'front', lean: 0.4 },
    { x: 13, ch: 88, w: 5.2, birth: 3.35, layer: 'mid', lean: 1.6 },
    { x: 25, ch: 54, w: 4.2, birth: 2.7, layer: 'back', lean: 2.6 },
  ];
  const culms = [];
  const leaves = [];
  const fruits = [];
  for (const c of culmSpecs) {
    const n = Math.max(3, Math.round(c.ch / 23));
    const segLen = c.ch / n;
    const tone = mix(c.layer === 'back' ? pal.back : c.layer === 'mid' ? pal.mid : pal.trunk, pal.front, rng() * 0.25);
    const segs = [];
    for (let i = 0; i < n; i++) {
      segs.push({
        x: R(c.x + c.lean * (i / n) * 2), y0: R(4 - i * segLen), len: R(segLen + 0.6),
        // node-by-node: every section fully grown by 4.55 + 0.45 span = 5.0,
        // so the tall culm visibly tops out right at the mature lock.
        birth: R(Math.min(c.birth + i * 0.12, 4.55)),
      });
    }
    culms.push({
      segs, w: c.w, layer: c.layer,
      fill: tone, wfill: wiltLeaf(tone),
      cap: capTone(tone), wcap: wiltLeaf(capTone(tone)),
      edge: selfEdge(tone), wedge: wiltLeaf(selfEdge(tone)),
    });
    // blade tufts sprouting from the top two nodes of each culm
    for (let nd = 1; nd <= 2 && nd < n; nd++) {
      const ny = 4 - (n - nd) * segLen;
      const nx = c.x + c.lean * ((n - nd) / n) * 2;
      const side = nd % 2 ? 1 : -1;
      for (let b = 0; b < 3; b++) {
        const f = b === 0 ? pal.front : b === 1 ? pal.mid : mix(pal.mid, pal.rim, 0.4);
        leaves.push({
          x: R(nx + side * (c.w * 0.5 + 1)), y: R(ny + b * 1.6),
          rx: R(4.6 + rng() * 1.6), ry: 4,
          rot: R(side * (62 + b * 24) + (rng() - 0.5) * 14),
          fill: f, wfill: wiltLeaf(f), layer: c.layer,
          birth: R(Math.min(c.birth + (n - nd) * 0.12 + 0.2, 4.45)),
        });
      }
    }
    fruits.push({ x: R(c.x + c.lean * 2), y: R(4 - c.ch - 3), rot: 0 });
  }
  return {
    trunkH: h, trunkD,
    bark: [],
    knots: [],
    tuft: [
      'M -30 0 Q -31.5 -4 -30.5 -7', 'M -17 0 Q -17.5 -4.5 -16 -8',
      'M 18 0 Q 18.5 -4 17.5 -7.5', 'M 30 0 Q 31.5 -3.5 31 -6.5',
    ],
    branches: [],
    sils: [],
    culms,
    leaves,
    shadeLo: [], shadeHi: [],
    rims: [],
    fruits,
    sparkles: sparkles(rng, 0, -70, 30, 60, 6),
    fallers: fallers(rng, 0, -56, 26, 2, pal.mid),
    fallen: fallenLeaves(rng, 3),
    glow: [0, -70, 52, 84],
    canopyDX: 0,
  };
}

function buildSunflower(rng, pal) {
  // New silhouette class: lollipop flower — one thick green stem, big leaves
  // low, giant golden head. The head lifts upright while it grows (tilt → 0,
  // riding the rising stem top), opens ring-by-ring, and at 5 reveals the
  // golden-angle seed spiral + glow. Wilted: the head bows over completely.
  const h = 74, bw = 5, tw = 3.6;
  const trunkD = [
    `M ${R(-bw - 2)} 0 Q ${R(-bw)} -8 ${R(-bw * 0.8)} ${R(-h * 0.45)}`,
    `Q ${R(-bw * 0.72)} ${R(-h * 0.8)} ${-tw} ${-h} L ${tw} ${-h}`,
    `Q ${R(bw * 0.78)} ${R(-h * 0.7)} ${R(bw * 0.85)} ${R(-h * 0.35)}`,
    `Q ${R(bw)} -7 ${R(bw + 2)} 0 Z`,
  ].join(' ');
  const discR = 13.5;
  const petals = [];
  for (let i = 0; i < 16; i++) {
    // outer ray ring opens first…
    const a = (i / 16) * Math.PI * 2 - Math.PI / 2;
    petals.push({
      x: R(Math.cos(a) * (discR + 1.5)), y: R(Math.sin(a) * (discR + 1.5)),
      rot: R((a * 180) / Math.PI + 90), s: R(1.55 + rng() * 0.25), v: i % 2,
      fill: i % 2 ? pal.mid : pal.front,
      birth: R(3.05 + (i % 8) * 0.16 + rng() * 0.08),
    });
  }
  for (let i = 0; i < 11; i++) {
    // …then a brighter inner ring completes the open head
    const a = (i / 11) * Math.PI * 2 - Math.PI / 3;
    petals.push({
      x: R(Math.cos(a) * (discR - 3)), y: R(Math.sin(a) * (discR - 3)),
      rot: R((a * 180) / Math.PI + 90), s: R(1.1 + rng() * 0.2), v: (i + 1) % 2,
      fill: i % 2 ? pal.front : mix(pal.front, pal.rim, 0.6),
      birth: R(3.85 + (i % 6) * 0.1 + rng() * 0.05), // fully open by 5
    });
  }
  const spiral = [];
  for (let i = 0; i < 16; i++) {
    const a = i * 2.39996; // golden angle
    const r = 2.2 + Math.sqrt(i) * 2.35;
    spiral.push({ x: R(Math.cos(a) * r), y: R(Math.sin(a) * r), r: R(1 + i * 0.05) });
  }
  const leafGreen = mix(pal.trunk, pal.trunkDk, 0.4);
  return {
    trunkH: h, trunkD,
    bark: [`M 0 -6 Q 0.8 ${R(-h * 0.4)} 0 ${R(-h * 0.8)}`],
    knots: [],
    branches: [],
    sils: [],
    leaves: [],
    head: {
      y: -19, discR, tilt: 16, wiltBow: -88,
      petals, spiral,
      disc: '#9c6b3e', discIn: '#7c5330',
      // big droopy stem leaves LOW on the stalk (canopy coords: +y = down)
      stemLeaves: [
        { d: 'M 0 24 C -9 23 -18 18 -21.5 8.5 C -11.5 6.5 -2.5 13.5 0 24 Z', oy: 24, fill: leafGreen, birth: 2.5 },
        { d: 'M 0 28 C 9 27 18 22 21.5 12.5 C 11.5 10.5 2.5 17.5 0 28 Z', oy: 28, fill: mix(leafGreen, pal.trunkDk, 0.25), birth: 2.65 },
        { d: 'M 0 42 C -8 41 -16 37 -19 28.5 C -10 26.5 -2 33 0 42 Z', oy: 42, fill: mix(leafGreen, pal.trunkDk, 0.4), birth: 2.85 },
        { d: 'M 0 46 C 7.5 45 15 41 18 33 C 9.5 31 2 37.5 0 46 Z', oy: 46, fill: leafGreen, birth: 3.0 },
      ],
    },
    shadeLo: [], shadeHi: [],
    rims: [],
    // four golden dew-glints just outside the petal tips at stage 5
    fruits: [
      { x: -20, y: -32, rot: 0 }, { x: 19, y: -30, rot: 0 },
      { x: 0, y: -42, rot: 0 }, { x: -14, y: -4, rot: 0 },
    ],
    sparkles: sparkles(rng, 0, -22, 30, 26, 5),
    fallers: fallers(rng, 0, -16, 22, 2, pal.mid),
    fallen: fallenLeaves(rng, 3),
    glow: [0, -19, 48, 48],
    canopyDX: 0,
    wiltBow: -5, wiltDy: 2, // stem barely tips — the HEAD does the bowing
  };
}

const BUILDERS = {
  oak: buildOak, birch: buildBirch, pine: buildPine, maple: buildMaple, willow: buildWillow,
  cherry: buildCherry, bamboo: buildBamboo, sunflower: buildSunflower,
};

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
    case 'cherry': // white five-petal highlight blossom with a golden heart
      return (
        <g>
          <g fill="#fff6f9" stroke="#e8b8c9" strokeWidth="0.7" vectorEffect="non-scaling-stroke">
            <circle cx="0" cy="-2.7" r="1.8" />
            <circle cx="2.6" cy="-0.8" r="1.8" />
            <circle cx="1.6" cy="2.2" r="1.8" />
            <circle cx="-1.6" cy="2.2" r="1.8" />
            <circle cx="-2.6" cy="-0.8" r="1.8" />
          </g>
          <circle cx="0" cy="0" r="1.3" fill={GOLD} />
        </g>
      );
    case 'bamboo': // golden glint riding a culm tip
      return (
        <g>
          <path d="M 0 -4 L 1 -1 L 4 0 L 1 1 L 0 4 L -1 1 L -4 0 L -1 -1 Z" fill={GOLD} stroke="#a87b22" strokeWidth="1" vectorEffect="non-scaling-stroke" />
          <circle cx="0" cy="0" r="1" fill="#fff7df" />
        </g>
      );
    case 'sunflower': // dew-glint sparkling at the petal tips
      return (
        <g>
          <circle cx="0" cy="0" r="1.9" fill="#fff7df" stroke={GOLD} strokeWidth="1" vectorEffect="non-scaling-stroke" />
          <path d="M 0 -3.6 L 0 3.6 M -3.6 0 L 3.6 0" fill="none" stroke={GOLD} strokeWidth="1" vectorEffect="non-scaling-stroke" />
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

  // P2 mass-first canopy: each rounded mass = flat base + lighter scallop cap
  // on the upper-left lit side. P3: low-contrast darker SELF-edge, not ink.
  const clusterEls = (layer) =>
    (T.clusters || [])
      .filter((c) => c.layer === layer)
      .map((c, i) => {
        const k = grow(c.birth, 0.7);
        return (
          <g
            key={`c${layer}${i}`}
            className="cs-tree__leaf"
            style={{ transform: `scale(${Math.max(k, 0.001)})`, transformOrigin: `${c.ox}px ${c.oy}px`, opacity: k > 0.02 ? 1 : 0 }}
          >
            <path
              d={c.d}
              fill={wilted ? c.wfill : c.fill}
              stroke={wilted ? c.wedge : c.edge}
              strokeWidth="1.1" strokeLinejoin="round" vectorEffect="non-scaling-stroke"
              className="cs-tree__tint cs-tree__tintstroke"
            />
            <path d={c.capD} fill={wilted ? c.wcap : c.cap} className="cs-tree__tint" />
          </g>
        );
      });

  // bamboo culms: every culm SECTION is its own birth-staged element
  // (node-by-node growth) — segment body + lit-side stripe + node ring.
  const culmEls = (layer) =>
    (T.culms || [])
      .filter((c) => c.layer === layer)
      .flatMap((c, ci) =>
        c.segs.map((sg, si) => {
          const k = grow(sg.birth, 0.45);
          const w2 = c.w / 2;
          return (
            <g
              key={`u${ci}-${si}`}
              className="cs-tree__leaf"
              style={{ transform: `scale(${Math.max(k, 0.001)})`, transformOrigin: `${sg.x}px ${sg.y0}px`, opacity: k > 0.02 ? 1 : 0 }}
            >
              <rect
                x={R(sg.x - w2)} y={R(sg.y0 - sg.len)} width={c.w} height={sg.len} rx={R(w2 * 0.7)}
                fill={wilted ? c.wfill : c.fill}
                stroke={wilted ? c.wedge : c.edge}
                strokeWidth="1" vectorEffect="non-scaling-stroke"
                className="cs-tree__tint cs-tree__tintstroke"
              />
              <path
                d={`M ${R(sg.x - w2 * 0.45)} ${R(sg.y0 - sg.len + 2)} L ${R(sg.x - w2 * 0.45)} ${R(sg.y0 - 2)}`}
                fill="none" stroke={wilted ? c.wcap : c.cap} strokeWidth="1.3" strokeLinecap="round"
                vectorEffect="non-scaling-stroke" className="cs-tree__tintstroke" opacity="0.9"
              />
              <path
                d={`M ${R(sg.x - w2 - 0.9)} ${R(sg.y0 - sg.len)} L ${R(sg.x + w2 + 0.9)} ${R(sg.y0 - sg.len)}`}
                fill="none" stroke={wilted ? c.wedge : c.edge} strokeWidth="1.4" strokeLinecap="round"
                vectorEffect="non-scaling-stroke" className="cs-tree__tintstroke"
              />
            </g>
          );
        })
      );

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
            stroke={
              safeKind === 'cherry'
                ? 'rgba(146, 84, 104, 0.4)'
                : safeKind === 'sunflower'
                  ? 'rgba(146, 102, 28, 0.45)'
                  : 'rgba(20, 24, 12, 0.35)'
            }
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
              <path key={i} d={`M ${m.x - m.w / 2} ${m.y} h ${m.w}`} stroke="#1b1813" strokeWidth="3" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
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
            transform: `translate(${CX + T.canopyDX * trunkScaleY}px, ${trunkTopY + 4}px) scale(${Math.max(canopyScale, 0.001)}) rotate(${wilted ? (T.wiltBow ?? -7) : 0}deg) translate(0px, ${wilted ? (T.wiltDy ?? 5) : 0}px)`,
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

          {/* BACK depth layer: big soft-edged masses + dark leaves */}
          <g className="cs-tree__layer cs-tree__layer--back" style={slump(-2.5, 2)}>
            {T.sils.map((sil, i) => {
              const k = grow(sil.birth, 0.8);
              return (
                <g
                  key={i}
                  className="cs-tree__leaf"
                  style={{ transform: `scale(${Math.max(k, 0.001)})`, transformOrigin: `${sil.ox}px ${sil.oy}px`, opacity: k > 0.02 ? 1 : 0 }}
                >
                  <path
                    d={sil.d}
                    fill={lf(pal.back)}
                    stroke={lf(selfEdge(pal.back))}
                    strokeWidth="1.1" strokeLinejoin="round" vectorEffect="non-scaling-stroke"
                    className="cs-tree__tint cs-tree__tintstroke"
                  />
                  <path d={sil.capD} fill={lf(capTone(pal.back))} className="cs-tree__tint" />
                </g>
              );
            })}
            {culmEls('back')}
            {T.tiers &&
              T.tiers.map((t) => {
                const k = grow(t.birth, 0.7);
                return (
                  <g
                    key={t.y}
                    className="cs-tree__leaf"
                    style={{ transform: `scale(${Math.max(k, 0.001)})`, transformOrigin: `0px ${t.y}px`, opacity: k > 0.02 ? 1 : 0 }}
                  >
                    {/* flat-look swag: soft darker SELF-edge (P3), lit cap stroke (P2) */}
                    <path
                      d={t.d}
                      fill={wilted ? t.wfill : t.fill}
                      className="cs-tree__tint cs-tree__tintstroke"
                      stroke={wilted ? t.wedge : t.edge} strokeWidth="1.2" strokeLinejoin="round" vectorEffect="non-scaling-stroke"
                    />
                    <path
                      d={t.capLine}
                      fill="none"
                      stroke={wilted ? t.wcap : t.cap}
                      strokeWidth="2.4" strokeLinecap="round" vectorEffect="non-scaling-stroke"
                      className="cs-tree__tintstroke"
                      opacity="0.8"
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
            {culmEls('mid')}
            {clusterEls('mid')}
            {leafEls('mid')}
            {/* sunflower: giant head — lifts upright as it grows (tilt → 0 on
                the rising stem top), opens ring-by-ring, seed spiral at 5;
                wilted = the head bows over completely at the stem top. */}
            {T.head &&
              (() => {
                const H = T.head;
                const hk = grow(2.95, 0.9);
                const tilt = wilted ? H.wiltBow : lerp(H.tilt, 0, canopyT);
                return (
                  <g>
                    {H.stemLeaves.map((sl, i) => {
                      const k = grow(sl.birth, 0.6);
                      return (
                        <path
                          key={`sl${i}`}
                          d={sl.d}
                          fill={lf(sl.fill)}
                          stroke={lf(selfEdge(sl.fill))}
                          strokeWidth="1" strokeLinejoin="round" vectorEffect="non-scaling-stroke"
                          className="cs-tree__leaf cs-tree__tint cs-tree__tintstroke"
                          style={{ transform: `scale(${Math.max(k, 0.001)})`, transformOrigin: `0px ${sl.oy}px`, opacity: k > 0.02 ? 1 : 0 }}
                        />
                      );
                    })}
                    <g className="cs-tree__grow" style={{ transform: `rotate(${tilt}deg)`, transformOrigin: '0px 2px' }}>
                      <g
                        className="cs-tree__leaf"
                        style={{ transform: `translate(0px, ${H.y}px) scale(${Math.max(hk, 0.001)})`, opacity: hk > 0.02 ? 1 : 0 }}
                      >
                        {H.petals.map((p, i) => {
                          const k = grow(p.birth, 0.5);
                          return (
                            <use
                              key={`p${i}`}
                              href={`#leaf-${uid}-${p.v}`}
                              fill={lf(p.fill)}
                              className="cs-tree__leaf cs-tree__tint"
                              style={{ transform: `translate(${p.x}px, ${p.y}px) rotate(${p.rot}deg) scale(${R(Math.max(k, 0.001) * p.s)})`, opacity: k > 0.02 ? 1 : 0 }}
                            />
                          );
                        })}
                        <circle
                          cx="0" cy="0" r={H.discR}
                          fill={lf(H.disc)}
                          stroke={lf(mix(H.disc, '#3c2814', 0.5))}
                          strokeWidth="1.2" vectorEffect="non-scaling-stroke"
                          className="cs-tree__tint cs-tree__tintstroke"
                        />
                        <circle cx="0" cy="0" r={R(H.discR * 0.62)} fill={lf(H.discIn)} className="cs-tree__tint" />
                        {H.spiral.map((sp, i) => {
                          const k = grow(4.45 + i * 0.02, 0.4);
                          return (
                            <circle
                              key={`sp${i}`}
                              cx={sp.x} cy={sp.y} r={sp.r}
                              fill={lf(mix(H.discIn, '#3c2814', 0.55))}
                              className="cs-tree__leaf cs-tree__tint"
                              style={{ opacity: k * 0.9 }}
                            />
                          );
                        })}
                        <circle cx="-4" cy="-4" r="2.6" fill="#fff7df" className="cs-tree__grow" style={{ opacity: mature ? 0.55 : 0 }} />
                      </g>
                    </g>
                  </g>
                );
              })()}
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
            {culmEls('front')}
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
