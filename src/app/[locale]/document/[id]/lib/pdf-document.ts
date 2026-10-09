import type { PdfLoaderProps } from "react-pdf-highlighter-extended";

// pdf.js's PDFDocumentProxy, taken from the viewer: pdfjs-dist comes with it and isn't importable directly.
export type PdfDocument = Parameters<PdfLoaderProps["children"]>[0];
