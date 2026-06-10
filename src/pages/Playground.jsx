import { useEffect, useRef, useState } from 'react';
import { LANGUAGES, STAGES_PER_TOPIC } from '../data/curriculum';
import { useProgress, visualStage } from '../state/useProgress';
import IsometricPlot from '../components/IsometricPlot';
import Tree from '../components/Tree';
import TimerPanel from '../components/TimerPanel';
import LessonList from '../components/LessonList';
import SpeciesPicker from '../components/SpeciesPicker';
import TreeInspector from '../components/TreeInspector';
import './Playground.css';

// The Playground shows one language at a time: EVERY topic of that language
// gets its own tree planted on the shared isometric plot (the plot's grid
// adapts to the topic count). Clicking a tree's cell selects that topic for
// the species picker, lesson list and timer; clicking the ALREADY selected
// tree opens the TreeInspector modal.

/** Stable per-topic seed so each tree gets its own deterministic character. */
function hashId(str) {
  let h = 2166136261;
  for (let c = 0; c < str.length; c++) {
    h ^= str.charCodeAt(c);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/** Trees shrink as the plot gets denser. */
function treeSizeFor(topicCount) {
  // Forest density: mature canopies should nearly touch (~80% of cell width)
  // so a full language reads as a FOREST, not scattered saplings.
  if (topicCount <= 3) return 210;
  if (topicCount <= 6) return 188;
  if (topicCount <= 9) return 176;
  return 158;
}

/** One-shot time-lapse length when a tree is freshly mastered. */
const MASTERY_REPLAY_MS = 4000;

/** Deterministic stagger for the session-rain drops (pure CSS animation). */
const RAIN_DROPS = Array.from({ length: 10 }, (_, i) => ({
  key: i,
  left: `${8 + ((i * 53) % 85)}%`,
  delay: `${(i * 0.17).toFixed(2)}s`,
  duration: `${(1.1 + (i % 4) * 0.15).toFixed(2)}s`,
}));

export default function Playground() {
  const [topicId, setTopicId] = useState(LANGUAGES[0].topics[0].id);
  const { session, getTopicProgress, getSessionElapsed, getTreeKind } =
    useProgress();
  const [, setTick] = useState(0);
  const [inspectorOpen, setInspectorOpen] = useState(false);

  // Mastery time-lapse: when the SELECTED topic's lockedStage transitions to 5
  // during this component's lifetime (not on reload), replay that slot's tree
  // growing 0→5 over ~4s. { topicId, stage } while running, null otherwise.
  const [masteryReplay, setMasteryReplay] = useState(null);
  const masteryRafRef = useRef(0);

  // The visible language is whichever one owns the selected topic.
  const language =
    LANGUAGES.find((l) => l.topics.some((t) => t.id === topicId)) ?? LANGUAGES[0];

  // ~1s re-render tick while a session is growing one of the visible trees.
  // Elapsed time is derived at render; the interval only forces re-renders.
  const growing =
    !!session &&
    session.running &&
    language.topics.some((t) => t.id === session.topicId);
  useEffect(() => {
    if (!growing) return undefined;
    const id = setInterval(() => setTick((t) => t + 1), 1000);
    return () => clearInterval(id);
  }, [growing]);

  // Watch the selected topic's lockedStage with a previous-value ref. The ref
  // is seeded with the CURRENT value, so a reload with an already-mastered
  // topic never triggers — only a live <5 → 5 transition does. The effect body
  // never sets state; all setState happens inside rAF callbacks.
  const selectedLocked = getTopicProgress(topicId).lockedStage;
  const prevLockedRef = useRef({ topicId, locked: selectedLocked });
  useEffect(() => () => cancelAnimationFrame(masteryRafRef.current), []);
  useEffect(() => {
    const prev = prevLockedRef.current;
    prevLockedRef.current = { topicId, locked: selectedLocked };
    if (
      prev.topicId === topicId &&
      prev.locked < STAGES_PER_TOPIC &&
      selectedLocked >= STAGES_PER_TOPIC
    ) {
      cancelAnimationFrame(masteryRafRef.current);
      const target = topicId;
      const startTime = performance.now();
      const frame = (now) => {
        const t = Math.min((now - startTime) / MASTERY_REPLAY_MS, 1);
        const eased = 1 - Math.pow(1 - t, 3); // ease-out cubic
        if (t < 1) {
          setMasteryReplay({ topicId: target, stage: eased * STAGES_PER_TOPIC });
          masteryRafRef.current = requestAnimationFrame(frame);
        } else {
          setMasteryReplay(null); // final frame = live stage 5, seamless return
        }
      };
      masteryRafRef.current = requestAnimationFrame(frame);
    }
  }, [topicId, selectedLocked]);

  const elapsedMs = getSessionElapsed();
  const treeSize = treeSizeFor(language.topics.length);

  const slots = language.topics.map((t) => {
    const topicProgress = getTopicProgress(t.id);
    const liveStage = visualStage(topicProgress, session, t.id, elapsedMs);
    const stage =
      masteryReplay && masteryReplay.topicId === t.id
        ? masteryReplay.stage
        : liveStage;
    const mastered = topicProgress.lockedStage >= STAGES_PER_TOPIC;
    const raining =
      !!session && session.running && session.topicId === t.id;

    const tree = (
      <Tree
        stage={stage}
        wilted={topicProgress.wilted}
        kind={getTreeKind(t.id)}
        size={treeSize}
        seed={hashId(t.id)}
      />
    );

    return {
      id: t.id,
      content: raining ? (
        <div className="rain-overlay">
          {tree}
          <span className="rain-drops" aria-hidden="true">
            {RAIN_DROPS.map((d) => (
              <span
                key={d.key}
                className="rain-drop"
                style={{
                  '--rain-left': d.left,
                  '--rain-delay': d.delay,
                  '--rain-dur': d.duration,
                }}
              />
            ))}
          </span>
        </div>
      ) : (
        tree
      ),
      caption: t.name,
      sub: mastered
        ? 'MASTERED'
        : `${topicProgress.lockedStage}/${STAGES_PER_TOPIC} lessons`,
      highlighted: t.id === topicId,
      onClick: () => {
        // Second click on the selected tree opens the inspector.
        if (t.id === topicId) setInspectorOpen(true);
        else setTopicId(t.id);
      },
    };
  });

  return (
    <main className="cs-page playground">
      <h1 className="cs-page-title">Playground</h1>

      <div className="pg-lang-tabs" role="group" aria-label="Language">
        {LANGUAGES.map((lang) => {
          const active = lang.id === language.id;
          return (
            <button
              key={lang.id}
              type="button"
              aria-pressed={active}
              className={`cs-pill-btn pg-lang-tab${
                active ? ' cs-pill-btn--orange' : ''
              }`}
              onClick={() => {
                // Keep the current topic if it already belongs to this language.
                if (!active) setTopicId(lang.topics[0].id);
              }}
            >
              {lang.name}
            </button>
          );
        })}
      </div>

      <div className="pg-layout">
        <div className="pg-plot-col">
          <div className="pg-plot-wrap">
            <IsometricPlot slots={slots} width={1040} label={language.name} />
            <button
              type="button"
              className="cs-pill-btn pg-inspect-btn"
              title="Inspect the selected tree"
              onClick={() => setInspectorOpen(true)}
            >
              🔍 Inspect
            </button>
            {masteryReplay && (
              <span className="pg-mastery-toast" role="status">
                ✨ Fully grown!
              </span>
            )}
          </div>
          {/* species picker for the selected topic (panel while choosable,
              one-line "locked" note once the tree has taken root) */}
          <SpeciesPicker topicId={topicId} />
          <TimerPanel topicId={topicId} />
        </div>

        <LessonList topicId={topicId} />
      </div>

      {inspectorOpen && (
        <TreeInspector topicId={topicId} onClose={() => setInspectorOpen(false)} />
      )}
    </main>
  );
}
