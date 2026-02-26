import { useInfiniteQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Document } from '@/app/types';

interface PaginatedDocuments {
  data: Document[];
  total: number;
  page: number;
  limit: number;
}

const fetchDocuments = async ({ pageParam = 1, topicId, search }: { pageParam?: number, topicId?: string, search?: string }): Promise<PaginatedDocuments> => {
  let url = `${process.env.NEXT_PUBLIC_API_URL}/documents?page=${pageParam}&limit=12`;
  if (topicId) url += `&topicId=${topicId}`;
  if (search) url += `&search=${encodeURIComponent(search)}`;
  
  const { data } = await axios.get(url, { withCredentials: true });
  return data;
};

export const useFetchDocuments = (topicId?: string, search?: string) => {
  return useInfiniteQuery<PaginatedDocuments, Error>({
    queryKey: ['documents', topicId, search],
    queryFn: ({ pageParam }) => fetchDocuments({ pageParam: pageParam as number, topicId, search }),
    getNextPageParam: (lastPage) => {
      const totalPages = Math.ceil(lastPage.total / lastPage.limit);
      return lastPage.page < totalPages ? lastPage.page + 1 : undefined;
    },
    initialPageParam: 1,
  });
};
