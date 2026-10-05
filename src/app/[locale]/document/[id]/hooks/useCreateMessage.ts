import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import { Message } from '@/app/types';

interface CreateMessageInput {
  conversationId: string;
  role: 'user' | 'assistant';
  content: string;
}

const createMessage = async (
  documentId: string,
  { conversationId, role, content }: CreateMessageInput
): Promise<Message> => {
  const { data } = await api.post(
    `/documents/${documentId}/conversations/${conversationId}/messages`,
    { role, content }
  );
  return data;
};

// The conversation is part of each call so a reply can't be saved into a conversation the user switched to mid-stream.
export const useCreateMessage = (documentId: string) => {
  const queryClient = useQueryClient();
  return useMutation<Message, Error, CreateMessageInput>({
    mutationFn: (input) => createMessage(documentId, input),
    onSuccess: (_, { conversationId }) => {
      queryClient.invalidateQueries({
        queryKey: ['messages', documentId, conversationId],
      });
    },
  });
};
