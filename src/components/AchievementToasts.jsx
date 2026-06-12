import { useEffect } from 'react';
import { useGame } from '../state/useGame';
import { play } from '../lib/sound';
import './AchievementToasts.css';

// T3 celebration toasts for achievement unlocks (motion-graphics skill):
// they fire once per unlock (useGame only queues on the locked→unlocked
// edge), slide in with spring, and self-dismiss — never requiring action.

const TOAST_MS = 4500;

function Toast({ toast, onDone }) {
  useEffect(() => {
    play('badge');
    const id = setTimeout(() => onDone(toast.key), TOAST_MS);
    return () => clearTimeout(id);
  }, [toast.key, onDone]);

  return (
    <div className="ach-toast" role="status">
      <span className="ach-toast-icon" aria-hidden="true">
        {toast.icon}
      </span>
      <span className="ach-toast-text">
        <span className="ach-toast-kicker">
          {toast.kicker ?? 'Achievement unlocked'}
        </span>
        <span className="ach-toast-name">{toast.name}</span>
        <span className="ach-toast-blurb">{toast.blurb}</span>
      </span>
    </div>
  );
}

export default function AchievementToasts() {
  const { toasts, dismissToast } = useGame();
  if (!toasts.length) return null;
  return (
    <div className="ach-toasts" aria-live="polite">
      {toasts.map((toast) => (
        <Toast key={toast.key} toast={toast} onDone={dismissToast} />
      ))}
    </div>
  );
}
