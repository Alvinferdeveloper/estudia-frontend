import { useState, useEffect, useCallback } from "react";
import { VocabularyEntry } from "@/app/types";
import { DEFAULT_VOCABULARY_COLOR } from "@/app/[locale]/document/[id]/lib/note-colors";

interface UseVocabularyDialogOptions {
  isOpen: boolean;
  existingEntry?: VocabularyEntry | null;
}

export const useVocabularyDialog = ({
  isOpen,
  existingEntry,
}: UseVocabularyDialogOptions) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [selectedColor, setSelectedColor] = useState(DEFAULT_VOCABULARY_COLOR);

  const handleReset = useCallback(() => {
    setIsFlipped(false);
    setSelectedColor(DEFAULT_VOCABULARY_COLOR);
  }, []);

  useEffect(() => {
    if (isOpen) {
      if (existingEntry) {
        setSelectedColor(existingEntry.color || DEFAULT_VOCABULARY_COLOR);
        setIsFlipped(true);
      } else {
        handleReset();
      }
    }
  }, [isOpen, existingEntry, handleReset]);

  return {
    isFlipped,
    setIsFlipped,
    selectedColor,
    setSelectedColor,
    handleReset,
  };
};
