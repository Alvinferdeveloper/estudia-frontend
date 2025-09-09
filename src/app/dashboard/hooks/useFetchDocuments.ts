import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Document } from '@/app/types';

const fetchDocuments = async (topicId?: string): Promise<Document[]> => {
  const url = topicId
    ? `http://localhost:3001/documents?topicId=${topicId}`
    : `http://localhost:3001/documents`;
  const { data } = await axios.get(url, { withCredentials: true });
  return data;
};

export const useFetchDocuments = (topicId?: string) => {
  return useQuery<Document[], Error>({
    queryKey: ['documents', topicId],
    queryFn: () => fetchDocuments(topicId),
  });
};
