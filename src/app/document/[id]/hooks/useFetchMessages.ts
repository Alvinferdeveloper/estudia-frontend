import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Message } from '@/app/types';

const fetchMessages = async (documentId: string): Promise<Message[]> => {
  const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/documents/${documentId}/messages`, { withCredentials: true });
  return data;
};

export const useFetchMessages = (documentId: string) => {
  return useQuery<Message[], Error>({
    queryKey: ['messages', documentId],
    queryFn: () => fetchMessages(documentId),
  });
};
