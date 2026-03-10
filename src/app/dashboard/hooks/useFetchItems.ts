import { useInfiniteQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Document, Folder } from '@/app/types';

interface PaginatedItems {
  data: (Document | Folder)[];
  total: number;
  page: number;
  limit: number;
}

const fetchItems = async ({ 
  pageParam = 1, 
  topicId, 
  folderId, 
  search 
}: { 
  pageParam?: number, 
  topicId?: string, 
  folderId?: string | null, 
  search?: string 
}): Promise<PaginatedItems> => {
  let url = `${process.env.NEXT_PUBLIC_API_URL}/documents/items?page=${pageParam}&limit=12`;
  if (topicId) url += `&topicId=${topicId}`;
  if (folderId) url += `&folderId=${folderId}`;
  if (search) url += `&search=${encodeURIComponent(search)}`;
  
  const { data } = await axios.get(url, { withCredentials: true });
  return data;
};

export const useFetchItems = (topicId?: string, search?: string, folderId?: string | null) => {
  return useInfiniteQuery<PaginatedItems, Error>({
    queryKey: ['items', topicId, folderId, search],
    queryFn: ({ pageParam }) => fetchItems({ pageParam: pageParam as number, topicId, folderId, search }),
    getNextPageParam: (lastPage) => {
      const totalPages = Math.ceil(lastPage.total / lastPage.limit);
      return lastPage.page < totalPages ? lastPage.page + 1 : undefined;
    },
    initialPageParam: 1,
  });
};
