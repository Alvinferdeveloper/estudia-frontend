import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api-client';

export const useToggleDocumentStar = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, isStarred }: { id: string; isStarred: boolean }) => {
      await api.patch(`/documents/${id}/star`, { isStarred });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['items'] });
    },
  });
};

export const useToggleFolderStar = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, isStarred }: { id: string; isStarred: boolean }) => {
      await api.patch(`/folders/${id}/star`, { isStarred });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['items'] });
    },
  });
};
