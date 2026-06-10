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
const BAMBOO_GOLD = '#c4aa72'; // desaturated grove gold (panel hex)
const WILT_LEAF = '#9a8f6a';
const WILT_TRUNK = '#6f6552';
const WILT_BIRCH_TRUNK = '#c9c2ac';
const wiltLeaf = (c) => mix(c, WILT_LEAF, 0.78);

// Species wilt undertones — every wilt keeps 20–30% of its identity hue over
// a warm undertone (sad but recoverable, never cold dead gray):
//   maple → greyed amber, cherry → greyed pink (a touch darker/cooler),
//   pine → warm gray #9a9890, willow curtains → green-gray.
// rewilt() retargets the precomputed w* tones on built geometry in one pass.
function rewilt(items, f) {
  for (const it of items) {
    if (it.fill) it.wfill = f(it.fill);
    if (it.cap) it.wcap = f(it.cap);
    if (it.edge) it.wedge = f(it.edge);
  }
}

// Iteration-2 palette pass: canopy base greens normalized into the
// #7aaa6e–#8ab870 band (oak is the anchor); species with a prescribed hue
// (birch yellow-lime, maple fire, cherry dusty rose, bamboo deep culm green,
// sunflower orange-gold) take their panel hexes verbatim.
const KINDS = {
  // oak: classic 3-green cloud dome, caramel trunk — the band anchor
  oak: { seed: 11, trunk: '#c79a63', trunkDk: '#9a7244', back: '#4f8f51', mid: '#79b865', front: '#a3d385', rim: '#cdeaa9' },
  // birch: pale birch-white trunk (signature), yellow-lime column canopy
  birch: { seed: 23, trunk: '#f4f0e4', trunkDk: '#c9c2ad', back: '#7e9a52', mid: '#9ab86a', front: '#b8d47e', rim: '#d8e8a4' },
  // pine: deep conifer hue kept, mids nudged toward the shared green band
  pine: { seed: 37, trunk: '#937352', trunkDk: '#74573c', back: '#455f44', mid: '#6f9466', front: '#8aaa7c', rim: '#b5c99c' },
  // maple: autumn fire kept — rust → soft scarlet → apricot → creamy gold
  maple: { seed: 53, trunk: '#9b6a50', trunkDk: '#71492f', back: '#b34d33', mid: '#df7a4a', front: '#f2a055', rim: '#f7cd7e' },
  // willow: crown in the shared band; the CURTAINS use deep forest #4a7c3f
  willow: { seed: 71, trunk: '#95764f', trunkDk: '#74573a', back: '#5d8a52', mid: '#7aaa6e', front: '#94bc80', rim: '#c2dba0' },
  // cherry: dusty-rose blossom masses (#d4849a base / #edafc0 cap, no whites)
  cherry: { seed: 83, trunk: '#6b5048', trunkDk: '#4f3a33', back: '#c0708a', mid: '#d4849a', front: '#e09cb1', rim: '#edafc0' },
  // bamboo: culm green deepened/cooled ~20% L toward true green (off the
  // teal #6e8c8a grass); trunk slots double as culm tones
  bamboo: { seed: 97, trunk: '#74a05c', trunkDk: '#527741', back: '#4f7a44', mid: '#669a55', front: '#7fb469', rim: '#a9cf8a' },
  // sunflower: #6a8e5a stem family, orange-gold petals (off UI amber)
  sunflower: { seed: 113, trunk: '#6a8e5a', trunkDk: '#4f7042', back: '#cf8d1e', mid: '#e8a020', front: '#f0b23c', rim: '#f7cd6e' },
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
// Uniform lit-cap rule (iteration 2): cap = mix(base, #ffffff, 0.38),
// always on the upper-left lit side — identical recipe for all 8 species.
const capTone = (fill) => mix(fill, '#ffffff', 0.38);

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
  // Iteration 2: bole up 46→52 for tile presence (s5 ≥ 60% of cell height).
  const h = 52, bw = 14.5, tw = 9.5;
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
    // s2.4 signal: a SECOND leaf cluster pops beside the sprout's true
    // leaves while the fork hint (branches, birth 2.3) is still bare wood.
    clump(rng, -7, -16, 9, 7, pal.mid, 'mid', 2.35, 7),
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
    // s4.3→s5 structural growth: the crown gains two real masses (+ the
    // mature scale bump in render ⇒ ~+15% canopy versus stage 4.3).
    clump(rng, -8, -98, 12, 10, pal.front, 'front', 4.7),
    clump(rng, 16, -94, 10, 8, mix(pal.front, pal.rim, 0.4), 'front', 4.82),
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
    // celebration acorns: BIGGER and FEWER (iteration 2) — six ≥6-unit
    // glyphs dangling below cluster edges, scaled 1.5× at render time.
    fruits: [
      { x: -58, y: -34, rot: -8, s: 1.5 }, { x: -30, y: -16, rot: 5, s: 1.5 },
      { x: 0, y: -13, rot: -4, s: 1.5 }, { x: 30, y: -17, rot: 7, s: 1.5 },
      { x: 56, y: -34, rot: -6, s: 1.5 }, { x: -62, y: -54, rot: -10, s: 1.5 },
    ],
    sparkles: sparkles(rng, 0, -48, 58, 40, 6),
    fallers: fallers(rng, 0, -24, 50, 3, pal.mid),
    fallen: fallenLeaves(rng, 4),
    glow: [0, -52, 84, 62],
    canopyDX: 0,
  };
}

