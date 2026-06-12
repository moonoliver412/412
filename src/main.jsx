import './styles/theme.css'; // must load before components so their CSS can override theme classes
import { registerSW } from 'virtual:pwa-register';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { GameProvider } from './state/useGame';
import { ProgressProvider } from './state/useProgress';
import { SettingsProvider } from './state/useSettings';
import ErrorBoundary from './components/ErrorBoundary';
import App from './App';

// PWA: prompt-mode updates — UpdatePill listens for this event and the
// learner decides when to reload (never mid-exercise).
const applyUpdate = registerSW({
  onNeedRefresh() {
    window.dispatchEvent(new CustomEvent('cs-sw-update'));
  },
});
window.__csApplyUpdate = () => applyUpdate(true);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <BrowserRouter>
        <SettingsProvider>
          <GameProvider>
            <ProgressProvider>
              <App />
            </ProgressProvider>
          </GameProvider>
        </SettingsProvider>
      </BrowserRouter>
    </ErrorBoundary>
  </StrictMode>
);
