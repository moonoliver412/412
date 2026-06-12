import { useEffect, useState } from 'react';
import './UpdatePill.css';

// PWA update prompt: main.jsx dispatches 'cs-sw-update' when a new service
// worker is waiting. We never auto-reload — a learner could be mid-exercise.

export default function UpdatePill() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const onUpdate = () => setReady(true);
    window.addEventListener('cs-sw-update', onUpdate);
    return () => window.removeEventListener('cs-sw-update', onUpdate);
  }, []);

  if (!ready) return null;

  return (
    <div className="up-pill" role="status">
      <span>A new version of CodeSprout is ready.</span>
      <button
        type="button"
        className="up-btn"
        onClick={() => window.__csApplyUpdate?.()}
      >
        Reload
      </button>
      <button
        type="button"
        className="up-dismiss"
        aria-label="Later"
        onClick={() => setReady(false)}
      >
        ✕
      </button>
    </div>
  );
}