function buildBirch(rng, pal) {
  // Iteration 2 — committed COLUMN: two vertically stacked tight oval lobes
  // (total canopy width ≤60% of oak's), airy negative space at mid-height so
  // the pale trunk reads THROUGH the gap. Signature: birch-white #f4f0e4 bark
  // with 2–3 BOLD dark lenticel glyphs (#3a3020) readable at 80px. Base
  // thickened for tile presence. Wilt thins late foliage to expose sparse
  // branches instead of a uniform sag (wiltThin flag, used at render time).
  const h = 100, bw = 9.5, tw = 4.8;
  const trunkD = [
    `M ${R(-bw - 4.5)} 0 Q ${R(-bw)} -6 ${R(-bw * 0.85)} ${R(-h * 0.3)}`,
    `Q ${R(-bw * 0.6)} ${R(-h * 0.6)} ${R(-tw + 1.5)} ${-h} L ${R(tw + 2)} ${-h}`,
    `Q ${R(bw * 0.7)} ${R(-h * 0.55)} ${R(bw * 0.9)} ${R(-h * 0.25)}`,
    `Q ${bw} -6 ${R(bw + 4.5)} 0 Z`,
  ].join(' ');
  // 3 explicit bold lenticel glyphs — wide dashes, no random dust
  const lenticels = [
    { x: -1, y: R(-h * 0.26), w: 11 },
    { x: 0.8, y: R(-h * 0.5), w: 9 },
    { x: -0.6, y: R(-h * 0.74), w: 10 },
  ];
  const goldTip = mix(pal.front, '#d8c060', 0.5); // s5 golden shift
  const clusters = [
    // s2.4 signal: bark mark is already on the bole + ONE leaf tuft pops
    clump(rng, -9, -24, 9, 7, pal.mid, 'mid', 2.35, 7),
    // lower lobe texture
    clump(rng, 9, -34, 10, 8, pal.front, 'front', 3.0, 8),
    clump(rng, -11, -38, 9, 7, pal.back, 'back', 3.2, 7),
    // upper lobe texture
    clump(rng, -6, -70, 10, 8, pal.mid, 'mid', 3.6, 8),
    clump(rng, 9, -80, 9, 8, pal.front, 'front', 3.9, 7),
    // s4.3→s5: +15–20% canopy, crown pushing up with a golden shift
    clump(rng, 1, -92, 10, 8, goldTip, 'front', 4.45, 7),
    clump(rng, -12, -82, 8, 7, mix(pal.front, '#d8c060', 0.35), 'front', 4.6, 7),
  ];
  return {
    trunkH: h, trunkD,
    bark: [
      // faint vertical seams between the lenticel bands
      `M ${R(bw * 0.32)} -10 Q ${R(bw * 0.36)} ${R(-h * 0.3)} ${R(bw * 0.2)} ${R(-h * 0.5)}`,
      `M ${R(-bw * 0.36)} ${R(-h * 0.55)} Q ${R(-bw * 0.3)} ${R(-h * 0.7)} ${R(-bw * 0.15)} ${R(-h * 0.82)}`,
    ],
    lenticels,
    knots: [
      { x: -2.5, y: R(-h * 0.42), rx: 2.2, ry: 3, dark: true },
      { x: 1.8, y: R(-h * 0.66), rx: 1.7, ry: 2.4, dark: true },
    ],
    branches: [
      // the middle branch lives in the inter-lobe GAP so wilt exposes it
      { d: limb(-1, 8, -20, -30, 3, 1, -5), birth: 2.4, droop: 14 },
      { d: limb(1, 0, 17, -50, 2.8, 0.9, 5), birth: 2.7, droop: 12 },
      { d: limb(0, -4, -10, -64, 2.6, 0.8, -3), birth: 3.0, droop: 8 },
    ],
    // two tight stacked ovals — column silhouette, gap at y≈-52
    sils: [
      silo(rng, 0, -30, 24, 19, 9, 2.7),
      silo(rng, 2, -76, 21, 17, 9, 3.4),
    ],
    leaves: [
      ...scatter(rng, pal, { cx: 0, cy: -30, rx: 26, ry: 19, count: 48, rMin: 2.8, rMax: 5.2, birthMin: 2.6, birthMax: 4.4, round: 0.85 }),
      ...scatter(rng, pal, { cx: 2, cy: -76, rx: 23, ry: 17, count: 44, rMin: 2.8, rMax: 5.2, birthMin: 3.4, birthMax: 5.0, round: 0.85 }),
    ],
    shadeLo: [{ cx: 3, cy: -26, rx: 22, ry: 15 }],
    shadeHi: [{ cx: -4, cy: -78, rx: 18, ry: 13 }],
    rims: rims(rng, 1, -76, 20, 16, 6),
    rims2: [...rims2(rng, 0, -30, 22, 16, 12), ...rims2(rng, 2, -76, 20, 15, 12)],
    dabs: microDabs(
      rng,
      [[0, -30, 22, 17], [2, -76, 19, 15]],
      12,
      mix(pal.front, pal.rim, 0.5),
      mix(pal.mid, pal.back, 0.5)
    ),
    fruits: [
      { x: -16, y: -26, rot: -8 }, { x: 14, y: -36, rot: 10 }, { x: 20, y: -22, rot: 4 },
      { x: -14, y: -72, rot: -6 }, { x: 12, y: -82, rot: 8 }, { x: 0, y: -64, rot: 0 },
    ],
    clusters,
    sparkles: sparkles(rng, 0, -54, 26, 44, 6),
    fallers: fallers(rng, 0, -24, 24, 3, pal.mid),
    fallen: fallenLeaves(rng, 4),
    wiltThin: true, // wilt = sparse exposed branches, not a uniform sag
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
  // bottom → top; births bottom-first so a young pine reads as 2–3 tiers
  // (shifted past 2.4 so the first LATERAL BRANCH PAIR owns stage 2.4).
  // 13 tightly stacked tiers; iteration-2 sway taper: bottom 5 ride the
  // --back layer (full), middle 4 the --mid layer, apex 4 + leader a new
  // --tip layer at ~35% amplitude.
  const specs = [
    [0, 52, 12, 2.55, 'back'], [-20, 47, 11, 2.72, 'back'], [-39, 42.5, 10.5, 2.89, 'back'],
    [-57, 38, 10, 3.06, 'back'], [-74, 34, 9.5, 3.23, 'back'],
    [-90, 30, 9, 3.4, 'mid'], [-105, 26.5, 8.5, 3.57, 'mid'], [-119, 23, 8, 3.74, 'mid'],
    [-132, 20, 7.5, 3.91, 'mid'],
    [-144, 17, 7, 4.08, 'tip'], [-155, 14, 6, 4.25, 'tip'], [-165, 11, 5.5, 4.4, 'tip'],
    [-174, 8.5, 4.5, 4.52, 'tip'],
  ];
  // Iteration 2: NO per-needle strokes on tier edges — the swag scallops are
  // soft self-edged boundaries only. Lit caps switch to an explicit cooler
  // blue-green (#6a9e7a, ~+20 L*) drawn bolder so they read at tile size.
  const PINE_CAP = '#6a9e7a';
  const tiers = specs.map(([y, hw, droop, birth, band], i) => {
    const fill = i % 2 ? pal.mid : pal.back;
    const speckles = Array.from({ length: hw > 30 ? 8 : 5 }, () => [
      R((rng() - 0.5) * hw * 1.3), R(y - 6 + rng() * (droop + 8)), R(0.7 + rng() * 0.7),
    ]);
    const th = hw * 0.5 + 7;
    const capLine = `M ${R(-hw * 0.9)} ${R(y + droop * 0.55)} Q ${R(-hw * 0.5)} ${R(y - th * 0.32)} ${R(-hw * 0.12)} ${R(y - th * 0.78)}`;
    return {
      d: swagTier(rng, y, hw, droop), y, birth, band, fill, wfill: wiltLeaf(fill),
      edge: selfEdge(fill), wedge: wiltLeaf(selfEdge(fill)),
      capLine, cap: PINE_CAP, wcap: wiltLeaf(PINE_CAP),
      speckles,
    };
  });
  tiers.reverse(); // draw top tiers first so each fringe overlaps the one above
  // wilt: warm gray #9a9890 keeping the spike — never cold dead gray
  rewilt(tiers, (c) => mix(c, '#9a9890', 0.72));
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
    // s2.4 signal: the first lateral BRANCH PAIR pokes out before tier one
    branches: [
      { d: limb(0, 2, -16, -3, 2.4, 0.9, -2), birth: 2.32, droop: 8 },
      { d: limb(0, 2, 16, -4, 2.4, 0.9, 2), birth: 2.42, droop: 8 },
    ],
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
    // stage-5 trophy: a golden star/topper glint rides the leader (star:true
    // renders the topper glyph + warm rim halo); cones stay as supporting cast
    fruits: [
      { x: 0, y: -186, rot: 0, star: true },
      { x: -27, y: -34, rot: 6 }, { x: 24, y: -73, rot: -8 }, { x: -17, y: -110, rot: 5 },
      { x: 19, y: -52, rot: 7 }, { x: -14, y: -136, rot: -5 },
    ],
    sparkles: sparkles(rng, 0, -90, 32, 78, 6),
    // pine fallers are SHORT NEEDLES on a fast spin (dur ≈ half the default)
    fallers: fallers(rng, 0, -40, 30, 2, pal.mid).map((f) => ({ ...f, dur: R(8 + (f.dur - 15) * 0.5) })),
    fallen: fallenLeaves(rng, 3),
    glow: [0, -85, 70, 112],
    canopyDX: 0,
  };
}

