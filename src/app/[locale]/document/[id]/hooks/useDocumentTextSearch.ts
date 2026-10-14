import { useEffect, useMemo, useRef, useState } from "react";
import type { PdfDocument } from "@/app/[locale]/document/[id]/lib/pdf-document";
import {
  buildSnippet,
  findMatches,
  normalizeQuery,
  normalizeWithMap,
  type NormalizedText,
  type Snippet,
} from "@/app/[locale]/document/[id]/lib/text-search";

// Pages read per round, so a long document stays responsive while it's scanned.
const PAGES_PER_BATCH = 8;

interface PageText {
  pageNumber: number;
  source: string;
  normalized: NormalizedText;
}

export interface TextSearchResult {
  id: string;
  pageNumber: number;
  // Which match this is on its page, to find it again in the page's text layer.
  occurrence: number;
  snippet: Snippet;
}

const readPageText = async (pdf: PdfDocument, pageNumber: number): Promise<PageText> => {
  try {
    const page = await pdf.getPage(pageNumber);
    const { items } = await page.getTextContent();
    // Same shape as the text layer pdf.js draws: one piece per item, a break after each line.
    const source = items.map((item) => ("str" in item ? item.str + (item.hasEOL ? " " : "") : "")).join("");
    return { pageNumber, source, normalized: normalizeWithMap(source) };
  } catch {
    return { pageNumber, source: "", normalized: normalizeWithMap("") };
  }
};

// Exact search over every page, not only the rendered ones. The text is read on the first search and kept while the document is open.
export const useDocumentTextSearch = (pdf: PdfDocument | null, query: string) => {
  const [pages, setPages] = useState<PageText[]>([]);
  // Identifies the scan in progress; a stale scan (another document) stops on its next batch.
  const scanIdRef = useRef(0);
  const scanStartedRef = useRef(false);
  const needle = normalizeQuery(query);
  const hasQuery = needle.length > 0;

  useEffect(() => {
    setPages([]);
    scanStartedRef.current = false;
    scanIdRef.current += 1;
  }, [pdf]);

  useEffect(() => {
    if (!pdf || !hasQuery || scanStartedRef.current) return;
    scanStartedRef.current = true;
    const scanId = scanIdRef.current;
    const scannedDocument = pdf;
    void (async () => {
      for (let first = 1; first <= scannedDocument.numPages; first += PAGES_PER_BATCH) {
        const last = Math.min(scannedDocument.numPages, first + PAGES_PER_BATCH - 1);
        const numbers = Array.from({ length: last - first + 1 }, (_, index) => first + index);
        const batch = await Promise.all(numbers.map((pageNumber) => readPageText(scannedDocument, pageNumber)));
        if (scanIdRef.current !== scanId) return;
        setPages((prev) => [...prev, ...batch]);
      }
    })();
  }, [pdf, hasQuery]);

  const results = useMemo<TextSearchResult[]>(
    () =>
      pages.flatMap((page) =>
        findMatches(page.normalized, needle).map((match, occurrence) => ({
          id: `${page.pageNumber}:${match.start}`,
          pageNumber: page.pageNumber,
          occurrence,
          snippet: buildSnippet(page.source, match),
        }))
      ),
    [pages, needle]
  );

  return {
    results,
    scannedPages: pages.length,
    totalPages: pdf?.numPages ?? 0,
  };
};
