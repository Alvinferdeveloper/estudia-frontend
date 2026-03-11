import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { Topic } from '@/app/types';

const createTopic = async (newTopic: { name: string; color: string }): Promise<Topic> => {
  const { data } = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/topics`, newTopic, { withCredentials: true });
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
