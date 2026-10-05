import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import { Topic } from '@/app/types';

const createTopic = async (newTopic: { name: string; color: string }): Promise<Topic> => {
  const { data } = await api.post('/topics', newTopic);
  return data;
};

export const useCreateTopic = () => {
  const queryClient = useQueryClient();
  return useMutation<Topic, Error, { name: string; color: string }>({
    mutationFn: createTopic,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['topics'] });
    },
  });
};
