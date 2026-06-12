// Cross-tab state sync. The `storage` event only fires in OTHER tabs, so a
// provider can safely reload its slice whenever a sibling tab writes the key
// — no echo loops, last writer wins everywhere within one event loop turn.

/** Subscribe to another tab writing `key`. Returns an unsubscribe fn. */
export function onStorageKey(key, handler) {
  const listener = (e) => {
    if (e.storageArea === localStorage && e.key === key) handler(e.newValue);
  };
  window.addEventListener('storage', listener);
  return () => window.removeEventListener('storage', listener);
}
