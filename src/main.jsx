import './styles/theme.css'; // must load before components so their CSS can override theme classes
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { GameProvider } from './state/useGame';
import { ProgressProvider } from './state/useProgress';
import ErrorBoundary from './components/ErrorBoundary';
import App from './App';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <BrowserRouter>
        <GameProvider>
          <ProgressProvider>
            <App />
          </ProgressProvider>
        </GameProvider>
      </BrowserRouter>
    </ErrorBoundary>
  </StrictMode>
);
