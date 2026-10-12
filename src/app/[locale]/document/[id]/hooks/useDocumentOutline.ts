import { useEffect, useState } from "react";
import type { PdfDocument } from "@/app/[locale]/document/[id]/lib/pdf-document";
import { loadOutline, type OutlineItem } from "@/app/[locale]/document/[id]/lib/pdf-outline";

// The PDF's own table of contents, resolved to pages; empty while loading or when the document has none.
export const useDocumentOutline = (pdf: PdfDocument | null): OutlineItem[] => {
  const [outline, setOutline] = useState<OutlineItem[]>([]);

  useEffect(() => {
    setOutline([]);
    if (!pdf) return;
    let cancelled = false;
    loadOutline(pdf).then((items) => {
      if (!cancelled) setOutline(items);
    });
    return () => {
      cancelled = true;
    };
  }, [pdf]);

  return outline;
};
