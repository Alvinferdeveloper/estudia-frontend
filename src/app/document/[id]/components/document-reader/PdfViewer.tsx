import { Document as PDFDocument, Page } from 'react-pdf';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload } from 'lucide-react';
import { useState } from 'react';
import { usePdfVirtualization } from '@/app/document/[id]/hooks/usePdfVirtualization';

interface PdfViewerProps {
    publicUrl: string | null;
    scale: number;
    onDocumentLoadSuccess: ({ numPages }: { numPages: number }) => void;
    onTextSelection: () => void;
    onPageChange: (page: number) => void;
}

export const PdfViewer: React.FC<PdfViewerProps> = ({
    publicUrl,
    scale,
    onDocumentLoadSuccess,
    onTextSelection,
    onPageChange
}) => {
    const [numPages, setNumPages] = useState<number>(0);

    // Use custom hook for virtualization logic
    const { visiblePages, containerRef, setPageRef } = usePdfVirtualization({
        numPages,
        onPageChange
    });

    const handleDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
        setNumPages(numPages);
        onDocumentLoadSuccess({ numPages });
    };

    return (
        <div
            ref={containerRef}
            className="flex-1 overflow-auto bg-muted/30 p-8"
        >
            <div className="flex flex-col items-center gap-4">
                {publicUrl ? (
                    <PDFDocument
                        file={publicUrl}
                        onLoadSuccess={handleDocumentLoadSuccess}
                        className="max-w-none"
                    >
                        {Array.from({ length: numPages }, (_, i) => i + 1).map((pageNum) => (
                            <div
                                key={pageNum}
                                ref={setPageRef(pageNum)}
                                data-page-number={pageNum}
                                className="mb-4 shadow-2xl rounded-lg overflow-hidden bg-white"
                                style={{
                                    minHeight: visiblePages.has(pageNum) ? 'auto' : '1056px', // A4 height at 1.2 scale
                                }}
                                onMouseUp={onTextSelection}
                            >
                                {visiblePages.has(pageNum) ? (
                                    <Page
                                        pageNumber={pageNum}
                                        scale={scale}
                                        renderAnnotationLayer={true}
                                        renderTextLayer={true}
                                        loading={
                                            <div className="flex items-center justify-center h-[1056px] bg-gray-100">
                                                <div className="text-muted-foreground">Loading page {pageNum}...</div>
                                            </div>
                                        }
                                    />
                                ) : (
                                    <div className="flex items-center justify-center h-[1056px] bg-gray-50">
                                        <div className="text-muted-foreground text-sm">Page {pageNum}</div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </PDFDocument>
                ) : (
                    <Card className="p-12 text-center max-w-md">
                        <div className="space-y-4">
                            <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center">
                                <Upload className="h-8 w-8 text-muted-foreground" />
                            </div>
                            <div>
                                <h3 className="font-serif font-semibold text-lg mb-2">Upload your PDF</h3>
                                <p className="text-muted-foreground text-sm mb-4">
                                    Drag and drop your PDF here or click to select a file
                                </p>
                                <Button asChild>
                                    <label htmlFor="pdf-upload" className="cursor-pointer">
                                        Select File
                                    </label>
                                </Button>
                            </div>
                        </div>
                    </Card>
                )}
            </div>
        </div>
    );
};
