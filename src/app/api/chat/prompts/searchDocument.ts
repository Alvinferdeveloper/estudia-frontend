import { fetchWithAuth } from '@/app/api/utils/fetchWithAuth';
import { SearchResult } from '@/app/api/chat/prompts/types';

export async function searchDocumentChunks(
  documentId: string,
  query: string,
  limit: number = 3
): Promise<SearchResult[]> {
  try {
    const data = await fetchWithAuth(
      `${process.env.NEXT_PUBLIC_API_URL}/documents/${documentId}/search?q=${encodeURIComponent(query)}&limit=${limit}`
    );
    return data.results ?? [];
  } catch (error) {
    console.error('RAG search error:', error);
    return [];
  }
}

export function getLastUserQuery(messages: any[]): string | null {
  const lastUserMessage = messages
    .filter((m) => m.role === 'user')
    .pop();

  return lastUserMessage?.parts?.find((p: any) => p.type === 'text')?.text ?? null;
}
