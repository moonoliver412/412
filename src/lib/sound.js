// Sound design — tiny synthesized cues via Web Audio (no assets, no deps).
//
// Policy (motion-graphics skill): only T3 celebrations and session
// boundaries get audio; ambient/hover/transition tiers stay silent. Every
// cue is short (<500ms), soft, and built from pure tones with exponential
// decay — premium "pop", never arcade noise.
//
// Autoplay: the context is created/resumed lazily inside play(), and every
// trigger in the app is a user gesture (button click) or follows one, so
// browsers allow it. If the context can't start, play() fails silently.
//
// Mute lives in settings (codesprout-settings-v1, see useSettings); read
// per call so toggling applies instantly without wiring.

const SETTINGS_KEY = 'codesprout-settings-v1';

let ctx = null;

function getCtx() {
  if (typeof window === 'undefined' || !window.AudioContext) return null;
  if (!ctx) ctx = new AudioContext();
  if (ctx.state === 'suspended') ctx.resume().catch(() => {});
  return ctx;
}

function soundEnabled() {
  try {
    const s = JSON.parse(localStorage.getItem(SETTINGS_KEY));
    return s?.sound !== false; // default ON
  } catch {
    return true;
  }
}

/** One enveloped tone. `at` is seconds from now. */
function tone(ac, { freq, at = 0, dur = 0.12, type = 'sine', peak = 0.08 }) {
  const t0 = ac.currentTime + at;
  const osc = ac.createOscillator();
  const gain = ac.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t0);
  gain.gain.setValueAtTime(0.0001, t0);
  gain.gain.exponentialRampToValueAtTime(peak, t0 + 0.012);
  gain.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  osc.connect(gain).connect(ac.destination);
  osc.start(t0);
  osc.stop(t0 + dur + 0.05);
}

const CUES = {
  // a check ticks green — tiny upward pop
  check: (ac) => {
    tone(ac, { freq: 660, dur: 0.07, peak: 0.05 });
    tone(ac, { freq: 880, at: 0.05, dur: 0.09, peak: 0.06 });
  },
  // all checks pass — two-note affirmation
  allpass: (ac) => {
    tone(ac, { freq: 523.25, dur: 0.12 });
    tone(ac, { freq: 783.99, at: 0.09, dur: 0.18 });
  },
  // lesson/challenge ceremony — rising triad
  ceremony: (ac) => {
    tone(ac, { freq: 523.25, dur: 0.14 });
    tone(ac, { freq: 659.25, at: 0.11, dur: 0.14 });
    tone(ac, { freq: 783.99, at: 0.22, dur: 0.3, peak: 0.09 });
  },
  // toast (badge/quest/rank) — soft bell
  badge: (ac) => {
    tone(ac, { freq: 987.77, dur: 0.25, type: 'triangle', peak: 0.05 });
    tone(ac, { freq: 1318.5, at: 0.02, dur: 0.3, type: 'sine', peak: 0.03 });
  },
  // focus session starts — grounding low tone
  start: (ac) => {
    tone(ac, { freq: 330, dur: 0.18, type: 'triangle', peak: 0.05 });
  },
  // focus session completes — warm resolve
  finish: (ac) => {
    tone(ac, { freq: 392, dur: 0.16, type: 'triangle', peak: 0.06 });
    tone(ac, { freq: 587.33, at: 0.13, dur: 0.28, peak: 0.07 });
  },
  // chest opens — sparkly run
  chest: (ac) => {
    tone(ac, { freq: 783.99, dur: 0.09, peak: 0.05 });
    tone(ac, { freq: 987.77, at: 0.08, dur: 0.09, peak: 0.06 });
    tone(ac, { freq: 1174.66, at: 0.16, dur: 0.12, peak: 0.07 });
    tone(ac, { freq: 1567.98, at: 0.26, dur: 0.28, peak: 0.08 });
  },
};

/** Play a named cue; silent no-op when muted or audio is unavailable. */
export function play(cue) {
  try {
    if (!soundEnabled()) return;
    const ac = getCtx();
    if (!ac || !CUES[cue]) return;
    CUES[cue](ac);
  } catch {
    /* sound must never break the app */
  }
}
