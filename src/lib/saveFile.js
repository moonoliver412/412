// Export/import of the whole save as one versioned JSON bundle. This same
// serializer becomes the cloud-sync payload in the backend phase.

const BUNDLE_VERSION = 1;
const KEYS = [
  'codesprout-progress-v1',
  'codesprout-game-v1',
  'codesprout-langkinds-v1',
  'codesprout-settings-v1',
  'codesprout-onboarded-v1',
];

export function exportBundle() {
  const data = {};
  for (const key of KEYS) {
    const raw = localStorage.getItem(key);
    if (raw !== null) data[key] = raw;
  }
  return JSON.stringify(
    { app: 'codesprout', version: BUNDLE_VERSION, exportedAt: Date.now(), data },
    null,
    2
  );
}

export function downloadBundle() {
  const blob = new Blob([exportBundle()], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `codesprout-save-${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

/** Validate + write a bundle into localStorage. Throws on bad input.
 *  Callers reload afterwards so every provider rehydrates cleanly. */
export function importBundle(text) {
  const bundle = JSON.parse(text);
  if (bundle?.app !== 'codesprout' || typeof bundle.data !== 'object') {
    throw new Error('Not a CodeSprout save file');
  }
  for (const [key, value] of Object.entries(bundle.data)) {
    if (!KEYS.includes(key) || typeof value !== 'string') continue;
    JSON.parse(value); // every slot must at least be valid JSON
    localStorage.setItem(key, value);
  }
}
