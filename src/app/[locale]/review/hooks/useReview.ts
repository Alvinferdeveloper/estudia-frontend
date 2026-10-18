import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import {
  type Flashcard,
  flashcardKeys,
} from "@/app/[locale]/document/[id]/components/flashcards/hooks/useFlashcards";

export const FLASHCARD_RATINGS = ["again", "hard", "good", "easy"] as const;
export type FlashcardRating = (typeof FLASHCARD_RATINGS)[number];

// Mirrors the API's review views (estudia-api `flashcard-review.service.ts`).
export interface DueFlashcard extends Flashcard {
  // When the card would be due again after each rating.
  preview: Record<FlashcardRating, string>;
}

export interface ReviewSummary {
  total: number;
  due: number;
  nextDueAt: string | null;
}

const scopeParams = (documentId?: string) => (documentId ? { params: { documentId } } : undefined);

// A session works on a snapshot: refetched when the page opens, never while reviewing.
export const useDueFlashcards = (documentId?: string) =>
  useQuery({
    queryKey: flashcardKeys.due(documentId),
    queryFn: async () => {
      const { data } = await api.get<DueFlashcard[]>("/flashcards/due", scopeParams(documentId));
      return data;
    },
    staleTime: Infinity,
    gcTime: 0,
    refetchOnWindowFocus: false,
  });

export const useReviewSummary = (documentId?: string, { enabled = true }: { enabled?: boolean } = {}) =>
  useQuery({
    queryKey: flashcardKeys.summary(documentId),
    queryFn: async () => {
      const { data } = await api.get<ReviewSummary>("/flashcards/summary", scopeParams(documentId));
      return data;
    },
    enabled,
  });

export const useReviewFlashcard = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, rating }: { id: string; rating: FlashcardRating }) => {
      const { data } = await api.post<DueFlashcard>(`/flashcards/${id}/review`, { rating });
      return data;
    },
    // Everything but the running session's own snapshot.
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: flashcardKeys.all,
        predicate: (query) => query.queryKey[1] !== flashcardKeys.due()[1],
      }),
  });
};
