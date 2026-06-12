import { useCallback, useEffect, useRef, useState } from 'react';
import { LANGUAGES, STAGES_PER_TOPIC } from '../data/curriculum';
import { useGame } from '../state/useGame';
import { useProgress } from '../state/useProgress';
import './ShareCard.css';

// ---------------------------------------------------------------------------
// ShareCard — "Share my forest" modal (Phase 9).
// Renders a 1200×630 canvas card and offers Download PNG / Copy to clipboard.
// Pure Canvas 2D — no libraries.
// ---------------------------------------------------------------------------

const W = 1200;
const H = 630;

// ---- Canvas drawing helpers -----------------------------------------------

/** Rounded-rectangle path helper. */
function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

/** Draw a simple bezier leaf swoosh next to the wordmark. */
function drawLeafSwoosh(ctx, x, y, size) {
  ctx.save();
  ctx.translate(x, y);
  ctx.fillStyle = '#ff4500';
  ctx.beginPath();
  // Leaf: starts at tip, curves to base, back to tip via the other side.
  const s = size;
  ctx.moveTo(0, 0);
  ctx.bezierCurveTo(s * 0.5, -s * 0.9, s * 1.1, -s * 0.4, s * 0.9, 0);
  ctx.bezierCurveTo(s * 1.1, s * 0.4, s * 0.5, s * 0.9, 0, 0);
  ctx.fill();
  // Vein
  ctx.strokeStyle = 'rgba(255,255,255,0.35)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.bezierCurveTo(s * 0.3, -s * 0.1, s * 0.6, -s * 0.05, s * 0.9, 0);
  ctx.stroke();
  ctx.restore();
}

// ---- Tree species painters -------------------------------------------------

/** Oak: stacked overlapping circles with a rectangular trunk. */
function drawOak(ctx, cx, baseY, scale, tint) {
  const s = scale;
  // trunk
  ctx.fillStyle = tint ?? '#5c3d1e';
  ctx.fillRect(cx - s * 5, baseY - s * 22, s * 10, s * 22);
  // canopy — 3 circles
  const green = tint ? tint : '#3d6e40';
  ctx.fillStyle = green;
  const drawCirc = (ox, oy, r) => {
    ctx.beginPath();
    ctx.arc(cx + ox * s, baseY - oy * s, r * s, 0, Math.PI * 2);
    ctx.fill();
  };
  drawCirc(-10, 44, 18);
  drawCirc(10, 44, 18);
  drawCirc(0, 58, 20);
}

/** Pine: stacked triangles, narrow trunk. */
function drawPine(ctx, cx, baseY, scale, tint) {
  const s = scale;
  ctx.fillStyle = tint ?? '#4d3219';
  ctx.fillRect(cx - s * 4, baseY - s * 18, s * 8, s * 18);
  const green = tint ?? '#2d5e35';
  ctx.fillStyle = green;
  const tri = (ox, oy, hw, h) => {
    ctx.beginPath();
    ctx.moveTo(cx + ox * s, baseY - oy * s);
    ctx.lineTo(cx + (ox - hw) * s, baseY - (oy - h) * s);
    ctx.lineTo(cx + (ox + hw) * s, baseY - (oy - h) * s);
    ctx.closePath();
    ctx.fill();
  };
  tri(0, 20, 22, 20); // bottom layer
  tri(0, 36, 17, 16); // mid layer
  tri(0, 50, 12, 14); // top
}

