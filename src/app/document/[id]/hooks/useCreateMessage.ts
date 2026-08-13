import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { Message } from '@/app/types';

const createMessage = async ({
  documentId,
  conversationId,
  role,
  content,
}: {
  documentId: string;
  conversationId: string;
  role: 'user' | 'assistant';
  content: string;
}): Promise<Message> => {
  const { data } = await axios.post(
    `${process.env.NEXT_PUBLIC_API_URL}/documents/${documentId}/conversations/${conversationId}/messages`,
    { role, content },
    { withCredentials: true }
  );
  return data;
};

export const useCreateMessage = (documentId: string, conversationId: string | null) => {
  const queryClient = useQueryClient();
  return useMutation<Message, Error, {
    role: 'user' | 'assistant';
    content: string;
  }>({
    mutationFn: (newMessage) =>
      createMessage({ documentId, conversationId: conversationId as string, ...newMessage }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['messages', documentId, conversationId],
      });
    },
  });
};
