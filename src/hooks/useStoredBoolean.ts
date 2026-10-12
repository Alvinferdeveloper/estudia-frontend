import { useCallback, useEffect, useState } from "react";
import { readStoredPreference, writeStoredPreference } from "@/lib/stored-preference";

// A boolean preference remembered in this browser. Starts at the fallback so server and client render alike.
export const useStoredBoolean = (key: string, fallback = false) => {
  const [value, setValue] = useState(fallback);

  useEffect(() => {
    const stored = readStoredPreference(key);
    setValue(stored === null ? fallback : stored === "true");
  }, [key, fallback]);

  const toggle = useCallback(() => {
    setValue((prev) => {
      const next = !prev;
      writeStoredPreference(key, String(next));
      return next;
    });
  }, [key]);

  return [value, toggle] as const;
};
