import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

const deleteDocument = async (documentId: string): Promise<void> => {
  await axios.delete(`http://localhost:3001/documents/${documentId}`, { withCredentials: true });
};

export const useDeleteDocument = (topicId?: string) => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, string>({
    mutationFn: deleteDocument,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents', topicId] });
      queryClient.invalidateQueries({ queryKey: ['topics'] });
    },
  });
};
