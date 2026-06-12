import { useEffect, useRef, useState } from 'react';
import { useGame } from '../state/useGame';
import { rarityOf } from '../data/chests';
import { play } from '../lib/sound';
import './ChestModal.css';

// Growth Chest opening — T3 ceremony. Rarity is visible BEFORE opening
// (legible variance); contents apply the moment the chest opens, so closing
// early never loses a reward. Opens chests oldest-first, one at a time.

export default function ChestModal({ onClose }) {
  const { game, openChest } = useGame();
  const [revealed, setRevealed] = useState(null);
  const dialogRef = useRef(null);

  const unopened = (game.chests ?? []).filter((c) => !c.openedAt);
  const current = unopened[0] ?? null;

  useEffect(() => {
    dialogRef.current?.focus();
  }, []);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  const handleOpen = () => {
    if (!current) return;
    play('chest');
    setRevealed(openChest(current.id));
  };

  const handleTake = () => {
    setRevealed(null);
    if (!unopened.length) onClose();
  };

  const rarity = revealed
    ? rarityOf(revealed)
    : current
      ? rarityOf(current)
      : null;

  return (
    <div
      className="cm-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="cs-panel cm-dialog"
        role="dialog"
        aria-modal="true"
        aria-label="Growth chest"
        tabIndex={-1}
        ref={dialogRef}
      >
        <button
          type="button"
          className="cm-close"
          aria-label="Close"
          onClick={onClose}
        >
          ✕
        </button>

        {revealed ? (
          <div className="cm-stage" key="revealed">
            <div className="cm-burst" aria-hidden="true">
              {Array.from({ length: 12 }, (_, i) => (
                <span
                  key={i}
                  className="cm-spark"
                  style={{ '--n': i, '--spark': rarity.color }}
                />
              ))}
            </div>
            <span className="cm-box cm-box--open" aria-hidden="true">
              🎁
            </span>
            <p className="cm-kicker" style={{ color: rarity.color }}>
              {rarity.label} chest opened
            </p>
            <p className="cm-contents" role="status">
              <span className="cm-gain">+{revealed.sprouts} 🌱</span>
              {revealed.freezes > 0 && (
                <span className="cm-gain">+{revealed.freezes} 🌧️ Rain Cloud</span>
              )}
            </p>
            <button
              type="button"
              className="cs-pill-btn cs-pill-btn--orange cm-btn"
              onClick={handleTake}
            >
              {unopened.length ? 'Next chest' : 'Take it'}
            </button>
          </div>
        ) : current ? (
          <div className="cm-stage" key={current.id}>
            <span
              className="cm-box"
              style={{ '--ring': rarity.color }}
              aria-hidden="true"
            >
              🎁
            </span>
            <p className="cm-kicker" style={{ color: rarity.color }}>
              {rarity.label} growth chest
            </p>
            <p className="cm-reason">Earned for: {current.reason}</p>
            <button
              type="button"
              className="cs-pill-btn cs-pill-btn--orange cm-btn"
              onClick={handleOpen}
            >
              Open it
            </button>
            {unopened.length > 1 && (
              <p className="cm-more">+{unopened.length - 1} more waiting</p>
            )}
          </div>
        ) : (
          <div className="cm-stage" key="empty">
            <p className="cm-reason">All chests opened. Earn more by
              mastering topics, sweeping daily quests, and hitting streak
              milestones.</p>
            <button
              type="button"
              className="cs-pill-btn cm-btn"
              onClick={onClose}
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
