import { useMutation, useQuery } from '@tanstack/react-query';
import axios from 'axios';

interface VectorizeResponse {
  success: boolean;
  chunksCreated: number;
}

const vectorizeDocument = async (documentId: string): Promise<VectorizeResponse> => {
  const { data } = await axios.post(
    `${process.env.NEXT_PUBLIC_API_URL}/documents/${documentId}/vectorize`,
    {},
    { withCredentials: true }
  );
  return data;
};

export const useVectorizeDocument = (documentId: string) => {
  return useMutation<VectorizeResponse, Error>({
    mutationFn: () => vectorizeDocument(documentId),
  });
};

const getVectorizeStatus = async (documentId: string): Promise<{ isVectorized: boolean }> => {
  const { data } = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/documents/${documentId}/vectorize-status`,
    { withCredentials: true }
  );
  return data;
};

export const useVectorizeStatus = (documentId: string) => {
  return useQuery<{ isVectorized: boolean }, Error>({
    queryKey: ['vectorizeStatus', documentId],
    queryFn: () => getVectorizeStatus(documentId),
    refetchInterval: false,
  });
};
