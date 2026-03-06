import { useState, useCallback } from "react";

export interface SelectionRect {
  top: number;
  left: number;
  width: number;
  height: number;
  pageWidth?: number;
  pageHeight?: number;
}

export interface TextSelection {
  text: string;
  rects: SelectionRect[];
  pageNumber: number;
}

export interface UseTextSelectionReturn {
  selectedText: string | null;
  selectionRects: SelectionRect[];
  selectedPage: number;
  hasSelection: boolean;
  handleTextSelection: (selection: TextSelection) => void;
  clearSelection: () => void;
}

export const useTextSelection = (): UseTextSelectionReturn => {
  const [selectedText, setSelectedText] = useState<string | null>(null);
  const [selectionRects, setSelectionRects] = useState<SelectionRect[]>([]);
  const [selectedPage, setSelectedPage] = useState<number>(1);

  const handleTextSelection = useCallback((selection: TextSelection) => {
    setSelectedText(selection.text);
    setSelectionRects(selection.rects);
    setSelectedPage(selection.pageNumber);
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedText(null);
    setSelectionRects([]);
    setSelectedPage(1);
  }, []);

  const hasSelection = selectedText !== null && selectedText.length > 0;

  return {
    selectedText,
    selectionRects,
    selectedPage,
    hasSelection,
    handleTextSelection,
    clearSelection,
  };
};
