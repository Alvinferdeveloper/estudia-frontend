import { useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import type { PdfDocument } from "@/app/[locale]/document/[id]/lib/pdf-document";
import { PageThumbnail } from "@/app/[locale]/document/[id]/components/document-reader/thumbnails/PageThumbnail";

interface PageThumbnailsProps {
  pdf: PdfDocument;
  currentPage: number;
  onPageClick: (pageNumber: number) => void;
  // Set only in exam mode, where a click also selects the page.
  selectedPages?: number[];
}

const focusSibling = (list: HTMLElement, from: Element, step: 1 | -1) => {
  const buttons = Array.from(list.querySelectorAll<HTMLButtonElement>("button[data-page]"));
  buttons[buttons.indexOf(from as HTMLButtonElement) + step]?.focus();
};

// Left sidebar with every page in small, like a desktop PDF viewer; follows the page being read.
export const PageThumbnails: React.FC<PageThumbnailsProps> = ({ pdf, currentPage, onPageClick, selectedPages }) => {
  const t = useTranslations("reader.thumbnails");
  const listRef = useRef<HTMLOListElement>(null);

  useEffect(() => {
    listRef.current
      ?.querySelector(`[data-page="${currentPage}"]`)
      ?.scrollIntoView({ block: "nearest" });
  }, [currentPage]);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLOListElement>) => {
    if (event.key !== "ArrowDown" && event.key !== "ArrowUp") return;
    event.preventDefault();
    focusSibling(event.currentTarget, event.target as Element, event.key === "ArrowDown" ? 1 : -1);
  };

  return (
    <nav
      aria-label={t("label")}
      className="w-36 shrink-0 overflow-y-auto border-r border-border bg-secondary animate-in fade-in slide-in-from-left-2 duration-200 ease-[var(--ease-out)]"
    >
      <ol ref={listRef} onKeyDown={handleKeyDown} className="space-y-1 p-2">
        {Array.from({ length: pdf.numPages }, (_, index) => index + 1).map((pageNumber) => (
          <li key={pageNumber}>
            <PageThumbnail
              pdf={pdf}
              pageNumber={pageNumber}
              isCurrent={pageNumber === currentPage}
              isSelected={selectedPages?.includes(pageNumber)}
              onClick={() => onPageClick(pageNumber)}
            />
          </li>
        ))}
      </ol>
    </nav>
  );
};
