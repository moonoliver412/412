import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

// User preferences — sound, motion override. Persisted to
// codesprout-settings-v1; src/lib/sound.js reads the same key directly so a
// mute toggle applies on the very next cue.

const SETTINGS_KEY = 'codesprout-settings-v1';

function defaults() {
  return {
    sound: true,
    motion: 'auto', // 'auto' respects the OS; 'reduced' forces instant UI
  };
}

function loadSettings() {
  try {
    const stored = JSON.parse(localStorage.getItem(SETTINGS_KEY));
    return stored ? { ...defaults(), ...stored } : defaults();
  } catch {
    return defaults();
  }
}

const SettingsContext = createContext(null);

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(loadSettings);

  useEffect(() => {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  }, [settings]);

  // Forced reduced-motion: a root class that the global stylesheet honors.
  useEffect(() => {
    document.documentElement.classList.toggle(
      'force-reduced-motion',
      settings.motion === 'reduced'
    );
  }, [settings.motion]);

  const update = useCallback((patch) => {
    setSettings((prev) => ({ ...prev, ...patch }));
  }, []);

  const value = useMemo(() => ({ settings, update }), [settings, update]);

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components -- hook lives with its provider by design
export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error('useSettings must be used inside <SettingsProvider>');
  return ctx;
}