/** Birch: slim pale trunk, small rounded crown. */
function drawBirch(ctx, cx, baseY, scale, tint) {
  const s = scale;
  // slim pale trunk with markings
  ctx.fillStyle = tint ?? '#c8b89a';
  ctx.fillRect(cx - s * 4, baseY - s * 38, s * 8, s * 38);
  ctx.fillStyle = 'rgba(80,60,30,0.3)';
  for (let i = 0; i < 4; i++) {
    ctx.fillRect(cx - s * 4, baseY - s * (12 + i * 9), s * 8, s * 2);
  }
  // small round crown
  ctx.fillStyle = tint ?? '#3d6e40';
  ctx.beginPath();
  ctx.arc(cx, baseY - s * 46, s * 16, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(cx - s * 9, baseY - s * 40, s * 11, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(cx + s * 9, baseY - s * 40, s * 11, 0, Math.PI * 2);
  ctx.fill();
}

/** Maple: wide layered crown with distinct lobes, medium trunk. */
function drawMaple(ctx, cx, baseY, scale, tint) {
  const s = scale;
  ctx.fillStyle = tint ?? '#5c3d1e';
  ctx.fillRect(cx - s * 6, baseY - s * 26, s * 12, s * 26);
  const red = tint ?? '#b84040'; // maples can be autumn-red
  ctx.fillStyle = red;
  const lobe = (ox, oy, r) => {
    ctx.beginPath();
    ctx.arc(cx + ox * s, baseY - oy * s, r * s, 0, Math.PI * 2);
    ctx.fill();
  };
  lobe(0, 60, 22); // centre top
  lobe(-18, 48, 16);
  lobe(18, 48, 16);
  lobe(-10, 36, 12);
  lobe(10, 36, 12);
}

/** Cherry: rounded airy crown in pink/white. */
function drawCherry(ctx, cx, baseY, scale, tint) {
  const s = scale;
  ctx.fillStyle = tint ?? '#7a4f2e';
  ctx.fillRect(cx - s * 5, baseY - s * 24, s * 10, s * 24);
  ctx.fillStyle = tint ?? '#e8a0b8';
  const puff = (ox, oy, r) => {
    ctx.beginPath();
    ctx.arc(cx + ox * s, baseY - oy * s, r * s, 0, Math.PI * 2);
    ctx.fill();
  };
  puff(0, 54, 20);
  puff(-14, 44, 15);
  puff(14, 44, 15);
  puff(-6, 38, 11);
  puff(6, 38, 11);
}

/** Willow: drooping silhouette — wide arc canopy with hanging fronds. */
function drawWillow(ctx, cx, baseY, scale, tint) {
  const s = scale;
  ctx.fillStyle = tint ?? '#5c3d1e';
  ctx.fillRect(cx - s * 5, baseY - s * 36, s * 10, s * 36);
  ctx.fillStyle = tint ?? '#4a7a2e';
  ctx.beginPath();
  ctx.arc(cx, baseY - s * 44, s * 26, 0, Math.PI * 2);
  ctx.fill();
  // fronds: thin arcs drooping down
  ctx.strokeStyle = tint ?? '#3a6a22';
  ctx.lineWidth = s * 2;
  for (let i = -2; i <= 2; i++) {
    ctx.beginPath();
    ctx.moveTo(cx + i * s * 8, baseY - s * 30);
    ctx.quadraticCurveTo(
      cx + i * s * 12,
      baseY - s * 8,
      cx + i * s * 8,
      baseY
    );
    ctx.stroke();
  }
}

/** Bamboo: cluster of vertical stalks with node rings, feathery tops. */
function drawBamboo(ctx, cx, baseY, scale, tint) {
  const s = scale;
  const stalkColor = tint ?? '#7aaa44';
  const stalks = [
    { ox: -9, h: 55, w: 5 },
    { ox: 0, h: 65, w: 6 },
    { ox: 9, h: 52, w: 5 },
  ];
  for (const st of stalks) {
    ctx.fillStyle = stalkColor;
    ctx.fillRect(
      cx + st.ox * s - (st.w * s) / 2,
      baseY - st.h * s,
      st.w * s,
      st.h * s
    );
    // node rings
    ctx.fillStyle = 'rgba(0,0,0,0.2)';
    for (let n = 1; n <= 4; n++) {
      ctx.fillRect(
        cx + st.ox * s - (st.w * s) / 2 - s,
        baseY - (st.h * n * 0.22) * s,
        (st.w + 2) * s,
        s * 2
      );
    }
    // leaf puff at top
    ctx.fillStyle = tint ?? '#a0cc55';
    ctx.beginPath();
    ctx.arc(cx + st.ox * s, baseY - st.h * s, s * 10, 0, Math.PI * 2);
    ctx.fill();
  }
}

/** Sunflower: disc on a long stalk with petals. */
function drawSunflower(ctx, cx, baseY, scale, tint) {
  const s = scale;
  // stalk
  ctx.strokeStyle = tint ?? '#4a6e22';
  ctx.lineWidth = s * 6;
  ctx.beginPath();
  ctx.moveTo(cx, baseY);
  ctx.lineTo(cx, baseY - s * 52);
  ctx.stroke();
  // petals
  ctx.fillStyle = tint ?? '#f0c030';
  const nPetals = 12;
  for (let p = 0; p < nPetals; p++) {
    const angle = (p / nPetals) * Math.PI * 2;
    ctx.save();
    ctx.translate(cx, baseY - s * 52);
    ctx.rotate(angle);
    ctx.beginPath();
    ctx.ellipse(0, -s * 13, s * 5, s * 12, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
  // disc
  ctx.fillStyle = tint ?? '#6e3c0a';
  ctx.beginPath();
  ctx.arc(cx, baseY - s * 52, s * 11, 0, Math.PI * 2);
  ctx.fill();
}

const SPECIES_DRAWERS = {
  oak: drawOak,
  pine: drawPine,
  birch: drawBirch,
  maple: drawMaple,
  cherry: drawCherry,
  willow: drawWillow,
  bamboo: drawBamboo,
  sunflower: drawSunflower,
};

function drawTree(ctx, species, cx, baseY, scale) {
  const drawer = SPECIES_DRAWERS[species] ?? drawOak;
  drawer(ctx, cx, baseY, scale, null);
}

// ---- Sprout (seedling) drawing for empty forest ----------------------------

function drawSprout(ctx, cx, baseY, scale) {
  const s = scale;
  ctx.fillStyle = '#5c400f';
  ctx.beginPath();
  ctx.ellipse(cx, baseY - s * 2, s * 12, s * 5, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#3d6e40';
  ctx.lineWidth = s * 3;
  ctx.beginPath();
  ctx.moveTo(cx, baseY - s * 4);
  ctx.lineTo(cx, baseY - s * 20);
  ctx.stroke();
  ctx.fillStyle = '#3d6e40';
  ctx.beginPath();
  ctx.moveTo(cx, baseY - s * 20);
  ctx.bezierCurveTo(cx, baseY - s * 28, cx + s * 12, baseY - s * 26, cx + s * 14, baseY - s * 20);
  ctx.bezierCurveTo(cx + s * 12, baseY - s * 14, cx, baseY - s * 16, cx, baseY - s * 20);
  ctx.fill();
}

// ---- Main canvas draw function ---------------------------------------------

function drawCard(canvas, masteredTopics, stats) {
  const ctx = canvas.getContext('2d');

  // Background
  ctx.fillStyle = '#c5d2c2';
  ctx.fillRect(0, 0, W, H);

  // Black panel (inner card)
  ctx.fillStyle = '#0d0d0d';
  roundRect(ctx, 32, 32, W - 64, H - 64, 32);
  ctx.fill();

  // ---- Wordmark ----
  const wmX = 72;
  const wmY = 96;
  ctx.font = '700 52px Oswald, Arial Narrow, sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.fillText('CodeSprout', wmX, wmY);
  // Orange leaf swoosh after the wordmark
  const wmWidth = ctx.measureText('CodeSprout').width;
  drawLeafSwoosh(ctx, wmX + wmWidth + 12, wmY - 32, 22);

  // Tagline
  ctx.font = '400 18px Inter, Helvetica Neue, Arial, sans-serif';
  ctx.fillStyle = 'rgba(255,255,255,0.55)';
  ctx.fillText('Your knowledge, alive.', wmX, wmY + 30);

  // ---- Trees row ----
  const treeBaseY = H - 120;
  const treeAreaX = 72;
  const treeAreaW = W - 144;

  if (masteredTopics.length === 0) {
    // No mastered topics: show one sprout + caption
    drawSprout(ctx, W / 2, treeBaseY, 1.8);
    ctx.font = '500 20px Inter, Helvetica Neue, Arial, sans-serif';
    ctx.fillStyle = 'rgba(255,255,255,0.6)';
    ctx.textAlign = 'center';
    ctx.fillText('The forest is just getting started', W / 2, treeBaseY + 28);
    ctx.textAlign = 'left';
  } else {
    // Draw one tree per mastered topic; cap display at 12 to keep spacing
    const displayTrees = masteredTopics.slice(0, 12);
    const count = displayTrees.length;
    const spacing = Math.min(treeAreaW / count, 110);
    const startX = treeAreaX + (treeAreaW - spacing * (count - 1)) / 2;
    const scale = count <= 5 ? 1.6 : count <= 8 ? 1.3 : 1.0;

    for (let i = 0; i < count; i++) {
      const cx = startX + i * spacing;
      // Subtle baseline variation for organic feel
      const jitter = ((i * 7 + 3) % 5 - 2) * 6;
      drawTree(ctx, displayTrees[i].species, cx, treeBaseY + jitter, scale);
    }
  }

  // Ground line
  ctx.strokeStyle = 'rgba(197,210,194,0.15)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(72, treeBaseY + 8);
  ctx.lineTo(W - 72, treeBaseY + 8);
  ctx.stroke();

  // ---- Stats line ----
  const statY = 155;
  const statGap = 200;
  const statItems = [
    { label: 'TREES GROWN', value: String(stats.treesGrown) },
    { label: 'FOCUS MINUTES', value: String(stats.totalMinutes) },
    { label: 'STREAK', value: `${stats.streak} days` },
    { label: 'SPROUTS', value: String(stats.sprouts) },
  ];

  statItems.forEach((item, i) => {
    const sx = wmX + i * statGap;
    ctx.font = '700 36px Oswald, Arial Narrow, sans-serif';
    ctx.fillStyle = '#e5b95e';
    ctx.fillText(item.value, sx, statY);
    ctx.font = '500 13px Inter, Helvetica Neue, Arial, sans-serif';
    ctx.fillStyle = 'rgba(255,255,255,0.5)';
    ctx.fillText(item.label, sx, statY + 22);
  });

  // ---- Decorative corner dot ----
  ctx.fillStyle = '#ff4500';
  ctx.beginPath();
  ctx.arc(W - 72, 72, 8, 0, Math.PI * 2);
  ctx.fill();
}

// ---- Component -------------------------------------------------------------

export default function ShareCard() {
  const [open, setOpen] = useState(false);
  const [copyStatus, setCopyStatus] = useState(''); // '' | 'copied!' | "couldn't copy"
  const { game } = useGame();
  const { getTopicProgress, getTreeKind } = useProgress();
  const canvasRef = useRef(null);
  const dialogRef = useRef(null);
  const triggerRef = useRef(null);

  // Focus dialog on open; restore on close.
  useEffect(() => {
    if (open) {
      dialogRef.current?.focus();
    } else {
      triggerRef.current?.focus();
    }
  }, [open]);

  // Escape to close.
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  // Draw canvas whenever the modal opens.
  useEffect(() => {
    if (!open || !canvasRef.current) return;

    const allTopics = LANGUAGES.flatMap((lang) =>
      lang.topics.map((topic) => ({ topic, lang }))
    );
    const masteredTopics = allTopics
      .filter(
        ({ topic }) =>
          getTopicProgress(topic.id).lockedStage >= STAGES_PER_TOPIC
      )
      .map(({ topic }) => ({ species: getTreeKind(topic.id) }));

    const totalMinutes = allTopics.reduce(
      (sum, { topic }) => sum + getTopicProgress(topic.id).focusMinutes,
      0
    );

    const stats = {
      treesGrown: masteredTopics.length,
      totalMinutes,
      streak: game.streak.current,
      sprouts: game.sprouts,
    };

    drawCard(canvasRef.current, masteredTopics, stats);
  }, [open, game, getTopicProgress, getTreeKind]);

  const handleDownload = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'codesprout-forest.png';
      a.click();
      URL.revokeObjectURL(url);
    });
  }, []);

  const handleCopy = useCallback(async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    try {
      const blob = await new Promise((res) => canvas.toBlob(res));
      await navigator.clipboard.write([
        new ClipboardItem({ 'image/png': blob }),
      ]);
      setCopyStatus('Copied!');
    } catch {
      setCopyStatus("Couldn't copy");
    }
    setTimeout(() => setCopyStatus(''), 2500);
  }, []);

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) setOpen(false);
  };

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        className="sc-trigger cs-pill-btn"
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M8 1v10M5 4l3-3 3 3M3 11v3h10v-3"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        Share my forest
      </button>

      {open && (
        <div className="sc-overlay" onClick={handleOverlayClick}>
          <div
            ref={dialogRef}
            className="sc-modal cs-panel"
            role="dialog"
            aria-modal="true"
            aria-label="Share your forest card"
            tabIndex={-1}
          >
            <div className="sc-modal-head">
              <h2 className="cs-panel-title sc-modal-title">Share your forest</h2>
              <button
                type="button"
                className="sc-close"
                aria-label="Close"
                onClick={() => setOpen(false)}
              >
                ✕
              </button>
            </div>

            <div className="sc-canvas-wrap">
              <canvas
                ref={canvasRef}
                width={W}
                height={H}
                className="sc-canvas"
                aria-label="Forest share card preview"
              />
            </div>

            <div className="sc-actions">
              <button
                type="button"
                className="cs-pill-btn cs-pill-btn--orange"
                onClick={handleDownload}
              >
                Download PNG
              </button>
              <button
                type="button"
                className="cs-pill-btn"
                onClick={handleCopy}
              >
                Copy to clipboard
              </button>
              <span
                className="sc-copy-status"
                role="status"
                aria-live="polite"
              >
                {copyStatus}
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
