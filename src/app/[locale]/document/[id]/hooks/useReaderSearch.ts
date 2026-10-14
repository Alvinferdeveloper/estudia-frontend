import { useState } from "react";
import { useDebounce } from "@/app/hooks/useDebounce";
import type { PdfDocument } from "@/app/[locale]/document/[id]/lib/pdf-document";
import { useDocumentTextSearch } from "@/app/[locale]/document/[id]/hooks/useDocumentTextSearch";
import { useSemanticSearch } from "@/app/[locale]/document/[id]/hooks/useSemanticSearch";
import type { DocumentIndexing } from "@/app/[locale]/document/[id]/hooks/useDocumentIndexing";

export type SearchMode = "exact" | "semantic";

const EXACT_SEARCH_DELAY_MS = 200;

// Search state for the reader, kept here (not in the sidebar) so it survives closing the sidebar.
export const useReaderSearch = (documentId: string, pdf: PdfDocument | null, indexing: DocumentIndexing) => {
  const [mode, setMode] = useState<SearchMode>("exact");
  const [query, setQuery] = useState("");
  const [submittedQuery, setSubmittedQuery] = useState("");
  const [activeResultId, setActiveResultId] = useState<string | null>(null);

  const exactQuery = useDebounce(mode === "exact" ? query : "", EXACT_SEARCH_DELAY_MS);
  const text = useDocumentTextSearch(pdf, exactQuery);
  const semantic = useSemanticSearch(documentId, mode === "semantic" ? submittedQuery : "", indexing.isReady);

  return {
    mode,
    setMode: (next: SearchMode) => {
      setMode(next);
      setActiveResultId(null);
    },
    query,
    setQuery: (next: string) => {
      setQuery(next);
      setActiveResultId(null);
    },
    exactQuery,
    submitSemantic: () => setSubmittedQuery(query.trim()),
    submittedQuery,
    activeResultId,
    setActiveResultId,
    text,
    semantic,
    indexing,
  };
};

export type ReaderSearch = ReturnType<typeof useReaderSearch>;
