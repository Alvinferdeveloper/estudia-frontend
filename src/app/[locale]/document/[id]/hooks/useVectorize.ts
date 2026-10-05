import { useMutation, useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api-client';

interface VectorizeResponse {
  success: boolean;
  chunksCreated: number;
}

const vectorizeDocument = async (documentId: string): Promise<VectorizeResponse> => {
  const { data } = await api.post(`/documents/${documentId}/vectorize`, {});
  return data;
};

export const useVectorizeDocument = (documentId: string) => {
  return useMutation<VectorizeResponse, Error>({
    mutationFn: () => vectorizeDocument(documentId),
  });
};

const getVectorizeStatus = async (documentId: string): Promise<{ isVectorized: boolean }> => {
  const { data } = await api.get(`/documents/${documentId}/vectorize-status`);
  return data;
};

export const useVectorizeStatus = (documentId: string) => {
  return useQuery<{ isVectorized: boolean }, Error>({
    queryKey: ['vectorizeStatus', documentId],
    queryFn: () => getVectorizeStatus(documentId),
    refetchInterval: false,
  });
};
