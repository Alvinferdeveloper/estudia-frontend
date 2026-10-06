import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import { Document } from '@/app/types';

const uploadDocument = async (formData: FormData): Promise<Document> => {
  const { data } = await api.post('/documents/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return data;
};

export const useUploadDocument = (topicId?: string) => {
  const queryClient = useQueryClient();
  return useMutation<Document, Error, FormData>({
    mutationFn: uploadDocument,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents', topicId] });
      queryClient.invalidateQueries({ queryKey: ['items'] });
      queryClient.invalidateQueries({ queryKey: ['topics'] });
    },
    // Changes the documents and storage quotas.
    meta: { refreshesUsage: true },
  });
};
