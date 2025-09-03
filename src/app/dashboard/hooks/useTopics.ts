import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

export interface Topic {
  id: string;
  name: string;
  color: string;
  count: number;
}

const fetchTopics = async (): Promise<Topic[]> => {
  const { data } = await axios.get('http://localhost:3001/topics', { withCredentials: true });
  return data;
};

const createTopic = async (newTopic: { name: string; color: string }): Promise<Topic> => {
  const { data } = await axios.post('http://localhost:3001/topics', newTopic, { withCredentials: true });
  return data;
};

export const useTopics = () => {
  const queryClient = useQueryClient();

  const { data: topics, isLoading, isError } = useQuery<Topic[]>({
    queryKey: ['topics'],
    queryFn: fetchTopics
  });

  const mutation = useMutation<Topic, Error, { name: string; color: string }>({
    mutationFn: createTopic,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['topics'] });
    }
  });

  return {
    topics,
    isLoading,
    isError,
    createTopic: mutation.mutate,
  };
};
