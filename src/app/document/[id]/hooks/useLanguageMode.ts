import { useCallback, useEffect, useState } from "react";
import { LanguageCode } from "@/app/types";

interface LanguageModeState {
  enabled: boolean;
  wordLanguage: LanguageCode;
  explanationLanguage: LanguageCode;
}

const DEFAULT_STATE: LanguageModeState = {
  enabled: false,
  wordLanguage: "en",
  explanationLanguage: "es",
};

const storageKey = (documentId: string) => `languageMode:${documentId}`;

export const useLanguageMode = (documentId: string) => {
  const [state, setState] = useState<LanguageModeState>(DEFAULT_STATE);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(storageKey(documentId));
      if (raw) {
        setState({ ...DEFAULT_STATE, ...JSON.parse(raw) });
      }
    } catch {
      // ignore malformed/local storage access errors, fall back to defaults
    }
  }, [documentId]);

  const persist = useCallback(
    (next: LanguageModeState) => {
      setState(next);
      try {
        window.localStorage.setItem(storageKey(documentId), JSON.stringify(next));
      } catch {
        // ignore storage errors (e.g. private browsing quota)
      }
    },
    [documentId]
  );

  const toggle = useCallback(() => {
    persist({ ...state, enabled: !state.enabled });
  }, [persist, state]);

  const flipDirection = useCallback(() => {
    persist({
      ...state,
      wordLanguage: state.explanationLanguage,
      explanationLanguage: state.wordLanguage,
    });
  }, [persist, state]);

  return {
    enabled: state.enabled,
    wordLanguage: state.wordLanguage,
    explanationLanguage: state.explanationLanguage,
    toggle,
    flipDirection,
  };
};

export type UseLanguageModeReturn = ReturnType<typeof useLanguageMode>;