function buildMaple(rng, pal) {
  // Fiery autumn maple — iteration 2: FLATTER, WIDER 4-lobe cauliflower at
  // ~2.5:1 canopy:trunk; crown width (~±88) visibly exceeds oak's (~±75).
  // Autumn fire + golden crown kept: deep-red shadows low/outside, scarlet
  // and vivid-orange mids, gold last; dark branches thread the lobe gaps.
  const h = 64, bw = 13.5, tw = 8;
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
    // deep-red shadow clusters — flat bottom row + the wide outer shoulders
    clump(rng, -22, -18, 16, 11, deepRed, 'back', 2.6),
    clump(rng, 20, -17, 16, 11, deepRed, 'back', 2.7),
    clump(rng, -54, -26, 17, 12, deepRed, 'back', 2.95),
    clump(rng, 52, -25, 16, 12, deepRed, 'back', 3.05),
    clump(rng, -76, -36, 13, 10, deepRed, 'back', 3.55),
    clump(rng, 74, -35, 13, 10, deepRed, 'back', 3.65),
    clump(rng, -68, -50, 12, 10, pal.back, 'back', 3.85),
    clump(rng, 66, -48, 12, 10, pal.back, 'back', 3.95),
    // scarlet mid clusters
    clump(rng, -4, -34, 15, 12, pal.mid, 'mid', 2.75),
    clump(rng, -36, -42, 15, 12, pal.mid, 'mid', 3.0),
    clump(rng, 34, -42, 15, 12, pal.mid, 'mid', 3.15),
    clump(rng, 6, -50, 13, 11, pal.mid, 'mid', 3.3),
    clump(rng, -18, -48, 12, 10, darkScarlet, 'mid', 3.45),
    clump(rng, -60, -44, 12, 10, darkScarlet, 'mid', 3.75),
    clump(rng, 58, -43, 12, 10, darkScarlet, 'mid', 3.85),
    // vivid orange uppers — they round off each of the four lobes
    clump(rng, -46, -58, 12, 10, pal.front, 'front', 3.5),
    clump(rng, 44, -56, 12, 10, pal.front, 'front', 3.6),
    clump(rng, -12, -64, 13, 11, pal.front, 'front', 3.7),
    clump(rng, 16, -62, 12, 10, pal.front, 'front', 3.8),
    clump(rng, -58, -60, 10, 8, pal.front, 'front', 4.0),
    clump(rng, 56, -56, 10, 8, pal.front, 'front', 4.1),
    // golden-yellow crown on the two CENTER lobes — the mature payoff
    clump(rng, -24, -82, 11, 9, pal.rim, 'front', 4.3),
    clump(rng, 18, -84, 11, 9, pal.rim, 'front', 4.4),
    clump(rng, -2, -76, 9, 7, mix(pal.front, pal.rim, 0.6), 'front', 4.45),
    clump(rng, -2, -94, 12, 10, pal.rim, 'front', 4.55),
    clump(rng, -40, -74, 9, 8, pal.rim, 'front', 4.65),
    clump(rng, 36, -72, 9, 8, pal.rim, 'front', 4.75),
  ];
  // wilt: greyed-amber — keeps ~28% of the fire over a warm undertone
  const amberWilt = (c) => mix(c, '#a89469', 0.72);
  rewilt(clusters, amberWilt);
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
      // dark skeleton threading up through the canopy (wider reach now)
      { d: limb(-3, 8, -42, -38, 5.6, 1.6, -9), birth: 2.3, droop: 14 },
      { d: limb(3, 8, 38, -40, 5.2, 1.5, 8), birth: 2.45, droop: 14 },
      { d: limb(0, 4, 2, -62, 3.4, 1.1, 3), birth: 2.7, droop: 8 },
      { d: limb(-30, -28, -60, -48, 1.9, 0.7, -4), birth: 2.9, droop: 12 },
      { d: limb(28, -30, 56, -50, 1.8, 0.7, 4), birth: 3.05, droop: 12 },
      { d: limb(-2, -44, -20, -74, 1.5, 0.6, -3), birth: 3.3, droop: 10 },
      { d: limb(4, -48, 24, -78, 1.4, 0.5, 3), birth: 3.5, droop: 10 },
    ],
    // thin twigs drawn OVER the back clusters so branches read through gaps
    overBranches: [
      { d: limb(-18, -38, -44, -60, 1.4, 0.5, -3), birth: 3.4 },
      { d: limb(16, -42, 40, -62, 1.3, 0.5, 3), birth: 3.6 },
      { d: limb(0, -56, -8, -82, 1.1, 0.4, -2), birth: 3.9 },
      { d: limb(-36, -52, -56, -66, 1.1, 0.4, -3), birth: 3.75 },
      { d: limb(32, -54, 52, -68, 1, 0.4, 3), birth: 3.95 },
    ],
    // P2 masses-first: FOUR lobe under-masses — the cauliflower silhouette
    // is laid down flat and wide before the fire clusters texture it.
    sils: [
      silo(rng, -56, -42, 33, 22, 11, 2.5),
      silo(rng, -18, -60, 35, 24, 11, 2.75),
      silo(rng, 20, -58, 34, 23, 11, 2.9),
      silo(rng, 54, -40, 31, 21, 10, 3.05),
    ],
    clusters,
    leaves: (() => {
      const lv = scatter(rng, pal, { cx: 0, cy: -48, rx: 62, ry: 32, count: 112, rMin: 4.5, rMax: 8, birthMin: 2.6, birthMax: 4.9 });
      rewilt(lv, amberWilt);
      return lv;
    })(),
    starLeaves: [
      // s2.4 signal: ONE orange-tinged maple leaf before the masses arrive
      { x: -5, y: -20, s: 1.35, rot: -14, birth: 2.34, fill: '#e0813c' },
      ...Array.from({ length: 9 }, () => ({
        x: R((rng() - 0.5) * 104), y: R(-48 + (rng() - 0.5) * 52), s: R(0.9 + rng() * 0.6), rot: R(rng() * 360), birth: R(3.2 + rng() * 1.4),
      })),
    ],
    starPath: star,
    shadeLo: [{ cx: 3, cy: -28, rx: 54, ry: 22 }, { cx: -42, cy: -40, rx: 26, ry: 15 }],
    shadeHi: [{ cx: -8, cy: -80, rx: 32, ry: 17 }],
    rims: rims(rng, 0, -62, 56, 28, 9),
    rims2: rims2(rng, 0, -64, 54, 26, 30),
    dabs: (() => {
      const db = microDabs(
        rng,
        [[-54, -26, 17, 12], [52, -25, 16, 12], [-36, -42, 15, 12], [34, -42, 15, 12], [-2, -94, 12, 10], [-24, -82, 11, 9]],
        9,
        mix(pal.front, pal.rim, 0.5),
        mix(pal.mid, '#5e1408', 0.35)
      );
      rewilt(db, amberWilt);
      return db;
    })(),
    // celebration: golden glints living in the yellow crown clusters
    fruits: [
      { x: -22, y: -82, rot: 0 }, { x: 14, y: -88, rot: 15 }, { x: -2, y: -98, rot: -10 },
      { x: -36, y: -74, rot: 8 }, { x: 30, y: -74, rot: -12 }, { x: -6, y: -72, rot: 20 },
      { x: 22, y: -94, rot: 5 },
    ],
    sparkles: sparkles(rng, 0, -80, 40, 26, 6),
    // s5 particles: samara helicopter-seed fallers (paired-wing glyph at
    // render time) spinning down from the wide crown
    fallers: fallers(rng, 0, -26, 56, 3, pal.front),
    fallen: fallenLeaves(rng, 4),
    glow: [0, -54, 96, 70],
    canopyDX: 0,
  };
}

