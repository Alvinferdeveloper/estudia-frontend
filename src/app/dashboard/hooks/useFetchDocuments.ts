import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Document } from '@/app/types';

const fetchDocuments = async (topicId?: string): Promise<Document[]> => {
  const url = topicId
    ? `${process.env.NEXT_PUBLIC_API_URL}/documents?topicId=${topicId}`
    : `${process.env.NEXT_PUBLIC_API_URL}/documents`;
  const { data } = await axios.get(url, { withCredentials: true });
  return data;
};

export const useFetchDocuments = (topicId?: string) => {
  return useQuery<Document[], Error>({
    queryKey: ['documents', topicId],
    queryFn: () => fetchDocuments(topicId),
  });
};
