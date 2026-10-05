import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import { Conversation } from '@/app/types';

export const useConversations = (documentId: string) => {
  const queryClient = useQueryClient();

  const list = useQuery<Conversation[], Error>({
    queryKey: ['conversations', documentId],
    queryFn: async () => {
      const { data } = await api.get(`/documents/${documentId}/conversations`);
      return data;
    },
    enabled: !!documentId,
  });

  const create = useMutation<Conversation, Error, { title?: string }>({
    mutationFn: async ({ title } = {}) => {
      const { data } = await api.post(`/documents/${documentId}/conversations`, { title });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['conversations', documentId] });
    },
    // Starting a chat shows its failure in the message list.
    meta: { inlineError: true },
  });

  const rename = useMutation<Conversation, Error, { id: string; title: string }>({
    mutationFn: async ({ id, title }) => {
      const { data } = await api.patch(`/documents/${documentId}/conversations/${id}`, { title });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['conversations', documentId] });
    },
  });

  const remove = useMutation<void, Error, string>({
    mutationFn: async (id) => {
      await api.delete(`/documents/${documentId}/conversations/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['conversations', documentId] });
    },
  });

  return { list, create, rename, remove };
};