function buildWillow(rng, pal) {
  // Iteration 2 STRUCTURAL REBUILD — the hairline-frond curtain is replaced
  // by FIVE thick grouped curtain arcs: chunky filled masses (~8–10 units
  // wide) with soft rounded tips, hanging well over 40% of the tree's height
  // below the crown edge. The trunk is +37% taller (panel: it read as a
  // bush), the crown is a narrower clear dome that is value-split from the
  // curtains: lighter cap up top, deep desaturated forest green (#4a7c3f
  // family) in the hanging curtain. Wilt: the curtain STRUCTURE survives —
  // strands sag longer/limper while the trunk stays upright.
  const h = 88, bw = 12, tw = 6;
  const trunkD = [
    `M ${R(-bw - 5)} 0 Q ${R(-bw)} -8 ${R(-bw * 0.7)} ${R(-h * 0.35)}`,
    `Q ${R(-bw * 0.2)} ${R(-h * 0.68)} ${R(8 - tw)} ${-h} L ${R(8 + tw)} ${-h}`,
    `Q ${R(bw * 0.9)} ${R(-h * 0.6)} ${R(bw)} ${R(-h * 0.28)}`,
    `Q ${R(bw + 1)} -6 ${R(bw + 5)} 0 Z`,
  ].join(' ');
  const CURTAIN = '#4a7c3f'; // deep forest green, distinctly darker than crown
  const curtainWilt = (c) => mix(c, '#8f8a6e', 0.73); // keeps ~27% green-gray
  // [anchor x, anchor y, length, half-width, tip drift]
  const curtainSpecs = [
    [-36, -22, 56, 5.4, -7], [-19, -16, 68, 6.4, -3], [0, -14, 76, 7, 2],
    [19, -17, 66, 6.2, 4], [36, -23, 54, 5.2, 8],
  ];
  const fronds = curtainSpecs.map(([ax, ay, len, w, drift], i) => {
    const lw = w * (0.95 + rng() * 0.15);
    const x1 = ax + drift * 0.5, y1 = ay + len * 0.55;
    const x2 = ax + drift, y2 = ay + len;
    // chunky looping mass: bulged sides, soft rounded tip
    const d = [
      `M ${R(ax - lw * 0.7)} ${R(ay)}`,
      `C ${R(ax - lw * 1.15)} ${R(ay + len * 0.22)} ${R(x1 - lw * 0.95)} ${R(y1 - len * 0.12)} ${R(x1 - lw * 0.72)} ${R(y1)}`,
      `C ${R(x1 - lw * 0.58)} ${R(y1 + len * 0.16)} ${R(x2 - lw * 0.52)} ${R(y2 - w * 1.5)} ${R(x2 - lw * 0.4)} ${R(y2 - w * 0.5)}`,
      `Q ${R(x2 - lw * 0.22)} ${R(y2 + w * 0.32)} ${R(x2 + lw * 0.04)} ${R(y2)}`,
      `Q ${R(x2 + lw * 0.34)} ${R(y2 + w * 0.12)} ${R(x2 + lw * 0.42)} ${R(y2 - w * 0.95)}`,
      `C ${R(x2 + lw * 0.58)} ${R(y2 - w * 2.1)} ${R(x1 + lw * 0.72)} ${R(y1 + len * 0.1)} ${R(x1 + lw * 0.82)} ${R(y1 - len * 0.06)}`,
      `C ${R(ax + lw * 1.12)} ${R(ay + len * 0.2)} ${R(ax + lw * 0.76)} ${R(ay + len * 0.05)} ${R(ax + lw * 0.7)} ${R(ay)}`,
      'Z',
    ].join(' ');
    const fill = mix(CURTAIN, pal.back, rng() * 0.22 + (i % 2 ? 0.12 : 0));
    // lit inner streak — keeps the mass reading as looping strands
    const hi = `M ${R(ax - lw * 0.18)} ${R(ay + 4)} C ${R(ax - lw * 0.34)} ${R(ay + len * 0.3)} ${R(x1 - lw * 0.26)} ${R(y1)} ${R(x2 - lw * 0.12)} ${R(y2 - w * 1.6)}`;
    // sparse leaflet texture INSIDE the mass (the mass reads first)
    const leaflets = Array.from({ length: 5 }, (_, j) => {
      const t = 0.2 + j * 0.17;
      return {
        x: R(lerp(ax, x2, t) + (j % 2 ? lw * 0.3 : -lw * 0.3)),
        y: R(lerp(ay, y2, t)),
        rot: R((j % 2 ? 24 : -24) + drift * 1.4),
        fill: mix(fill, j % 2 ? pal.mid : selfEdge(fill), 0.4),
      };
    });
    return {
      d, hi, ox: ax, oy: ay, leaflets,
      fill, wfill: curtainWilt(fill),
      edge: selfEdge(fill), wedge: curtainWilt(selfEdge(fill)),
      hiTone: mix(fill, '#ffffff', 0.22), whiTone: curtainWilt(mix(fill, '#ffffff', 0.22)),
      birth: R(2.7 + i * 0.38 + rng() * 0.2),
      dur: R(6.5 + rng() * 2), delay: R(rng() * -7),
      // wilt: sag longer + limper, pivoting from the anchor
      sag: `rotate(${R((drift > 0 ? 1 : -1) * 1.6)}deg) scale(0.97, 1.12)`,
    };
  });
  return {
    trunkH: h, trunkD,
    bark: [
      `M ${R(-bw * 0.35)} -8 Q ${R(-bw * 0.2)} ${R(-h * 0.4)} ${R(2)} ${R(-h * 0.7)}`,
      `M ${R(bw * 0.4)} -6 Q ${R(bw * 0.4)} ${R(-h * 0.35)} ${R(6)} ${R(-h * 0.62)}`,
      `M ${R(-bw * 0.62)} -4 Q ${R(-bw * 0.5)} ${R(-h * 0.2)} ${R(-bw * 0.2)} ${R(-h * 0.36)}`,
      `M 0 ${R(-h * 0.5)} Q 3 ${R(-h * 0.62)} 5.5 ${R(-h * 0.78)}`,
    ],
    knots: [
      { x: -3, y: R(-h * 0.3), rx: 2.4, ry: 3.2 },
      { x: 4, y: R(-h * 0.54), rx: 1.8, ry: 2.6 },
    ],
    branches: [
      { d: limb(0, 6, -26, -20, 4.6, 1.6, -10), birth: 2.4, droop: 16 },
      { d: limb(2, 4, 24, -24, 4.2, 1.5, 8), birth: 2.6, droop: 14 },
      { d: limb(0, 0, -4, -38, 3.2, 1.1, -3), birth: 2.85, droop: 8 },
    ],
    // narrower CLEAR dome — value-split from the dark curtain below it
    sils: [
      silo(rng, 4, -38, 30, 22, 10, 2.75),
      silo(rng, 2, -56, 22, 15, 9, 3.45),
    ],
    leaves: scatter(rng, pal, { cx: 2, cy: -44, rx: 27, ry: 19, count: 40, rMin: 4.5, rMax: 7.5, birthMin: 2.7, birthMax: 4.4 }),
    clusters: [
      clump(rng, 6, -28, 12, 10, pal.back, 'back', 2.6),
      clump(rng, -12, -44, 12, 10, pal.mid, 'mid', 3.1),
      clump(rng, 16, -42, 11, 9, pal.front, 'front', 3.3),
      // s4.3→s5 structural growth: crown gains two lit masses (+15–20%)
      clump(rng, 2, -70, 11, 9, pal.front, 'front', 4.5),
      clump(rng, -14, -60, 9, 8, pal.front, 'front', 4.65),
    ],
    fronds,
    shadeLo: [{ cx: 4, cy: -34, rx: 28, ry: 15 }],
    shadeHi: [{ cx: -6, cy: -52, rx: 22, ry: 13 }],
    rims: rims(rng, 2, -48, 26, 17, 7),
    rims2: rims2(rng, 2, -50, 25, 16, 22),
    dabs: microDabs(
      rng,
      [[4, -38, 26, 18], [2, -56, 19, 13]],
      12,
      mix(pal.front, pal.rim, 0.5),
      mix(pal.mid, pal.back, 0.5)
    ),
    // golden bud-curls living low in the curtain at stage 5
    fruits: Array.from({ length: 7 }, (_, i) => ({
      x: R(-38 + i * 13 + (rng() - 0.5) * 6), y: R(10 + rng() * 38), rot: 0,
    })),
    sparkles: sparkles(rng, 0, -20, 44, 44, 6),
    fallers: fallers(rng, 0, -12, 38, 3, pal.mid),
    fallen: fallenLeaves(rng, 4),
    glow: [0, -26, 80, 72], // same gradient + opacity ramp as every species
    uprightWilt: true, // trunk stays upright; only the curtain sags
    wiltBow: -3, wiltDy: 3, // crown dips gently — the curtain does the sagging
    canopyDX: 8, // arching trunk: canopy hangs off the leaned top
  };
}

