import { useProgress } from '../state/useProgress';
import { findTopic } from '../data/curriculum';
import Tree from './Tree';
import './SpeciesPicker.css';

// ---------------------------------------------------------------------------
// <SpeciesPicker topicId /> — choose which species the topic's tree will be.
//
// Only meaningful while nothing is locked in yet (lockedStage === 0): shows a
// black panel with one option card per species in the topic's LANGUAGE
// palette, each previewing a live mature mini <Tree />. Clicking an option
// calls setTreeKind (which itself no-ops once growth is locked). After the
// first lesson is locked (lockedStage > 0) the species is fixed, so the
// panel is replaced by a one-line "locked" note.
// ---------------------------------------------------------------------------

export default function SpeciesPicker({ topicId }) {
  const { getTopicProgress, getTreeKind, setTreeKind } = useProgress();
  const found = findTopic(topicId);
  if (!found) return null;

  const { language, topic } = found;
  const { lockedStage } = getTopicProgress(topicId);
  const current = getTreeKind(topicId);

  if (lockedStage > 0) {
    return (
      <p className="species-locked-note" role="note">
        Species locked — {topic.name} took root as{' '}
        <span className="species-locked-kind">{current}</span>.
      </p>
    );
  }

  return (
    <section className="cs-panel species-picker" aria-label="Choose your tree species">
      <h2 className="cs-panel-title species-picker-title">Choose your tree</h2>

      <div
        className="species-options"
        role="radiogroup"
        aria-label={`${language.name} tree species for ${topic.name}`}
      >
        {language.species.map((sp) => {
          const selected = sp === current;
          return (
            <button
              key={sp}
              type="button"
              role="radio"
              aria-checked={selected}
              className={`species-option${selected ? ' is-selected' : ''}`}
              onClick={() => setTreeKind(topicId, sp)}
            >
              <span className="species-preview" aria-hidden="true">
                <Tree stage={4.6} wilted={false} kind={sp} size={92} />
              </span>
              <span className="species-name">{sp}</span>
            </button>
          );
        })}
      </div>

      <p className="species-hint">Species locks once your tree starts growing.</p>
    </section>
  );
}
