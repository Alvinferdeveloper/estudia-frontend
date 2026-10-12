import { useEffect, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { apiUrl } from "@/lib/api-client";

const SAVE_DELAY_MS = 1500;

// keepalive lets the last save finish while the tab is closing, which axios can't do.
const saveProgress = (documentId: string, page: number) =>
  fetch(apiUrl(`/documents/${documentId}/progress`), {
    method: "PATCH",
    credentials: "include",
    keepalive: true,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ page }),
  }).catch(() => {
    // Progress is best effort: a missed save only means resuming a little earlier.
  });

interface UseReadingProgressOptions {
  documentId: string;
  currentPage: number;
  // Off until the reader has restored the last page, so the initial page 1 never overwrites it.
  enabled: boolean;
}

// Saves the page being read, debounced while scrolling and flushed when the tab is hidden or the reader closes.
export const useReadingProgress = ({ documentId, currentPage, enabled }: UseReadingProgressOptions) => {
  const queryClient = useQueryClient();
  const savedPageRef = useRef<number | null>(null);
  const pendingPageRef = useRef<number | null>(null);

  useEffect(() => {
    if (!enabled || currentPage === savedPageRef.current) return;
    pendingPageRef.current = currentPage;
    const timeout = setTimeout(() => {
      savedPageRef.current = currentPage;
      pendingPageRef.current = null;
      void saveProgress(documentId, currentPage);
    }, SAVE_DELAY_MS);
    return () => clearTimeout(timeout);
  }, [documentId, currentPage, enabled]);

  useEffect(() => {
    const flush = async () => {
      const page = pendingPageRef.current;
      if (page === null) return;
      savedPageRef.current = page;
      pendingPageRef.current = null;
      await saveProgress(documentId, page);
    };
    const flushWhenHidden = () => {
      if (document.visibilityState === "hidden") void flush();
    };

    document.addEventListener("visibilitychange", flushWhenHidden);
    return () => {
      document.removeEventListener("visibilitychange", flushWhenHidden);
      // The workspace shows progress; refetch it once the last page is saved.
      void flush().then(() => {
        void queryClient.invalidateQueries({ queryKey: ["items"] });
        void queryClient.invalidateQueries({ queryKey: ["recent-documents"] });
      });
    };
  }, [documentId, queryClient]);
};
