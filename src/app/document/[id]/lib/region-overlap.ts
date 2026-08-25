import { DocumentImageRef } from "../hooks/useDocumentImages";

export interface PdfRect {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

const OVERLAP_THRESHOLD = 0.5;

const rectArea = (r: PdfRect) =>
  Math.max(0, r.x2 - r.x1) * Math.max(0, r.y2 - r.y1);

const intersectionArea = (a: PdfRect, b: PdfRect) => {
  const x1 = Math.max(a.x1, b.x1);
  const y1 = Math.max(a.y1, b.y1);
  const x2 = Math.min(a.x2, b.x2);
  const y2 = Math.min(a.y2, b.y2);
  return rectArea({ x1, y1, x2, y2 });
};

/**
 * Matches a freehand region selection against the document's known embedded
 * images. Overlap is measured against the smaller of the two rects, so both
 * "small selection fully inside a big image" and "selection roughly the
 * size of the image" count as a match. Both rects are expected in the same
 * PDF page-point coordinate space (pdf.js "scaled" position vs. PyMuPDF bbox).
 */
export const findOverlappingImage = (
  selection: PdfRect,
  pageNumber: number,
  documentImages: DocumentImageRef[]
): DocumentImageRef | undefined => {
  const selectionArea = rectArea(selection);
  if (selectionArea <= 0) return undefined;

  let best: { image: DocumentImageRef; ratio: number } | undefined;

  for (const img of documentImages) {
    if (img.pageNumber !== pageNumber) continue;

    const imgRect: PdfRect = {
      x1: img.bboxX0,
      y1: img.bboxY0,
      x2: img.bboxX1,
      y2: img.bboxY1,
    };
    const smallerArea = Math.min(selectionArea, rectArea(imgRect));
    if (smallerArea <= 0) continue;

    const ratio = intersectionArea(selection, imgRect) / smallerArea;
    if (ratio > OVERLAP_THRESHOLD && (!best || ratio > best.ratio)) {
      best = { image: img, ratio };
    }
  }

  return best?.image;
};
