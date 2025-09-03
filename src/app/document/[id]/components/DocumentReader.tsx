"use client";

import { useState } from "react";
import { Document as PDFDocument, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';



// Set up PDF.js worker source
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString();

interface DocumentClientProps {
  document: any; // Replace with actual Document type
}

export const DocumentClient: React.FC<DocumentClientProps> = ({ document }) => {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState<number>(1);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
    setPageNumber(1);
  }

  const handleTextSelection = () => {
    const selection = window.getSelection();
    if (selection && selection.toString().length > 0) {
      console.log("Selected Text:", selection.toString());
      // Future: Send this text to LLM
    }
  };

  return (
    <div className="flex flex-col items-center p-4">
      <h1 className="text-2xl font-bold mb-4">{document.fileName}</h1>
      <div className="mb-4">
        <p>Page {pageNumber || (numPages ? 1 : '--')} of {numPages || '--'}</p>
        <button
          disabled={pageNumber <= 1}
          onClick={() => setPageNumber(prevPageNumber => prevPageNumber - 1)}
          className="px-4 py-2 mr-2 bg-blue-500 text-white rounded"
        >
          Previous
        </button>
        <button
          disabled={pageNumber >= (numPages || 0)}
          onClick={() => setPageNumber(prevPageNumber => prevPageNumber + 1)}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Next
        </button>
      </div>
      <div onMouseUp={handleTextSelection} className="border border-gray-300 shadow-lg">
        <PDFDocument
          file={document.publicUrl}
          onLoadSuccess={onDocumentLoadSuccess}
        >
          <Page pageNumber={pageNumber} renderAnnotationLayer={true} renderTextLayer={true} />
        </PDFDocument>
      </div>
    </div>
  );
};
