import { useState, useEffect, useCallback, useRef } from "react";
import { Annotation } from "@/app/types";

const DEFAULT_COLOR = "#FFEB3B";

interface UseNoteDialogOptions {
  isOpen: boolean;
  existingAnnotation?: Annotation | null;
  onClose: () => void;
}

export const useNoteDialog = ({
  isOpen,
  existingAnnotation,
  onClose,
}: UseNoteDialogOptions) => {
  const [prompt, setPrompt] = useState("");
  const [selectedColor, setSelectedColor] = useState(DEFAULT_COLOR);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [localOriginalNote, setLocalOriginalNote] = useState("");
  
  const initialPromptRef = useRef("");
  const originalCompletionRef = useRef("");

  const handleReset = useCallback(() => {
    setPrompt("");
    setSaveError(null);
    setIsExpanded(false);
    setLocalOriginalNote("");
    initialPromptRef.current = "";
    originalCompletionRef.current = "";
  }, []);

  useEffect(() => {
    if (isOpen) {
      if (existingAnnotation) {
        setPrompt(existingAnnotation.comment || "");
        setSelectedColor(existingAnnotation.color || DEFAULT_COLOR);
        initialPromptRef.current = existingAnnotation.comment || "";
        originalCompletionRef.current = existingAnnotation.aiResponse || "";
        setLocalOriginalNote(existingAnnotation.aiResponse || "");
        setIsExpanded(true);
      } else {
        handleReset();
      }
    }
  }, [isOpen, existingAnnotation, handleReset]);

  return {
    prompt,
    setPrompt,
    selectedColor,
    setSelectedColor,
    saveError,
    setSaveError,
    isExpanded,
    setIsExpanded,
    localOriginalNote,
    setLocalOriginalNote,
    initialPromptRef,
    originalCompletionRef,
    handleReset,
    isEditMode: !!existingAnnotation,
  };
};
