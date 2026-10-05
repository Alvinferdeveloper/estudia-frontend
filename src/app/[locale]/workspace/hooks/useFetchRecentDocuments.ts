import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import { Document } from '@/app/types';

const fetchRecent = async (search?: string): Promise<Document[]> => {
  let url = '/documents/recent?limit=20';
  if (search) url += `&search=${encodeURIComponent(search)}`;
  const { data } = await api.get(url);
  return data;
};

export const useFetchRecentDocuments = (search?: string, enabled = true) => {
  return useQuery<Document[], Error>({
    queryKey: ['recent-documents', search],
    queryFn: () => fetchRecent(search),
    enabled,
  });
};
