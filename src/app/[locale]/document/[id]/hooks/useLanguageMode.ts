import { useStoredBoolean } from "@/hooks/useStoredBoolean";

// The only real per-document preference is whether Language Mode is on —
// word/explanation language are derived live (detected document language,
// reader's own language), not chosen or persisted.
export const useLanguageMode = (documentId: string) => {
  const [enabled, toggle] = useStoredBoolean(`languageMode:${documentId}`);
  return { enabled, toggle };
};

export type UseLanguageModeReturn = ReturnType<typeof useLanguageMode>;
