import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt: string;
}

const fetchMessages = async (documentId: string): Promise<Message[]> => {
  const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/documents/${documentId}/messages`, { withCredentials: true });
  return data;
};

const createMessage = async ({ documentId, role, content }: { documentId: string; role: 'user' | 'assistant'; content: string }): Promise<Message> => {
  const { data } = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/documents/${documentId}/messages`, { role, content }, { withCredentials: true });
  return data;
};

export const useMessages = (documentId: string) => {
  const queryClient = useQueryClient();

  const { data: messages = [], isLoading, isError } = useQuery<Message[]>({ 
    queryKey: ['messages', documentId], 
    queryFn: () => fetchMessages(documentId) 
  });

  const mutation = useMutation<Message, Error, { role: 'user' | 'assistant'; content: string }>({ 
    mutationFn: (newMessage) => createMessage({ documentId, ...newMessage }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages', documentId] });
    }
  });

  return {
    messages,
    isLoading,
    isError,
    createMessage: mutation.mutate,
  };
};
