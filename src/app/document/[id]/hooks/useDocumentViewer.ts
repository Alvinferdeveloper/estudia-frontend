import { useState, useCallback } from "react";

interface UseDocumentViewerOptions {
  initialPage?: number;
  initialScale?: number;
  minScale?: number;
  maxScale?: number;
}

export interface UseDocumentViewerReturn {
  currentPage: number;
  numPages: number | null;
  scale: number;
  setCurrentPage: (page: number) => void;
  setNumPages: (pages: number | null) => void;
  setScale: (scale: number) => void;
  goToNextPage: () => void;
  goToPreviousPage: () => void;
  zoomIn: () => void;
  zoomOut: () => void;
  resetZoom: () => void;
}

export const useDocumentViewer = (
  options: UseDocumentViewerOptions = {}
): UseDocumentViewerReturn => {
  const {
    initialPage = 1,
    initialScale = 1,
    minScale = 0.5,
    maxScale = 3,
  } = options;

  const [currentPage, setCurrentPage] = useState(initialPage);
  const [numPages, setNumPages] = useState<number | null>(null);
  const [scale, setScale] = useState(initialScale);

  const goToNextPage = useCallback(() => {
    if (numPages && currentPage < numPages) {
      setCurrentPage((prev) => prev + 1);
    }
  }, [currentPage, numPages]);

  const goToPreviousPage = useCallback(() => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  }, [currentPage]);

  const zoomIn = useCallback(() => {
    setScale((prev) => Math.min(maxScale, prev + 0.1));
  }, [maxScale]);

  const zoomOut = useCallback(() => {
    setScale((prev) => Math.max(minScale, prev - 0.1));
  }, [minScale]);

  const resetZoom = useCallback(() => {
    setScale(initialScale);
  }, [initialScale]);

  return {
    currentPage,
    numPages,
    scale,
    setCurrentPage,
    setNumPages,
    setScale,
    goToNextPage,
    goToPreviousPage,
    zoomIn,
    zoomOut,
    resetZoom,
  };
};
