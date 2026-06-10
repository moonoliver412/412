import { useProgress } from '../state/useProgress';
import { findTopic } from '../data/curriculum';
import Tree from './Tree';
import './SpeciesPicker.css';

// ---------------------------------------------------------------------------
// <SpeciesPicker topicId /> — choose the LANGUAGE's forest species.
//
// One species per language: pick oak for HTML and every HTML topic grows as
// an oak — the whole plot becomes an oak forest. The choice is open until
// ANY tree of the language locks its first growth stage, then it's fixed
// (the forest has taken root) and the panel collapses to a one-line note.
// ---------------------------------------------------------------------------

export default function SpeciesPicker({ topicId }) {
  const { getTreeKind, setTreeKind, isLangLocked } = useProgress();
  const found = findTopic(topicId);
  if (!found) return null;

  const { language } = found;
  const current = getTreeKind(topicId); // language-level choice
  const locked = isLangLocked(language.id);

  if (locked) {
    return (
      <p className="species-locked-note" role="note">
        Forest locked — {language.name} grows as a{' '}
        <span className="species-locked-kind">{current}</span> forest.
      </p>
    );
  }

  return (
    <section className="cs-panel species-picker" aria-label="Choose your forest species">
      <h2 className="cs-panel-title species-picker-title">
        Choose your {language.name} forest
      </h2>

      <div
        className="species-options"
        role="radiogroup"
        aria-label={`Forest species for ${language.name}`}
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
              onClick={() => setTreeKind(language.id, sp)}
            >
              <span className="species-preview" aria-hidden="true">
                <Tree stage={4.6} wilted={false} kind={sp} size={92} />
              </span>
              <span className="species-name">{sp}</span>
            </button>
          );
        })}
      </div>

      <p className="species-hint">
        Every {language.name} tree grows as this species. Locks once the first
        tree takes root.
      </p>
    </section>
  );
}