function buildCherry(rng, pal) {
  // Iteration 2: LOOSER asymmetric popcorn outline — distinct masses with
  // visible negative-space gaps and ONE taller lobe breaking upward on the
  // right; 2–3 dark branch forks read through the bloom at s4.3/s5. Blossoms
  // are dusty rose #d4849a with #edafc0 highlight caps (no near-white
  // masses). s2.4 = one pink bud; s5 = denser bloom + richer petal-fall.
  const h = 56, bw = 6.5, tw = 3.4;
  const trunkD = [
    `M ${R(-bw - 4)} 0 Q ${R(-bw + 0.5)} -8 ${R(-bw * 0.55)} ${R(-h * 0.4)}`,
    `Q ${R(-bw * 0.1)} ${R(-h * 0.72)} ${R(3 - tw)} ${-h} L ${R(3 + tw)} ${-h}`,
    `Q ${R(bw * 0.95)} ${R(-h * 0.55)} ${R(bw * 0.9)} ${R(-h * 0.22)}`,
    `Q ${R(bw + 1)} -6 ${R(bw + 4)} 0 Z`,
  ].join(' ');
  const clusters = [
    // loose popcorn masses — gaps stay open between them
    clump(rng, -26, -20, 19, 14, pal.back, 'back', 2.6, 10),
    clump(rng, 22, -16, 16, 12, pal.mid, 'back', 2.85, 10),
    clump(rng, -14, -42, 13, 10, pal.back, 'mid', 3.3),
    // the TALLER lobe breaking upward (right of center)
    clump(rng, 8, -52, 15, 12, pal.mid, 'mid', 3.1, 10),
    clump(rng, 11, -72, 13, 11, pal.front, 'front', 3.5),
    clump(rng, 13, -88, 11, 9, pal.front, 'front', 4.0),
    // s4.3→s5: denser bloom — late popcorn fills the shoulders
    clump(rng, -30, -34, 10, 8, pal.front, 'front', 4.55),
    clump(rng, 28, -30, 9, 8, pal.front, 'front', 4.65),
  ];
  // wilt: ~25% greyed-pink kept, slightly darker/cooler than iteration 1
  const pinkWilt = (c) => mix(c, '#857270', 0.74);
  rewilt(clusters, pinkWilt);
  const leaves = scatter(rng, pal, { cx: 0, cy: -42, rx: 38, ry: 32, count: 48, rMin: 3, rMax: 5.5, birthMin: 2.7, birthMax: 4.8, round: 0.9 });
  rewilt(leaves, pinkWilt);
  return {
    trunkH: h, trunkD,
    bark: [
      `M ${R(-bw * 0.3)} -8 Q ${R(-bw * 0.1)} ${R(-h * 0.4)} ${R(1.5)} ${R(-h * 0.68)}`,
      `M ${R(bw * 0.4)} -5 Q ${R(bw * 0.42)} ${R(-h * 0.3)} ${R(4)} ${R(-h * 0.56)}`,
    ],
    knots: [{ x: -1.5, y: R(-h * 0.42), rx: 1.6, ry: 2.2 }],
    branches: [
      { d: limb(-2, 6, -28, -26, 4, 1.2, -7), birth: 2.4, droop: 14 },
      { d: limb(2, 4, 22, -34, 3.6, 1.1, 6), birth: 2.6, droop: 12 },
      { d: limb(0, 2, 6, -54, 2.8, 0.9, -3), birth: 2.85, droop: 8 },
    ],
    // dark forks drawn OVER the back masses — skeleton reads through bloom
    overBranches: [
      { d: limb(-6, -8, -24, -38, 2.2, 0.8, -4), birth: 3.2 },
      { d: limb(4, -10, 20, -48, 2, 0.7, 4), birth: 3.4 },
      { d: limb(6, -28, 12, -64, 1.6, 0.6, 2), birth: 3.6 },
    ],
    sils: [],
    clusters,
    leaves,
    // s2.4 signal: ONE pink bud on the first branch tip
    buds: [{ x: -10, y: -16, r: 3.4, fill: pal.mid, wfill: pinkWilt(pal.mid), birth: 2.35 }],
    shadeLo: [{ cx: -4, cy: -22, rx: 34, ry: 15 }],
    shadeHi: [{ cx: 10, cy: -74, rx: 18, ry: 14 }],
    rims: rims(rng, 2, -50, 32, 30, 7),
    rims2: rims2(rng, 4, -54, 30, 28, 24),
    dabs: microDabs(
      rng,
      [[-26, -20, 19, 14], [8, -52, 15, 12], [11, -72, 13, 11]],
      10,
      mix(pal.front, pal.rim, 0.6),
      mix(pal.back, '#9c5a74', 0.5)
    ),
    // stage-5 five-petal highlight blossoms — denser over lobe + shoulders
    fruits: [
      { x: -30, y: -24, rot: 0 }, { x: 26, y: -18, rot: 10 }, { x: -10, y: -40, rot: -8 },
      { x: 12, y: -52, rot: 6 }, { x: 7, y: -72, rot: -5 }, { x: 16, y: -86, rot: 8 },
      { x: -22, y: -34, rot: -10 }, { x: 30, y: -34, rot: 5 },
    ],
    sparkles: sparkles(rng, 0, -46, 38, 34, 6),
    // richer petal-fall at stage 5: more petals, dusty-rose range (no white)
    fallers: Array.from({ length: 8 }, (_, i) => ({
      x: R((rng() - 0.5) * 76), y: R(-30 + rng() * 20),
      delay: R(i * 4 + rng() * 4), dur: R(12 + rng() * 5),
      fill: mix(pal.mid, pal.rim, rng() * 0.7),
    })),
    fallen: fallenLeaves(rng, 4),
    glow: [0, -44, 76, 60],
    canopyDX: 3, // curved trunk leans the cloud slightly off-axis
  };
}

