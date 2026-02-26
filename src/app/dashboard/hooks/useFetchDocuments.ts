import { useInfiniteQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Document } from '@/app/types';

interface PaginatedDocuments {
  data: Document[];
  total: number;
  page: number;
  limit: number;
}

const fetchDocuments = async ({ pageParam = 1, topicId }: { pageParam?: number, topicId?: string }): Promise<PaginatedDocuments> => {
  const url = topicId
    ? `${process.env.NEXT_PUBLIC_API_URL}/documents?topicId=${topicId}&page=${pageParam}&limit=12`
    : `${process.env.NEXT_PUBLIC_API_URL}/documents?page=${pageParam}&limit=12`;
  const { data } = await axios.get(url, { withCredentials: true });
  return data;
};

export const useFetchDocuments = (topicId?: string) => {
  return useInfiniteQuery<PaginatedDocuments, Error>({
    queryKey: ['documents', topicId],
    queryFn: ({ pageParam }) => fetchDocuments({ pageParam: pageParam as number, topicId }),
    getNextPageParam: (lastPage) => {
      const totalPages = Math.ceil(lastPage.total / lastPage.limit);
      return lastPage.page < totalPages ? lastPage.page + 1 : undefined;
    },
    initialPageParam: 1,
  });
};
