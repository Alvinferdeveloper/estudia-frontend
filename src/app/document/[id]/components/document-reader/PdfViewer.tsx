"use client";

import { useRef, useMemo, useCallback, useEffect } from "react";
import { PdfLoader, PdfHighlighter, TextHighlight, useHighlightContainerContext, ViewportHighlight } from "react-pdf-highlighter-extended";
import "react-pdf-highlighter-extended/dist/esm/style/PdfHighlighter.css";
import "react-pdf-highlighter-extended/dist/esm/style/pdf_viewer.css";
import { Annotation } from "@/app/types";
import { usePdfPageOverlay } from "../../hooks/usePdfPageOverlay";

interface PdfViewerProps {
    publicUrl: string;
    scale: number;
    annotations: Annotation[];
    selectionTip: React.ReactNode;
    onTextSelection: (selection: { text: string; rects: { top: number; left: number; width: number; height: number; pageWidth?: number; pageHeight?: number }[]; pageNumber: number }) => void;
    onPageChange: (page: number) => void;
    onAnnotationClick: (annotation: Annotation) => void;
    setNumPages: (numPages: number) => void;
    examMode?: boolean;
    selectedPages?: number[];
    onPageSelect?: (page: number) => void;
}

interface SelectionEvent {
    content?: { text?: string };
    position?: {
        boundingRect: { x1: number; y1: number; x2: number; y2: number; width: number; height: number; pageNumber: number };
        rects?: Array<{ x1: number; y1: number; x2: number; y2: number; width: number; height: number }>;
    };
}

interface HighlightRect {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
    width: number;
    height: number;
}

const HighlightContainer = ({ onClick }: { onClick: (highlight: ViewportHighlight) => void }) => {
    const { highlight, isScrolledTo } = useHighlightContainerContext();
    const highlightWithColor = highlight as ViewportHighlight & { color?: string };

    return (
        <div onClick={() => onClick(highlight)}>
            <TextHighlight isScrolledTo={isScrolledTo} highlight={highlight} style={{ background: highlightWithColor.color }} />
        </div>
    );
};

export const PdfViewer: React.FC<PdfViewerProps> = ({
    publicUrl,
    annotations,
    scale,
    setNumPages,
    selectionTip,
    onPageChange,
    onTextSelection,
    onAnnotationClick,
    examMode = false,
    selectedPages = [],
    onPageSelect,
}) => {
    const utilsRef = useRef<any>(null);
    const numPagesRef = useRef<number | null>(null);
    const eventBusAttachedRef = useRef(false);
    const onPageChangeRef = useRef(onPageChange);

    const { setUtils } = usePdfPageOverlay({
        examMode,
        selectedPages,
        onPageSelect,
    });

    useEffect(() => {
        onPageChangeRef.current = onPageChange;
    }, [onPageChange]);

    useEffect(() => {
        if (utilsRef.current) {
            const viewer = utilsRef.current.getViewer();
            if (viewer) {
                viewer.currentScaleValue = scale.toString();
            }
        }
    }, [scale]);

    const highlights = useMemo(() => {
        return annotations.map((annotation) => ({
            id: annotation.id,
            color: annotation.color,
            content: { text: annotation.selectedText },
            position: {
                boundingRect: annotation.boundingRect,
                rects: annotation.rects,
                pageNumber: annotation.pageNumber,
            }
        }));
    }, [annotations]);

    const handleSelection = useCallback((selection: SelectionEvent) => {
        const text = selection?.content?.text || "";
        const position = selection?.position;
        if (text.length > 0 && position) {
            const rects = position.rects || [position.boundingRect];
            onTextSelection({
                text,
                rects: rects.map((r: HighlightRect) => ({
                    top: r.y1,
                    left: r.x1,
                    width: r.x2 - r.x1,
                    height: r.y2 - r.y1,
                    pageWidth: r.width,
                    pageHeight: r.height,
                })),
                pageNumber: position.boundingRect.pageNumber,
            });
        }
    }, [onTextSelection]);

    return (
        <div className="flex-1 overflow-hidden bg-muted/30 relative">
            <PdfLoader
                document={publicUrl}
                beforeLoad={() => <div className="p-8">Loading PDF...</div>}
                workerSrc="https://unpkg.com/pdfjs-dist@4.10.38/build/pdf.worker.min.mjs"
            >
                {(pdfDoc) => {
                    if (numPagesRef.current !== pdfDoc.numPages) {
                        numPagesRef.current = pdfDoc.numPages;
                        setTimeout(() => setNumPages(pdfDoc.numPages), 0);
                    }
                    return (
                        <PdfHighlighter
                            pdfScaleValue={scale}
                            pdfDocument={pdfDoc}
                            enableAreaSelection={(event) => event.altKey}
                            highlights={highlights}
                            onSelection={handleSelection}
                            selectionTip={selectionTip}
                            utilsRef={(utils) => {
                                utilsRef.current = utils;
                                setUtils(utils);
                                const viewer = utils?.getViewer();
                                if (viewer?.eventBus && !eventBusAttachedRef.current) {
                                    eventBusAttachedRef.current = true;
                                    viewer.eventBus.on("pagechanging", (evt: { pageNumber: number }) => {
                                        onPageChangeRef.current(evt.pageNumber);
                                    });
                                }
                            }}
                        >
                            <HighlightContainer onClick={(highlight: ViewportHighlight) => {
                                const annotation = annotations.find(a => a.id === highlight.id);
                                if (annotation) onAnnotationClick(annotation);
                            }} />
                        </PdfHighlighter>
                    );
                }}
            </PdfLoader>
        </div>
    );
};