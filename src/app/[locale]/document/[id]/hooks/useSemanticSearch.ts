import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api-client";

export interface SemanticPassage {
  content: string;
  pageNumber: number;
  similarity: number;
}

const RESULT_LIMIT = 8;

const searchByMeaning = async (documentId: string, query: string): Promise<SemanticPassage[]> => {
  const { data } = await api.get<{ results: SemanticPassage[] }>(`/documents/${documentId}/search`, {
    params: { q: query, limit: RESULT_LIMIT },
  });
  return data.results;
};

// Passages closest in meaning to the query. Runs only on submit, since each search embeds the query.
export const useSemanticSearch = (documentId: string, query: string, isIndexed: boolean) =>
  useQuery({
    queryKey: ["semanticSearch", documentId, query],
    queryFn: () => searchByMeaning(documentId, query),
    enabled: isIndexed && query.length > 0,
    staleTime: Infinity,
  });
