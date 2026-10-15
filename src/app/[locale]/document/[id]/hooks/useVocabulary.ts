import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import { flashcardsQueryKey } from '@/app/[locale]/document/[id]/components/flashcards/hooks/useFlashcards';
import { AnnotationRect, BoundingRect, VocabularyEntry, VocabularyExplanation } from '@/app/types';

const fetchVocabulary = async (documentId: string): Promise<VocabularyEntry[]> => {
  const { data } = await api.get(`/documents/${documentId}/vocabulary`);
  return data;
};

export const useFetchVocabulary = (documentId: string) => {
  return useQuery<VocabularyEntry[], Error>({
    queryKey: ['vocabulary', documentId],
    queryFn: () => fetchVocabulary(documentId),
  });
};

interface CreateVocabularyEntryRequest {
  selectedText: string;
  wordLanguage: string;
  explanationLanguage: string;
  color: string;
  pageNumber: number;
  boundingRect: BoundingRect;
  rects: AnnotationRect[];
  explanation?: VocabularyExplanation;
}

const createVocabularyEntry = async (documentId: string, entry: CreateVocabularyEntryRequest): Promise<VocabularyEntry> => {
  const { data } = await api.post(`/documents/${documentId}/vocabulary`, entry);
  return data;
};

export const useCreateVocabularyEntry = (documentId: string) => {
  const queryClient = useQueryClient();

  return useMutation<VocabularyEntry, Error, CreateVocabularyEntryRequest>({
    mutationFn: (entry) => createVocabularyEntry(documentId, entry),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vocabulary', documentId] });
    },
  });
};

const deleteVocabularyEntry = async (id: string): Promise<void> => {
  await api.delete(`/vocabulary/${id}`);
};

export const useDeleteVocabularyEntry = (documentId: string) => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: (id) => deleteVocabularyEntry(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vocabulary', documentId] });
      // The word's card is deleted with it.
      queryClient.invalidateQueries({ queryKey: flashcardsQueryKey(documentId) });
    },
  });
};

interface UpdateVocabularyEntryRequest {
  color?: string;
  explanation?: VocabularyExplanation | null;
  boundingRect?: BoundingRect;
  rects?: AnnotationRect[];
}

const updateVocabularyEntry = async (id: string, update: UpdateVocabularyEntryRequest): Promise<VocabularyEntry> => {
  const { data } = await api.patch(`/vocabulary/${id}`, update);
  return data;
};

export const useUpdateVocabularyEntry = (documentId: string) => {
  const queryClient = useQueryClient();

  return useMutation<VocabularyEntry, Error, { id: string; update: UpdateVocabularyEntryRequest }>({
    mutationFn: ({ id, update }) => updateVocabularyEntry(id, update),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vocabulary', documentId] });
    },
  });
};
