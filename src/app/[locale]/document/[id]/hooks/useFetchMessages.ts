import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import { Message } from '@/app/types';

const fetchMessages = async (
  documentId: string,
  conversationId: string,
): Promise<Message[]> => {
  const { data } = await api.get(`/documents/${documentId}/conversations/${conversationId}/messages`);
  return data;
};

export const useFetchMessages = (documentId: string, conversationId: string | null) => {
  return useQuery<Message[], Error>({
    queryKey: ['messages', documentId, conversationId],
    queryFn: () => fetchMessages(documentId, conversationId as string),
    enabled: !!conversationId,
  });
};