function buildBamboo(rng, pal) {
  // Iteration 2 STRUCTURAL REBUILD — pole grove, tighter SYMMETRIC cluster.
  // Growth pacing gives a clear height jump every stage: s2.4 = ONE new shoot
  // sprouting beside the seedling; mid stages add staggered mid culms; the
  // s4.3→s5 window raises THREE new tall culms that top out at the lock.
  // Per-culm sway: every culm renders in its own cs-tree__culm group with a
  // pivot at its own base and a staggered inline delay — culms do NOT ride
  // the 3-layer canopy sway (their blade tufts do). Structural ink: culm
  // bodies carry a 1px #111-family outline; node rings are dark bold bands
  // (≥6 viewBox units wide) that survive the 80px tile. Wilt = a coherent
  // grove-wide lean with two snapped canes, warm gray-green undertone.
  const h = 9; // tiny root crown — the culms rise straight from the grove base
  const trunkD = 'M -14 0 Q -11.5 -7 -5 -8.5 L 5 -8.5 Q 11.5 -7 14 0 Q 7 -2.4 0 -1.8 Q -7 -2.4 -14 0 Z';
  const INK = '#191c12';
  const culmSpecs = [
    // x, height, width, birth, tuft layer, lean — symmetric around center
    { x: -7, ch: 46, w: 4.8, birth: 2.4, layer: 'back', lean: -0.8 }, // s2.4 shoot
    { x: 7, ch: 80, w: 5.2, birth: 2.85, layer: 'back', lean: 0.8 },
    { x: -14, ch: 64, w: 4.6, birth: 3.3, layer: 'back', lean: -1.4 },
    { x: 1, ch: 150, w: 6.2, birth: 3.7, layer: 'mid', lean: 0.3 },
    { x: 14, ch: 122, w: 5.4, birth: 4.3, layer: 'mid', lean: 1.2 }, // ┐ three new
    { x: -4, ch: 176, w: 6, birth: 4.42, layer: 'front', lean: -0.3 }, // │ TALL culms
    { x: 10, ch: 142, w: 5.2, birth: 4.55, layer: 'mid', lean: 0.9 }, // ┘ s4.3→s5
  ];
  const culms = [];
  const leaves = [];
  const fruits = [];
  culmSpecs.forEach((c, ci) => {
    const n = Math.max(3, Math.round(c.ch / 23));
    const segLen = c.ch / n;
    // tone ramp: deep cool green on the early/short culms, lighter in front
    const base = c.ch > 130 ? pal.front : c.ch > 75 ? pal.mid : pal.back;
    const tone = mix(base, pal.trunk, rng() * 0.2);
    const segs = [];
    for (let i = 0; i < n; i++) {
      segs.push({
        x: R(c.x + c.lean * (i / n) * 2), y0: R(4 - i * segLen), len: R(segLen + 0.6),
        // node-by-node: every section fully grown by 4.55 + 0.45 span = 5.0,
        // so the late tall culms visibly top out right at the mature lock.
        birth: R(Math.min(c.birth + i * 0.12, 4.55)),
      });
    }
    culms.push({
      segs, w: c.w, layer: c.layer, baseX: R(c.x),
      fill: tone, wfill: wiltLeaf(tone),
      cap: capTone(tone), wcap: wiltLeaf(capTone(tone)),
      edge: selfEdge(tone), wedge: wiltLeaf(selfEdge(tone)),
      ring: mix(tone, '#1c2a16', 0.58), wring: wiltLeaf(mix(tone, '#1c2a16', 0.58)),
      ink: INK,
      swayDelay: R(ci * 0.45), // 0.3–0.7s apart, per-culm
      wiltLean: R(-5.2 - ci * 0.35), // coherent grove-wide lean
      snap: ci === 3 || ci === 5, // two snapped canes keep the wilt character
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
    // s5 signature: golden lantern glow at the tips of the TALL culms
    if (c.ch > 75) fruits.push({ x: R(c.x + c.lean * 2), y: R(4 - c.ch - 4), rot: 0 });
  });
  return {
    trunkH: h, trunkD,
    bark: [],
    knots: [],
    tuft: [
      'M -24 0 Q -25.5 -4 -24.5 -7', 'M -15 0 Q -15.5 -4.5 -14 -8',
      'M 16 0 Q 16.5 -4 15.5 -7.5', 'M 24 0 Q 25.5 -3.5 25 -6.5',
    ],
    branches: [],
    sils: [],
    culms,
    leaves,
    shadeLo: [], shadeHi: [],
    rims: [],
    fruits,
    sparkles: sparkles(rng, 0, -84, 24, 70, 6),
    sparkleFill: BAMBOO_GOLD,
    fallers: fallers(rng, 0, -64, 20, 2, pal.mid),
    fallen: fallenLeaves(rng, 3),
    glow: [0, -88, 48, 96],
    canopyDX: 0,
  };
}

function buildSunflower(rng, pal) {
  // Iteration 2: taller stalk (tile presence), orange-gold petals (#e8a020,
  // clearly off the UI amber), #6a8e5a stem/leaf greens with thin ink
  // outlines (structural rule), a WIDE ROSETTE of large fanning leaves that
  // anchors the cell (big leaves by s3.4, the widest pair completes at s5),
  // a larger s2.4 bud nub, and the panel's highest-ROI fix: WILT bows the
  // head 70–90° forward on a visibly bent neck with the face still readable.
  // Sway: the head group takes the FRONT layer (nested inside mid ⇒ ~1.5×
  // amplitude) pivoting from the stem base; stem foliage rides mid/back.
  const h = 128, bw = 5.4, tw = 3.8;
  const trunkD = [
    `M ${R(-bw - 2.5)} 0 Q ${R(-bw)} -8 ${R(-bw * 0.8)} ${R(-h * 0.45)}`,
    `Q ${R(-bw * 0.72)} ${R(-h * 0.8)} ${-tw} ${-h} L ${tw} ${-h}`,
    `Q ${R(bw * 0.78)} ${R(-h * 0.7)} ${R(bw * 0.85)} ${R(-h * 0.35)}`,
    `Q ${R(bw)} -7 ${R(bw + 2.5)} 0 Z`,
  ].join(' ');
  const discR = 14;
  const petals = [];
  for (let i = 0; i < 16; i++) {
    // outer ray ring opens first…
    const a = (i / 16) * Math.PI * 2 - Math.PI / 2;
    petals.push({
      x: R(Math.cos(a) * (discR + 1.5)), y: R(Math.sin(a) * (discR + 1.5)),
      rot: R((a * 180) / Math.PI + 90), s: R(1.6 + rng() * 0.25), v: i % 2,
      fill: i % 2 ? pal.mid : pal.front,
      birth: R(3.05 + (i % 8) * 0.16 + rng() * 0.08),
    });
  }
  for (let i = 0; i < 11; i++) {
    // …then a brighter inner ring completes the open head
    const a = (i / 11) * Math.PI * 2 - Math.PI / 3;
    petals.push({
      x: R(Math.cos(a) * (discR - 3)), y: R(Math.sin(a) * (discR - 3)),
      rot: R((a * 180) / Math.PI + 90), s: R(1.15 + rng() * 0.2), v: (i + 1) % 2,
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
      y: -21, discR, tilt: 16, wiltBow: -78, neckGreen: leafGreen,
      bud: { rx: 5.5, ry: 7, birth: 2.3 }, // s2.4 nub, one size larger
      petals, spiral,
      disc: '#9c6b3e', discIn: '#7c5330',
      // mid-stem droopy leaves + the WIDE base rosette (canopy +y = down)
      stemLeaves: [
        { d: 'M 0 34 C -9 33 -18 28 -21.5 18.5 C -11.5 16.5 -2.5 23.5 0 34 Z', oy: 34, fill: leafGreen, birth: 2.5 },
        { d: 'M 0 42 C 9 41 18 36 21.5 26.5 C 11.5 24.5 2.5 31.5 0 42 Z', oy: 42, fill: mix(leafGreen, pal.trunkDk, 0.25), birth: 2.65 },
        { d: 'M 0 58 C -8 57 -16 53 -19 44.5 C -10 42.5 -2 49 0 58 Z', oy: 58, fill: mix(leafGreen, pal.trunkDk, 0.4), birth: 2.85 },
        { d: 'M 0 64 C 7.5 63 15 59 18 51 C 9.5 49 2 55.5 0 64 Z', oy: 64, fill: leafGreen, birth: 3.0 },
        // big fanning rosette leaves — present by s3.4
        { d: 'M 0 122 C -13 120 -27 113 -33 97 C -17 92 -4 103 0 122 Z', oy: 122, fill: leafGreen, birth: 3.05 },
        { d: 'M 0 126 C 13 124 27 117 33 101 C 17 96 4 107 0 126 Z', oy: 126, fill: mix(leafGreen, pal.trunkDk, 0.3), birth: 3.2 },
        { d: 'M 0 116 C -10 113 -20 104 -23 90 C -9 87 -1 98 0 116 Z', oy: 116, fill: mix(leafGreen, pal.trunk, 0.3), birth: 3.35 },
        // s5: the widest pair completes the rosette and fills the cell
        { d: 'M 0 124 C -16 122 -32 116 -38 100 C -20 94 -5 106 0 124 Z', oy: 124, fill: mix(leafGreen, pal.trunk, 0.2), birth: 4.5 },
        { d: 'M 0 127 C 16 125 32 119 38 103 C 20 97 5 109 0 127 Z', oy: 127, fill: leafGreen, birth: 4.62 },
      ],
    },
    shadeLo: [], shadeHi: [],
    rims: [],
    // golden dew-glints just outside the petal tips at stage 5
    fruits: [
      { x: -22, y: -36, rot: 0 }, { x: 21, y: -34, rot: 0 },
      { x: 0, y: -48, rot: 0 }, { x: -16, y: -4, rot: 0 },
    ],
    // s5 celebration: petal-fragment sparkle burst around the head
    sparkles: sparkles(rng, 0, -24, 32, 28, 9),
    fallers: fallers(rng, 0, -18, 22, 2, pal.mid),
    fallen: fallenLeaves(rng, 3),
    glow: [0, -21, 52, 52],
    canopyDX: 0,
    wiltBow: -4, wiltDy: 2, // stem barely tips — the HEAD does the bowing
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
    case 'cherry': // five-petal highlight blossom — dusty cap pink, no white
      return (
        <g>
          <g fill="#f7dde7" stroke="#d4849a" strokeWidth="0.7" vectorEffect="non-scaling-stroke">
            <circle cx="0" cy="-2.7" r="1.8" />
            <circle cx="2.6" cy="-0.8" r="1.8" />
            <circle cx="1.6" cy="2.2" r="1.8" />
            <circle cx="-1.6" cy="2.2" r="1.8" />
            <circle cx="-2.6" cy="-0.8" r="1.8" />
          </g>
          <circle cx="0" cy="0" r="1.3" fill={GOLD} />
        </g>
      );
    case 'bamboo': // s5 signature: golden lantern glow riding a culm tip
      return (
        <g>
          <circle cx="0" cy="0" r="6.5" fill={BAMBOO_GOLD} opacity="0.3" />
          <ellipse cx="0" cy="0" rx="2.8" ry="3.6" fill={BAMBOO_GOLD} stroke="#9a8350" strokeWidth="1" vectorEffect="non-scaling-stroke" />
          <ellipse cx="-0.8" cy="-1" rx="1" ry="1.4" fill="#efe2c2" />
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

// Pine stage-5 trophy: small golden star topper riding the leader, with a
// warm rim halo behind it.
function StarTopper() {
  return (
    <g>
      <circle cx="0" cy="0" r="9" fill={GOLD} opacity="0.28" />
      <path
        d="M 0 -7 L 1.9 -2.4 L 6.8 -2.2 L 3 0.9 L 4.4 5.6 L 0 2.9 L -4.4 5.6 L -3 0.9 L -6.8 -2.2 L -1.9 -2.4 Z"
        fill={GOLD} stroke="#a87b22" strokeWidth="1" vectorEffect="non-scaling-stroke"
      />
      <circle cx="0" cy="-0.4" r="1.4" fill="#fff7df" />
    </g>
  );
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
  // s4.3→s5 must read as structural growth: oak/birch/willow take a bigger
  // mature bump (~+15% canopy vs 4.3 together with their late-born clusters).
  const matureBump = { oak: 1.08, birch: 1.08, willow: 1.08 }[safeKind] || 1.04;
  const canopyScale = lerp(0.5, 1, Math.pow(canopyT, 0.85)) * (mature ? matureBump : 1);
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
  // wiltThin (birch): wilting HIDES the late-born foliage instead of sagging
  // it uniformly, so the sparse dark branches read through the thinned column.
  const thinned = (birth) => wilted && T.wiltThin && birth > 3.4;
  const leafEls = (layer) =>
    T.leaves
      .filter((l) => l.layer === layer)
      .map((l, i) => {
        const k = grow(l.birth);
        const leafScale = clamp(l.rx / 5, 0.55, 1.7);
        const on = k > 0.02 && !thinned(l.birth);
        return leafVariants ? (
          <use
            key={`${layer}${i}`}
            href={`#leaf-${uid}-${i % leafVariants}`}
            fill={wilted ? l.wfill : l.fill}
            className="cs-tree__leaf cs-tree__tint"
            style={{
              transform: `translate(${l.x}px, ${l.y}px) rotate(${l.rot}deg) scale(${R(Math.max(k, 0.001) * leafScale)})`,
              opacity: on ? 1 : 0,
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
              opacity: on ? 1 : 0,
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
            style={{ transform: `scale(${Math.max(k, 0.001)})`, transformOrigin: `${c.ox}px ${c.oy}px`, opacity: k > 0.02 && !thinned(c.birth) ? 1 : 0 }}
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

  // bamboo culms: each culm is its OWN sway group (cs-tree__culm) pivoting
  // at its base with a staggered inline delay — independent of the 3-layer
  // canopy sway. Every culm SECTION keeps its own birth (node-by-node
  // growth): segment body with a 1px ink outline + lit-side stripe + BOLD
  // dark node ring (band spans the culm width +3 units ⇒ ≥6 viewBox units).
  // Wilt: a coherent grove-wide lean; flagged canes snap at the top node.
  const culmGroves = (T.culms || []).map((c, ci) => {
    const last = c.segs.length - 1;
    return (
      <g
        key={`culm${ci}`}
        className="cs-tree__culm"
        style={{
          transformOrigin: `${c.baseX}px 4px`,
          animationDelay: `${c.swayDelay}s`,
          ...(wilted ? { transform: `rotate(${c.wiltLean}deg)` } : null),
        }}
      >
        {c.segs.map((sg, si) => {
          const k = grow(sg.birth, 0.45);
          const w2 = c.w / 2;
          const snapped = wilted && c.snap && si === last;
          return (
            <g
              key={si}
              className="cs-tree__leaf"
              style={{
                transform: `scale(${Math.max(k, 0.001)})${snapped ? ' rotate(36deg)' : ''}`,
                transformOrigin: `${sg.x}px ${sg.y0}px`,
                opacity: k > 0.02 ? 1 : 0,
              }}
            >
              <rect
                x={R(sg.x - w2)} y={R(sg.y0 - sg.len)} width={c.w} height={sg.len} rx={R(w2 * 0.7)}
                fill={wilted ? c.wfill : c.fill}
                stroke={c.ink}
                strokeWidth="1" vectorEffect="non-scaling-stroke"
                className="cs-tree__tint"
              />
              <path
                d={`M ${R(sg.x - w2 * 0.45)} ${R(sg.y0 - sg.len + 2)} L ${R(sg.x - w2 * 0.45)} ${R(sg.y0 - 2)}`}
                fill="none" stroke={wilted ? c.wcap : c.cap} strokeWidth="1.3" strokeLinecap="round"
                vectorEffect="non-scaling-stroke" className="cs-tree__tintstroke" opacity="0.9"
              />
              <path
                d={`M ${R(sg.x - w2 - 1.5)} ${R(sg.y0 - sg.len)} L ${R(sg.x + w2 + 1.5)} ${R(sg.y0 - sg.len)}`}
                fill="none" stroke={wilted ? c.wring : c.ring} strokeWidth="2.2" strokeLinecap="round"
                className="cs-tree__tintstroke"
              />
            </g>
          );
        })}
      </g>
    );
  });

  // pine swag tiers by sway band — soft scalloped boundaries only (no needle
  // strokes), with a bold cooler blue-green lit cap along the upper-left.
  const tierEls = (band) =>
    (T.tiers || [])
      .filter((t) => t.band === band)
      .map((t) => {
        const k = grow(t.birth, 0.7);
        return (
          <g
            key={t.y}
            className="cs-tree__leaf"
            style={{ transform: `scale(${Math.max(k, 0.001)})`, transformOrigin: `0px ${t.y}px`, opacity: k > 0.02 ? 1 : 0 }}
          >
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
              strokeWidth="3" strokeLinecap="round" vectorEffect="non-scaling-stroke"
              className="cs-tree__tintstroke"
              opacity="0.9"
            />
            {t.speckles.map((sp, j) => (
              <circle key={j} cx={sp[0]} cy={sp[1]} r={sp[2]} fill={pal.rim} opacity="0.55" />
            ))}
          </g>
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
        style={{
          // willow wilt keeps the trunk upright — only its curtain sags
          transform: `rotate(${wilted && !T.uprightWilt ? -3 : 0}deg)`,
          transformOrigin: `${CX}px ${GROUND_Y}px`,
        }}
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

          {/* bamboo: per-culm sway groves — own pivot + stagger per culm,
              NOT riding the canopy layers (their leaf tufts still do) */}
          {T.culms && <g>{culmGroves}</g>}

          {/* pine: the tier stack rides three sway bands — bottom on --back
              (full), middle on --mid, apex + leader on --tip (~35% amp).
              Tip band renders first so each fringe overlaps the tier above. */}
          {T.tiers && (
            <>
              <g className="cs-tree__layer cs-tree__layer--tip" style={slump(-1.5, 1)}>
                {tierEls('tip')}
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
              </g>
              <g className="cs-tree__layer cs-tree__layer--mid" style={slump(-3.5, 3)}>{tierEls('mid')}</g>
              <g className="cs-tree__layer cs-tree__layer--back" style={slump(-2.5, 2)}>{tierEls('back')}</g>
            </>
          )}

          {/* bamboo grove: every culm sways from its own base (cs-tree__culm),
              independent of the 3-layer canopy sway */}
          {culmGroves.length > 0 && <g>{culmGroves}</g>}

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

          {/* willow: FIVE thick curtain masses hanging from the crown — the
              chunky filled arc reads first, leaflets are texture inside it.
              Wilt: each curtain sags longer/limper from its anchor. */}
          {T.fronds && (
            <g style={slump(-3, 3)}>
              {T.fronds.map((f, i) => {
                const k = grow(f.birth, 0.7);
                return (
                  <g
                    key={i}
                    className="cs-tree__frond"
                    style={{
                      transformOrigin: `${f.ox}px ${f.oy}px`,
                      animationDuration: `${f.dur}s`,
                      animationDelay: `${f.delay}s`,
                      ...(wilted ? { transform: f.sag } : null),
                    }}
                  >
                    <g
                      className="cs-tree__leaf"
                      style={{ transform: `scale(${Math.max(k, 0.001)})`, transformOrigin: `${f.ox}px ${f.oy}px`, opacity: k > 0.02 ? 1 : 0 }}
                    >
                      <path
                        d={f.d}
                        fill={wilted ? f.wfill : f.fill}
                        stroke={wilted ? f.wedge : f.edge}
                        strokeWidth="1.1"
                        strokeLinejoin="round"
                        vectorEffect="non-scaling-stroke"
                        className="cs-tree__tint cs-tree__tintstroke"
                      />
                      <path
                        d={f.hi}
                        fill="none"
                        stroke={wilted ? f.whiTone : f.hiTone}
                        strokeWidth="2.2"
                        strokeLinecap="round"
                        vectorEffect="non-scaling-stroke"
                        className="cs-tree__tintstroke"
                        opacity="0.85"
                      />
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
                {fr.star ? <StarTopper /> : <Fruit kind={safeKind} />}
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
