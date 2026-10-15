import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api-client";

export const FLASHCARD_SOURCES = ["manual", "note", "vocabulary"] as const;
export type FlashcardSource = (typeof FLASHCARD_SOURCES)[number];

// Mirrors the API's flashcard entity (estudia-api `Flashcard.entity.ts`).
export interface Flashcard {
  id: string;
  documentId: string;
  source: FlashcardSource;
  vocabularyEntryId: string | null;
  annotationId: string | null;
  front: string;
  // Markdown.
  back: string;
  pageNumber: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface FlashcardContent {
  front: string;
  back: string;
}

export const flashcardsQueryKey = (documentId: string) => ["flashcards", documentId] as const;

export const useFlashcards = (documentId: string) =>
  useQuery({
    queryKey: flashcardsQueryKey(documentId),
    queryFn: async () => {
      const { data } = await api.get<Flashcard[]>(`/documents/${documentId}/flashcards`);
      return data;
    },
  });

const useInvalidateFlashcards = (documentId: string) => {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: flashcardsQueryKey(documentId) });
};

export const useCreateFlashcard = (documentId: string) => {
  const invalidate = useInvalidateFlashcards(documentId);
  return useMutation({
    mutationFn: async (card: FlashcardContent & { pageNumber?: number }) => {
      const { data } = await api.post<Flashcard>(`/documents/${documentId}/flashcards`, card);
      return data;
    },
    onSuccess: invalidate,
    meta: { inlineError: true },
  });
};

export const useUpdateFlashcard = (documentId: string) => {
  const invalidate = useInvalidateFlashcards(documentId);
  return useMutation({
    mutationFn: async ({ id, ...card }: FlashcardContent & { id: string }) => {
      const { data } = await api.patch<Flashcard>(`/flashcards/${id}`, card);
      return data;
    },
    onSuccess: invalidate,
    meta: { inlineError: true },
  });
};

export const useDeleteFlashcard = (documentId: string) => {
  const invalidate = useInvalidateFlashcards(documentId);
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/flashcards/${id}`);
    },
    onSuccess: invalidate,
  });
};
