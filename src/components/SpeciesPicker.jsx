import { useEffect, useRef, useState } from 'react';
import { useProgress } from '../state/useProgress';
import { useGame } from '../state/useGame';
import { findTopic } from '../data/curriculum';
import { ownsSpecies, speciesPrice } from '../data/economy';
import Tree from './Tree';
import './SpeciesPicker.css';

// ---------------------------------------------------------------------------
// <SpeciesPicker topicId /> — choose the LANGUAGE's forest species.
//
// One species per language: pick oak for HTML and every HTML topic grows as
// an oak — the whole plot becomes an oak forest. The choice is open until
// ANY tree of the language locks its first growth stage, then it's fixed
// (the forest has taken root) and the panel collapses to a one-line note.
//
// Economy: each language's default species is free; the rest are bought
// once with sprouts (global ownership). Picking an unowned species buys it
// in the same click when the balance covers it.
// ---------------------------------------------------------------------------

const DENY_MS = 900;

export default function SpeciesPicker({ topicId }) {
  const { getTreeKind, setTreeKind, isLangLocked } = useProgress();
  const { game, unlockSpecies } = useGame();
  const [deniedSp, setDeniedSp] = useState(null);
  const denyTimer = useRef(0);

  useEffect(() => () => clearTimeout(denyTimer.current), []);

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

  const pick = (sp) => {
    if (ownsSpecies(game, language, sp)) {
      setTreeKind(language.id, sp);
      return;
    }
    if (unlockSpecies(sp, speciesPrice(language, sp))) {
      setTreeKind(language.id, sp);
    } else {
      setDeniedSp(sp);
      clearTimeout(denyTimer.current);
      denyTimer.current = setTimeout(() => setDeniedSp(null), DENY_MS);
    }
  };

  const anyForSale = language.species.some(
    (sp) => !ownsSpecies(game, language, sp)
  );

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
          const owned = ownsSpecies(game, language, sp);
          const price = speciesPrice(language, sp);
          return (
            <button
              key={sp}
              type="button"
              role="radio"
              aria-checked={selected}
              className={`species-option${selected ? ' is-selected' : ''}${
                deniedSp === sp ? ' is-denied' : ''
              }`}
              onClick={() => pick(sp)}
            >
              <span className="species-preview" aria-hidden="true">
                <Tree stage={4.6} wilted={false} kind={sp} size={92} />
              </span>
              <span className="species-name">{sp}</span>
              {!owned && (
                <span className="species-price">
                  <svg viewBox="0 0 24 24" width="11" height="11" aria-hidden="true">
                    <path d="M4 20C4 10 12 4 22 4c0 10-6 16-16 16" fill="currentColor" />
                  </svg>
                  {price}
                </span>
              )}
            </button>
          );
        })}
      </div>

      <p className="species-hint" role="status">
        {deniedSp
          ? `Not enough sprouts. Earn more by finishing lessons and sessions.`
          : anyForSale
            ? `Every ${language.name} tree grows as this species. Extra species cost sprouts. Your choice locks when the first tree starts growing.`
            : `Every ${language.name} tree grows as this species. Your choice locks when the first tree starts growing.`}
      </p>
    </section>
  );
}
