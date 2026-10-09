import { useCallback, useEffect, useState } from "react";

const read = (key: string, fallback: boolean): boolean => {
  try {
    const stored = window.localStorage.getItem(key);
    return stored === null ? fallback : stored === "true";
  } catch {
    return fallback;
  }
};

// A boolean preference remembered in this browser. Starts at the fallback so server and client render alike.
export const useStoredBoolean = (key: string, fallback = false) => {
  const [value, setValue] = useState(fallback);

  useEffect(() => {
    setValue(read(key, fallback));
  }, [key, fallback]);

  const toggle = useCallback(() => {
    setValue((prev) => {
      const next = !prev;
      try {
        window.localStorage.setItem(key, String(next));
      } catch {
        // Storage can be blocked (private browsing); the preference just won't persist.
      }
      return next;
    });
  }, [key]);

  return [value, toggle] as const;
};
