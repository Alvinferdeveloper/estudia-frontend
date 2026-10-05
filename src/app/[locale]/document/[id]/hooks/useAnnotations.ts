import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { Annotation } from '@/app/types';

const fetchAnnotations = async (documentId: string): Promise<Annotation[]> => {
  const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/documents/${documentId}/annotations`, { withCredentials: true });
  return data;
};

export const useFetchAnnotations = (documentId: string) => {
  return useQuery<Annotation[], Error>({
    queryKey: ['annotations', documentId],
    queryFn: () => fetchAnnotations(documentId),
  });
};

export const useFetchAnnotationsByPage = (documentId: string, pageNumber: number) => {
  return useQuery<Annotation[], Error>({
    queryKey: ['annotations', documentId, pageNumber],
    queryFn: () => fetchAnnotationsByPage(documentId, pageNumber),
    enabled: !!documentId && !!pageNumber,
  });
};

const fetchAnnotationsByPage = async (documentId: string, pageNumber: number): Promise<Annotation[]> => {
  const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/documents/${documentId}/annotations/page/${pageNumber}`, { withCredentials: true });
  return data;
};

interface CreateAnnotationRequest {
    selectedText: string;
    comment?: string;
    aiResponse?: string;
    color: string;
    pageNumber: number;
    boundingRect: { x1: number; y1: number; x2: number; y2: number; width: number; height: number; pageNumber: number };
    rects: { x1: number; y1: number; x2: number; y2: number; width: number; height: number; pageNumber: number }[];
    embedding?: string;
}

const createAnnotation = async (documentId: string, annotation: CreateAnnotationRequest): Promise<Annotation> => {
  const { data } = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/documents/${documentId}/annotations`, annotation, { withCredentials: true });
  return data;
};

export const useCreateAnnotation = (documentId: string) => {
  const queryClient = useQueryClient();

  return useMutation<Annotation, Error, CreateAnnotationRequest>({
    mutationFn: (annotation) => createAnnotation(documentId, annotation),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['annotations', documentId] });
    },
  });
};

const deleteAnnotation = async (annotationId: string): Promise<void> => {
  await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/annotations/${annotationId}`, { withCredentials: true });
};

export const useDeleteAnnotation = (documentId: string) => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: (annotationId) => deleteAnnotation(annotationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['annotations', documentId] });
    },
  });
};

interface UpdateAnnotationRequest {
    comment?: string;
    aiResponse?: string;
    color?: string;
    boundingRect?: { x1: number; y1: number; x2: number; y2: number; width: number; height: number; pageNumber: number };
    rects?: { x1: number; y1: number; x2: number; y2: number; width: number; height: number; pageNumber: number }[];
}

const updateAnnotation = async (annotationId: string, update: UpdateAnnotationRequest): Promise<Annotation> => {
  const { data } = await axios.patch(`${process.env.NEXT_PUBLIC_API_URL}/annotations/${annotationId}`, update, { withCredentials: true });
  return data;
};

export const useUpdateAnnotation = (documentId: string) => {
  const queryClient = useQueryClient();

  return useMutation<Annotation, Error, { annotationId: string; update: UpdateAnnotationRequest }>({
    mutationFn: ({ annotationId, update }) => updateAnnotation(annotationId, update),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['annotations', documentId] });
    },
  });
};
