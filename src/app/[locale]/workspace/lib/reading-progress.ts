import type { Document } from "@/app/types";

export interface ReadingProgress {
  lastPage: number;
  pageCount: number;
  // Share of the document reached, from the furthest page (0 to 1).
  ratio: number;
}

// Null until the document has been read, or when its page count is unknown.
export const getReadingProgress = ({
  lastPage,
  furthestPage,
  pageCount,
}: Pick<Document, "lastPage" | "furthestPage" | "pageCount">): ReadingProgress | null => {
  if (!lastPage || !furthestPage || !pageCount) return null;
  return { lastPage, pageCount, ratio: Math.min(1, furthestPage / pageCount) };
};

const isUnfinished = (progress: ReadingProgress | null): progress is ReadingProgress =>
  progress !== null && progress.lastPage < progress.pageCount;

// The most recently opened document the user is still partway through.
export const findDocumentToContinue = (documents: Document[]): Document | null =>
  [...documents]
    .filter((doc) => doc.lastAccessedAt && isUnfinished(getReadingProgress(doc)))
    .sort((a, b) => new Date(b.lastAccessedAt!).getTime() - new Date(a.lastAccessedAt!).getTime())[0] ?? null;
