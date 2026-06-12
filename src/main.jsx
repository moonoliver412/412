import './styles/theme.css'; // must load before components so their CSS can override theme classes
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { GameProvider } from './state/useGame';
import { ProgressProvider } from './state/useProgress';
import { SettingsProvider } from './state/useSettings';
import ErrorBoundary from './components/ErrorBoundary';
import App from './App';

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
