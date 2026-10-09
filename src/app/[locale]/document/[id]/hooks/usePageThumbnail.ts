import { useEffect, useRef, useState } from "react";
import type { PdfDocument } from "@/app/[locale]/document/[id]/lib/pdf-document";
import { getPageThumbnail } from "@/app/[locale]/document/[id]/lib/page-thumbnails";

// Renders a page's thumbnail once its element comes near the visible part of the sidebar.
export const usePageThumbnail = (pdf: PdfDocument, pageNumber: number) => {
  const ref = useRef<HTMLButtonElement>(null);
  const [isNear, setIsNear] = useState(false);
  const [src, setSrc] = useState<string | null>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element || isNear) return;
    const observer = new IntersectionObserver(
      ([entry]) => entry.isIntersecting && setIsNear(true),
      { rootMargin: "300px 0px" }
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [isNear]);

  useEffect(() => {
    if (!isNear) return;
    let active = true;
    getPageThumbnail(pdf, pageNumber)
      .then((url) => active && setSrc(url))
      .catch((error) => console.error(`Failed to render thumbnail of page ${pageNumber}`, error));
    return () => {
      active = false;
    };
  }, [isNear, pdf, pageNumber]);

  return { ref, src };
};
