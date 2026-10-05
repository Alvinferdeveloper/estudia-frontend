import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import { Folder } from '@/app/types';

const createFolder = async (newFolder: { name: string; color: string; topicId: string; parentId?: string }): Promise<Folder> => {
  const { data } = await api.post('/folders', newFolder);
  return data;
};

export const useCreateFolder = () => {
  const queryClient = useQueryClient();
  return useMutation<Folder, Error, { name: string; color: string; topicId: string; parentId?: string }>({
    mutationFn: createFolder,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['folders'] });
      queryClient.invalidateQueries({ queryKey: ['items'] });
    },
  });
};

const updateFolder = async ({ id, name, color }: { id: string; name: string; color: string }): Promise<Folder> => {
  const { data } = await api.put(`/folders/${id}`, { name, color });
  return data;
};

export const useUpdateFolder = () => {
  const queryClient = useQueryClient();
  return useMutation<Folder, Error, { id: string; name: string; color: string }>({
    mutationFn: updateFolder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['folders'] });
      queryClient.invalidateQueries({ queryKey: ['items'] });
    },
  });
};

const deleteFolder = async (id: string): Promise<void> => {
  await api.delete(`/folders/${id}`);
};

export const useDeleteFolder = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, string>({
    mutationFn: deleteFolder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['folders'] });
      queryClient.invalidateQueries({ queryKey: ['items'] });
    },
  });
};
