import { useState, useCallback } from "react";
import axios from "axios";
import { SelectionRect } from "./useTextSelection";

interface NoteGenerationOptions {
  documentId: string;
  documentFileName: string;
  currentPage: number;
  onSuccess?: () => void;
}

interface CreateAnnotationOptions {
  selectedText: string;
  prompt: string;
  color: string;
  selectionRects: SelectionRect[];
}

export interface UseNoteGenerationReturn {
  isGenerating: boolean;
  error: string | null;
  generateNote: (options: CreateAnnotationOptions) => Promise<void>;
  resetError: () => void;
}

export const useNoteGeneration = ({
  documentId,
  documentFileName,
  currentPage,
  onSuccess,
}: NoteGenerationOptions): UseNoteGenerationReturn => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const resetError = useCallback(() => setError(null), []);

  const generateNote = useCallback(
    async ({ selectedText, prompt, color, selectionRects }: CreateAnnotationOptions) => {
      if (!selectedText) return;

      setIsGenerating(true);
      setError(null);

      try {
        const response = await axios.post(`/api/generate-note`, {
          selectedText,
          prompt,
          documentContext: `Document: ${documentFileName}`,
        });

        const generatedContent = response.data.content;

        const rects = selectionRects.map((r) => ({
          x1: r.left,
          y1: r.top,
          x2: r.left + r.width,
          y2: r.top + r.height,
          width: r.pageWidth || 800,
          height: r.pageHeight || 1200,
          pageNumber: currentPage,
        }));

        const boundingRect = {
          x1: Math.min(...rects.map((r) => r.x1)),
          y1: Math.min(...rects.map((r) => r.y1)),
          x2: Math.max(...rects.map((r) => r.x2)),
          y2: Math.max(...rects.map((r) => r.y2)),
          width: rects[0]?.width || 800,
          height: rects[0]?.height || 1200,
          pageNumber: currentPage,
        };

        const annotationData = {
          selectedText,
          comment: prompt,
          aiResponse: generatedContent,
          color,
          pageNumber: currentPage,
          boundingRect,
          rects,
        };

        await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/documents/${documentId}/annotations`,
          annotationData,
          { withCredentials: true }
        );

        onSuccess?.();
      } catch (err) {
        console.error("Error generating note:", err);
        setError("Failed to generate note. Please try again.");
        throw err;
      } finally {
        setIsGenerating(false);
      }
    },
    [documentId, documentFileName, currentPage, onSuccess]
  );

  return {
    isGenerating,
    error,
    generateNote,
    resetError,
  };
};
