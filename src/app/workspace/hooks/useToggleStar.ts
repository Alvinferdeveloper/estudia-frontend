import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

export const useToggleDocumentStar = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, isStarred }: { id: string; isStarred: boolean }) => {
      await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/documents/${id}/star`,
        { isStarred },
        { withCredentials: true },
      );
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
      await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/folders/${id}/star`,
        { isStarred },
        { withCredentials: true },
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['items'] });
    },
  });
};
