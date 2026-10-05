import { useState, useEffect, useCallback } from "react";
import { VocabularyEntry } from "@/app/types";

const DEFAULT_COLOR = "#B39DDB";

interface UseVocabularyDialogOptions {
  isOpen: boolean;
  existingEntry?: VocabularyEntry | null;
}

export const useVocabularyDialog = ({
  isOpen,
  existingEntry,
}: UseVocabularyDialogOptions) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [selectedColor, setSelectedColor] = useState(DEFAULT_COLOR);
  const [saveError, setSaveError] = useState<string | null>(null);

  const handleReset = useCallback(() => {
    setIsFlipped(false);
    setSelectedColor(DEFAULT_COLOR);
    setSaveError(null);
  }, []);

  useEffect(() => {
    if (isOpen) {
      if (existingEntry) {
        setSelectedColor(existingEntry.color || DEFAULT_COLOR);
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
    saveError,
    setSaveError,
    handleReset,
    isEditMode: !!existingEntry,
  };
};
