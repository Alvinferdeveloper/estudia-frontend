import { useState, useCallback } from "react";

interface UseExamModeReturn {
  isExamMode: boolean;
  selectedPages: number[];
  enableExamMode: () => void;
  disableExamMode: () => void;
  togglePage: (pageNumber: number) => void;
  clearSelection: () => void;
  canGenerateExam: boolean;
}

export const useExamMode = (): UseExamModeReturn => {
  const [isExamMode, setIsExamMode] = useState(false);
  const [selectedPages, setSelectedPages] = useState<number[]>([]);

  const enableExamMode = useCallback(() => {
    setIsExamMode(true);
  }, []);

  const disableExamMode = useCallback(() => {
    setIsExamMode(false);
    setSelectedPages([]);
  }, []);

  const togglePage = useCallback((pageNumber: number) => {
    setSelectedPages(prev => {
      if (prev.includes(pageNumber)) {
        return prev.filter(p => p !== pageNumber);
      }
      return [...prev, pageNumber].sort((a, b) => a - b);
    });
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedPages([]);
  }, []);

  return {
    isExamMode,
    selectedPages,
    enableExamMode,
    disableExamMode,
    togglePage,
    clearSelection,
    canGenerateExam: selectedPages.length > 0,
  };
};
