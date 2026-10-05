import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import { Topic } from '@/app/types';

const fetchTopics = async (): Promise<Topic[]> => {
  const { data } = await api.get('/topics');
  return data;
};

export const useFetchTopics = () => {
  return useQuery<Topic[], Error>({
    queryKey: ['topics'],
    queryFn: fetchTopics,
  });
};
