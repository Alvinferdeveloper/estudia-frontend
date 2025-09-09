import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { Document } from '@/app/types';

const uploadDocument = async (formData: FormData): Promise<Document> => {
  const { data } = await axios.post('http://localhost:3001/documents/upload', formData, {
    withCredentials: true,
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
      queryClient.invalidateQueries({ queryKey: ['topics'] });
    },
  });
};
