import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Document } from '@/app/types';

const fetchRecent = async (search?: string): Promise<Document[]> => {
  let url = `${process.env.NEXT_PUBLIC_API_URL}/documents/recent?limit=20`;
  if (search) url += `&search=${encodeURIComponent(search)}`;
  const { data } = await axios.get(url, { withCredentials: true });
  return data;
};

export const useFetchRecentDocuments = (search?: string, enabled = true) => {
  return useQuery<Document[], Error>({
    queryKey: ['recent-documents', search],
    queryFn: () => fetchRecent(search),
    enabled,
  });
};
