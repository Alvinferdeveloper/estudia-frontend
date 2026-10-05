import { useCallback, useEffect, useState } from "react";

const storageKey = (documentId: string) => `languageMode:${documentId}`;

// The only real per-document preference is whether Language Mode is on —
// word/explanation language are derived live (detected document language,
// reader's own language), not chosen or persisted.
export const useLanguageMode = (documentId: string) => {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    try {
      setEnabled(window.localStorage.getItem(storageKey(documentId)) === "true");
    } catch {
      setEnabled(false);
    }
  }, [documentId]);

  const toggle = useCallback(() => {
    setEnabled((prev) => {
      const next = !prev;
      try {
        window.localStorage.setItem(storageKey(documentId), String(next));
      } catch {
        // ignore storage errors (e.g. private browsing quota)
      }
      return next;
    });
  }, [documentId]);

  return { enabled, toggle };
};

export type UseLanguageModeReturn = ReturnType<typeof useLanguageMode>;
