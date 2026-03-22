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

export interface UseTextSelectionOptions {
  onTextSelected?: (text: string, page: number) => void;
}

export interface UseTextSelectionReturn {
  selectedText: string | null;
  selectionRects: SelectionRect[];
  selectedPage: number;
  hasSelection: boolean;
  handleTextSelection: (selection: TextSelection) => void;
  clearSelection: () => void;
}

export const useTextSelection = (options?: UseTextSelectionOptions): UseTextSelectionReturn => {
  const [selectedText, setSelectedText] = useState<string | null>(null);
  const [selectionRects, setSelectionRects] = useState<SelectionRect[]>([]);
  const [selectedPage, setSelectedPage] = useState<number>(1);

  const handleTextSelection = useCallback((selection: TextSelection) => {
    setSelectedText(selection.text);
    setSelectionRects(selection.rects);
    setSelectedPage(selection.pageNumber);
    options?.onTextSelected?.(selection.text, selection.pageNumber);
  }, [options]);

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
