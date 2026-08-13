import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Message } from '@/app/types';

const fetchMessages = async (
  documentId: string,
  conversationId: string,
): Promise<Message[]> => {
  const { data } = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/documents/${documentId}/conversations/${conversationId}/messages`,
    { withCredentials: true },
  );
  return data;
};

export const useFetchMessages = (documentId: string, conversationId: string | null) => {
  return useQuery<Message[], Error>({
    queryKey: ['messages', documentId, conversationId],
    queryFn: () => fetchMessages(documentId, conversationId as string),
    enabled: !!conversationId,
  });
};
