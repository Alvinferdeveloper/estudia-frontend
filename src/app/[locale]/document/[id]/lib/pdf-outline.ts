import type { PdfDocument } from "@/app/[locale]/document/[id]/lib/pdf-document";

type RawOutline = NonNullable<Awaited<ReturnType<PdfDocument["getOutline"]>>>;
type RawOutlineItem = RawOutline[number];
type PageRef = Parameters<PdfDocument["getPageIndex"]>[0];

// pdf.js explicit destination: [page reference or index, { name: "XYZ" | "Fit" | ... }, ...coordinates].
export type PdfDestination = unknown[];

export interface OutlineItem {
  // Position in the tree ("0", "0.2", "0.2.1"), so an item's ancestors are its id's prefixes.
  id: string;
  title: string;
  pageNumber: number;
  destination: PdfDestination;
  children: OutlineItem[];
}

const resolveDestination = async (pdf: PdfDocument, dest: RawOutlineItem["dest"]): Promise<PdfDestination | null> => {
  if (!dest) return null;
  const explicit = typeof dest === "string" ? await pdf.getDestination(dest) : dest;
  return Array.isArray(explicit) && explicit.length > 0 ? explicit : null;
};

const resolvePageNumber = async (pdf: PdfDocument, [target]: PdfDestination): Promise<number | null> => {
  if (typeof target === "number") return target + 1;
  if (target && typeof target === "object") return (await pdf.getPageIndex(target as PageRef)) + 1;
  return null;
};

// Entries without a page in the document (external links, broken destinations) are dropped; their children move up.
const resolveItems = async (pdf: PdfDocument, items: RawOutlineItem[], path: string): Promise<OutlineItem[]> => {
  const resolved = await Promise.all(
    items.map(async (item, index): Promise<OutlineItem | OutlineItem[]> => {
      const id = `${path}${index}`;
      const children = await resolveItems(pdf, item.items ?? [], `${id}.`);
      try {
        const destination = await resolveDestination(pdf, item.dest);
        const pageNumber = destination && (await resolvePageNumber(pdf, destination));
        if (destination && pageNumber) return { id, title: item.title.trim(), pageNumber, destination, children };
      } catch {
        // A destination pdf.js can't resolve; keep whatever lies beneath it.
      }
      return children;
    })
  );
  return resolved.flat();
};

export const loadOutline = async (pdf: PdfDocument): Promise<OutlineItem[]> => {
  try {
    const outline = await pdf.getOutline();
    return outline ? await resolveItems(pdf, outline, "") : [];
  } catch {
    return [];
  }
};

const flatten = (items: OutlineItem[]): OutlineItem[] => items.flatMap((item) => [item, ...flatten(item.children)]);

export const countOutlineEntries = (items: OutlineItem[]): number => flatten(items).length;

// The section being read: the last entry, in document order, that starts on or before the current page.
export const findCurrentSectionId = (items: OutlineItem[], currentPage: number): string | null =>
  flatten(items).reduce<string | null>((current, item) => (item.pageNumber <= currentPage ? item.id : current), null);

export const ancestorIds = (id: string): string[] =>
  id
    .split(".")
    .slice(0, -1)
    .map((_, index, parts) => parts.slice(0, index + 1).join("."));
