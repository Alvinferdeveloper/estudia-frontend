import { useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import { getApiErrorKey, type ApiErrorKey } from "@/lib/api-errors";

const statusKey = (documentId: string) => ["vectorizeStatus", documentId] as const;

const fetchStatus = async (documentId: string): Promise<boolean> => {
  const { data } = await api.get<{ isVectorized: boolean }>(`/documents/${documentId}/vectorize-status`);
  return data.isVectorized;
};

export interface DocumentIndexing {
  // Ready for meaning-based search (and grounded chat answers).
  isReady: boolean;
  isIndexing: boolean;
  errorKey: ApiErrorKey | null;
}

// Indexes the document for semantic search the first time it's opened, in the background; the API skips
// documents already indexed and joins a run in progress, so this never pays twice.
export const useDocumentIndexing = (documentId: string): DocumentIndexing => {
  const queryClient = useQueryClient();
  const { data: isVectorized } = useQuery({
    queryKey: statusKey(documentId),
    queryFn: () => fetchStatus(documentId),
    staleTime: Infinity,
  });

  const { mutate, isPending, isIdle, error } = useMutation({
    mutationFn: () => api.post(`/documents/${documentId}/vectorize`, {}),
    onSuccess: () => queryClient.setQueryData(statusKey(documentId), true),
    // Background work: the search panel explains a failure when it matters, no toast.
    meta: { inlineError: true },
  });

  useEffect(() => {
    if (isVectorized === false && isIdle) mutate();
  }, [isVectorized, isIdle, mutate]);

  return {
    isReady: isVectorized === true,
    isIndexing: isPending || (isVectorized === false && isIdle),
    errorKey: error ? getApiErrorKey(error) : null,
  };
};
