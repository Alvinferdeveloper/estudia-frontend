
import { Document as PDFDocument, Page } from 'react-pdf';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload } from 'lucide-react';

interface PdfViewerProps {
    publicUrl: string | null;
    pageNumber: number;
    scale: number;
    onDocumentLoadSuccess: ({ numPages }: { numPages: number }) => void;
    onTextSelection: () => void;
}

export const PdfViewer: React.FC<PdfViewerProps> = ({ publicUrl, pageNumber, scale, onDocumentLoadSuccess, onTextSelection }) => (
    <div className="flex-1 overflow-auto bg-muted/30 p-8">
        <div className="flex justify-center">
            {publicUrl ? (
                <div onMouseUp={onTextSelection} className="shadow-2xl rounded-lg overflow-hidden bg-white">
                    <PDFDocument file={publicUrl} onLoadSuccess={onDocumentLoadSuccess} className="max-w-none">
                        <Page pageNumber={pageNumber} scale={scale} renderAnnotationLayer={true} renderTextLayer={true} />
                    </PDFDocument>
                </div>
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
