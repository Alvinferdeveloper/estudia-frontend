import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { Message } from '@/app/types';

const createMessage = async ({ documentId, role, content }: { documentId: string; role: 'user' | 'assistant'; content: string }): Promise<Message> => {
  const { data } = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/documents/${documentId}/messages`, { role, content }, { withCredentials: true });
  return data;
};

export const useCreateMessage = (documentId: string) => {
  const queryClient = useQueryClient();
  return useMutation<Message, Error, { role: 'user' | 'assistant'; content: string }>({
    mutationFn: (newMessage) => createMessage({ documentId, ...newMessage }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages', documentId] });
    },
  });
};
