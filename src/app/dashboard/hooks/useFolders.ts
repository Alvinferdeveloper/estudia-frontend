import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { Folder } from '@/app/types';

const fetchFolders = async (topicId?: string): Promise<Folder[]> => {
  const params = topicId ? { topicId } : {};
  const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/folders`, { 
    params,
    withCredentials: true 
  });
  return data;
};

const fetchRootFolders = async (topicId: string): Promise<Folder[]> => {
  const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/folders/root/${topicId}`, { withCredentials: true });
  return data;
};

export const useFetchFolders = (topicId?: string) => {
  return useQuery<Folder[], Error>({
    queryKey: ['folders', topicId],
    queryFn: () => fetchFolders(topicId),
  });
};

export const useFetchRootFolders = (topicId: string | null | undefined) => {
  return useQuery<Folder[], Error>({
    queryKey: ['folders', 'root', topicId],
    queryFn: () => topicId ? fetchRootFolders(topicId) : Promise.resolve([]),
    enabled: !!topicId,
  });
};

const fetchAllFolders = async (topicId: string | null): Promise<Folder[]> => {
  if (!topicId) return [];
  const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/folders`, { 
    params: { topicId },
    withCredentials: true 
  });
  return data;
};

export const useFetchAllFolders = (topicId: string | null | undefined) => {
  return useQuery<Folder[], Error>({
    queryKey: ['folders', 'all', topicId],
    queryFn: () => fetchAllFolders(topicId || null),
    enabled: !!topicId,
  });
};

const createFolder = async (newFolder: { name: string; color: string; topicId: string; parentId?: string }): Promise<Folder> => {
  const { data } = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/folders`, newFolder, { withCredentials: true });
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
  const { data } = await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/folders/${id}`, { name, color }, { withCredentials: true });
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
  await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/folders/${id}`, { withCredentials: true });
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
