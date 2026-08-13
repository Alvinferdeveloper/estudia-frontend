import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { Conversation } from '@/app/types';

const BASE = process.env.NEXT_PUBLIC_API_URL;

export const useConversations = (documentId: string) => {
  const queryClient = useQueryClient();

  const list = useQuery<Conversation[], Error>({
    queryKey: ['conversations', documentId],
    queryFn: async () => {
      const { data } = await axios.get(
        `${BASE}/documents/${documentId}/conversations`,
        { withCredentials: true },
      );
      return data;
    },
    enabled: !!documentId,
  });

  const create = useMutation<Conversation, Error, { title?: string }>({
    mutationFn: async ({ title } = {}) => {
      const { data } = await axios.post(
        `${BASE}/documents/${documentId}/conversations`,
        { title },
        { withCredentials: true },
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['conversations', documentId] });
    },
  });

  const rename = useMutation<Conversation, Error, { id: string; title: string }>({
    mutationFn: async ({ id, title }) => {
      const { data } = await axios.patch(
        `${BASE}/documents/${documentId}/conversations/${id}`,
        { title },
        { withCredentials: true },
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['conversations', documentId] });
    },
  });

  const remove = useMutation<void, Error, string>({
    mutationFn: async (id) => {
      await axios.delete(
        `${BASE}/documents/${documentId}/conversations/${id}`,
        { withCredentials: true },
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['conversations', documentId] });
    },
  });

  return { list, create, rename, remove };
};
