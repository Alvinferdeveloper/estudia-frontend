export interface ChatRequestBody {
  messages: any[];
  documentId?: string;
  documentName?: string;
}

export interface SearchResult {
  content: string;
  pageNumber: number;
  similarity: number;
}

export interface RagContext {
  chunks: SearchResult[];
  documentName: string;
}
