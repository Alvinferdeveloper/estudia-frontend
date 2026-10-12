// Preferences remembered in this browser. Storage can be blocked (private browsing); then they just don't persist.

export const readStoredPreference = (key: string): string | null => {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
};

export const writeStoredPreference = (key: string, value: string): void => {
  try {
    window.localStorage.setItem(key, value);
  } catch {
    // Not persisting is acceptable for a preference.
  }
};
