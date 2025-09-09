import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Topic } from '@/app/types';

const fetchTopics = async (): Promise<Topic[]> => {
  const { data } = await axios.get('http://localhost:3001/topics', { withCredentials: true });
  return data;
};

export const useFetchTopics = () => {
  return useQuery<Topic[], Error>({
    queryKey: ['topics'],
    queryFn: fetchTopics,
  });
};
