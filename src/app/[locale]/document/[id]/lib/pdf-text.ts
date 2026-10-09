import type { PdfDocument } from "@/app/[locale]/document/[id]/lib/pdf-document";

// Text of the given pages, each under a "--- Page n ---" marker. Unreadable pages are skipped.
export const extractPagesText = async (pdf: PdfDocument, pages: number[]): Promise<string> => {
  const sections = await Promise.all(
    pages.map(async (pageNumber) => {
      try {
        const page = await pdf.getPage(pageNumber);
        const { items } = await page.getTextContent();
        return `--- Page ${pageNumber} ---\n${items.map((item) => ("str" in item ? item.str : "")).join(" ")}`;
      } catch (error) {
        console.error(`Failed to extract text from page ${pageNumber}`, error);
        return "";
      }
    })
  );
  return sections.filter(Boolean).join("\n\n");
};
