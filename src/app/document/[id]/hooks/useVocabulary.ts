import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { AnnotationRect, BoundingRect, VocabularyEntry, VocabularyExplanation } from '@/app/types';

const fetchVocabulary = async (documentId: string): Promise<VocabularyEntry[]> => {
  const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/documents/${documentId}/vocabulary`, { withCredentials: true });
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
  const { data } = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/documents/${documentId}/vocabulary`, entry, { withCredentials: true });
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
  await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/vocabulary/${id}`, { withCredentials: true });
};

export const useDeleteVocabularyEntry = (documentId: string) => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: (id) => deleteVocabularyEntry(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vocabulary', documentId] });
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
  const { data } = await axios.patch(`${process.env.NEXT_PUBLIC_API_URL}/vocabulary/${id}`, update, { withCredentials: true });
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
