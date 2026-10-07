// pdf.js document as exposed by the viewer; only the text API is used here.
interface PdfTextSource {
  getPage: (pageNumber: number) => Promise<{
    getTextContent: () => Promise<{ items: { str?: string }[] }>;
  }>;
}

// Text of the given pages, each under a "--- Page n ---" marker. Unreadable pages are skipped.
export const extractPagesText = async (pdf: PdfTextSource, pages: number[]): Promise<string> => {
  const sections = await Promise.all(
    pages.map(async (pageNumber) => {
      try {
        const page = await pdf.getPage(pageNumber);
        const { items } = await page.getTextContent();
        return `--- Page ${pageNumber} ---\n${items.map((item) => item.str ?? "").join(" ")}`;
      } catch (error) {
        console.error(`Failed to extract text from page ${pageNumber}`, error);
        return "";
      }
    })
  );
  return sections.filter(Boolean).join("\n\n");
};
