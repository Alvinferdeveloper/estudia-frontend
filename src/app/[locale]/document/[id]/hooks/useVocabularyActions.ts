import { useCallback } from "react";
import {
  useFetchVocabulary,
  useCreateVocabularyEntry,
  useUpdateVocabularyEntry,
  useDeleteVocabularyEntry,
} from "@/app/[locale]/document/[id]/hooks/useVocabulary";
import { VocabularyEntry, VocabularyExplanation } from "@/app/types";
import { SelectionRect } from "@/app/[locale]/document/[id]/hooks/useTextSelection";

interface UseVocabularyActionsOptions {
  documentId: string;
  currentPage: number;
  selectionRects: SelectionRect[];
  selectedPage: number | null;
}

export const useVocabularyActions = ({
  documentId,
  currentPage,
  selectionRects,
  selectedPage,
}: UseVocabularyActionsOptions) => {
  const { data: vocabularyEntries = [], refetch: refetchVocabulary } =
    useFetchVocabulary(documentId);
  const { mutate: createEntryMutation } = useCreateVocabularyEntry(documentId);
  const { mutate: updateEntryMutation } = useUpdateVocabularyEntry(documentId);
  const { mutate: deleteEntryMutation } = useDeleteVocabularyEntry(documentId);

  const handleColorChange = useCallback(
    async (entryId: string, color: string) => {
      return new Promise<void>((resolve, reject) => {
        updateEntryMutation(
          { id: entryId, update: { color } },
          {
            onSuccess: () => {
              refetchVocabulary();
              resolve();
            },
            onError: (err) => reject(err),
          }
        );
      });
    },
    [updateEntryMutation, refetchVocabulary]
  );

  const handleSaveEntry = useCallback(
    async (
      entryData: {
        selectedText: string;
        wordLanguage: string;
        explanationLanguage: string;
        explanation: VocabularyExplanation;
        color: string;
      },
      editingEntry: VocabularyEntry | null
    ) => {
      const { selectedText, wordLanguage, explanationLanguage, explanation, color } = entryData;

      if (editingEntry) {
        return new Promise<VocabularyEntry>((resolve, reject) => {
          updateEntryMutation(
            {
              id: editingEntry.id,
              update: { explanation, color },
            },
            {
              onSuccess: (data) => {
                refetchVocabulary();
                resolve(data);
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

      return new Promise<VocabularyEntry>((resolve, reject) => {
        createEntryMutation(
          {
            selectedText,
            wordLanguage,
            explanationLanguage,
            color,
            pageNumber: currentPage,
            boundingRect,
            rects,
            explanation,
          },
          {
            onSuccess: (data) => {
              refetchVocabulary();
              resolve(data);
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
      updateEntryMutation,
      createEntryMutation,
      refetchVocabulary,
    ]
  );

  const handleDeleteEntry = useCallback(
    async (entryId: string) => {
      return new Promise<void>((resolve, reject) => {
        deleteEntryMutation(entryId, {
          onSuccess: () => {
            refetchVocabulary();
            resolve();
          },
          onError: (err) => reject(err),
        });
      });
    },
    [deleteEntryMutation, refetchVocabulary]
  );

  return {
    vocabularyEntries,
    handleColorChange,
    handleSaveEntry,
    handleDeleteEntry,
  };
};
