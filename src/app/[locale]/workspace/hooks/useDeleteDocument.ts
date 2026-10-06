import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api-client';

const deleteDocument = async (documentId: string): Promise<void> => {
  await api.delete(`/documents/${documentId}`);
};

export const useDeleteDocument = (topicId?: string) => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, string>({
    mutationFn: deleteDocument,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents', topicId] });
      queryClient.invalidateQueries({ queryKey: ['items'] });
      queryClient.invalidateQueries({ queryKey: ['topics'] });
    },
    // Changes the documents and storage quotas.
    meta: { refreshesUsage: true },
  });
};
