import { useState, useEffect, useCallback } from "react";
import {
  useFetchAnnotations,
  useCreateAnnotation,
  useUpdateAnnotation,
  useDeleteAnnotation,
} from "@/app/document/[id]/hooks/useAnnotations";
import { Annotation } from "@/app/types";
import { SelectionRect } from "@/app/document/[id]/hooks/useTextSelection";

interface UseAnnotationActionsOptions {
  documentId: string;
  currentPage: number;
  selectionRects: SelectionRect[];
  selectedPage: number | null;
}

export const useAnnotationActions = ({
  documentId,
  currentPage,
  selectionRects,
  selectedPage,
}: UseAnnotationActionsOptions) => {
  const { data: annotations = [], refetch: refetchAnnotations } =
    useFetchAnnotations(documentId);
  const { mutate: createAnnotationMutation } = useCreateAnnotation(documentId);
  const { mutate: updateAnnotationMutation } = useUpdateAnnotation(documentId);
  const { mutate: deleteAnnotationMutation } = useDeleteAnnotation(documentId);

  const [localAnnotations, setLocalAnnotations] = useState<Annotation[]>([]);

  useEffect(() => {
    setLocalAnnotations(annotations);
  }, [annotations]);

  const handleAnnotationUpdated = useCallback(
    (updatedAnnotation: Annotation) => {
      setLocalAnnotations((prev) =>
        prev.length === 0
          ? annotations.map((a) =>
              a.id === updatedAnnotation.id ? updatedAnnotation : a
            )
          : prev.map((a) =>
              a.id === updatedAnnotation.id ? updatedAnnotation : a
            )
      );
    },
    [annotations]
  );

  const handleColorChange = useCallback(
    async (annotationId: string, color: string) => {
      return new Promise<void>((resolve, reject) => {
        updateAnnotationMutation(
          { annotationId, update: { color } },
          {
            onSuccess: () => {
              refetchAnnotations();
              resolve();
            },
            onError: (err) => reject(err),
          }
        );
      });
    },
    [updateAnnotationMutation, refetchAnnotations]
  );

  const handleSaveNote = useCallback(
    async (
      noteData: {
        selectedText: string;
        comment: string;
        aiResponse: string;
        color: string;
      },
      editingAnnotation: Annotation | null
    ) => {
      const { selectedText, comment, aiResponse, color } = noteData;

      if (editingAnnotation) {
        return new Promise<void>((resolve, reject) => {
          updateAnnotationMutation(
            {
              annotationId: editingAnnotation.id,
              update: { comment, aiResponse, color },
            },
            {
              onSuccess: () => {
                refetchAnnotations();
                resolve();
              },
              onError: (err) => reject(err),
            }
          );
        });
      }

      const rects = selectionRects.map((r) => ({
        x1: r.left,
        y1: r.top,
        x2: r.left + r.width,
        y2: r.top + r.height,
        width: r.pageWidth || 800,
        height: r.pageHeight || 1200,
        pageNumber: selectedPage ?? currentPage,
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

      return new Promise<void>((resolve, reject) => {
        createAnnotationMutation(
          {
            selectedText,
            comment,
            aiResponse,
            color,
            pageNumber: currentPage,
            boundingRect,
            rects,
          },
          {
            onSuccess: () => {
              refetchAnnotations();
              resolve();
            },
            onError: (err) => reject(err),
          }
        );
      });
    },
    [
      selectionRects,
      selectedPage,
      currentPage,
      updateAnnotationMutation,
      createAnnotationMutation,
      refetchAnnotations,
    ]
  );

  const handleDeleteNote = useCallback(
    async (annotationId: string) => {
      return new Promise<void>((resolve, reject) => {
        deleteAnnotationMutation(annotationId, {
          onSuccess: () => {
            refetchAnnotations();
            resolve();
          },
          onError: (err) => reject(err),
        });
      });
    },
    [deleteAnnotationMutation, refetchAnnotations]
  );

  return {
    annotations: localAnnotations,
    handleAnnotationUpdated,
    handleColorChange,
    handleSaveNote,
    handleDeleteNote,
  };
};
