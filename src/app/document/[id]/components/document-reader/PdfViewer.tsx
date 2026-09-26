"use client";

import { useRef, useMemo, useCallback, useEffect } from "react";
import { PdfLoader, PdfHighlighter, TextHighlight, useHighlightContainerContext, ViewportHighlight } from "react-pdf-highlighter-extended";
import "react-pdf-highlighter-extended/dist/esm/style/PdfHighlighter.css";
import "react-pdf-highlighter-extended/dist/esm/style/pdf_viewer.css";
import { AnnotationRect, BoundingRect } from "@/app/types";
import { usePdfPageOverlay } from "../../hooks/usePdfPageOverlay";

interface RegionSelection {
    imageBase64: string;
    pageNumber: number;
    boundingRect: { x1: number; y1: number; x2: number; y2: number };
}

export interface PdfHighlightItem {
    id: string;
    color: string;
    selectedText: string;
    pageNumber: number;
    boundingRect: BoundingRect;
    rects: AnnotationRect[];
}

interface PdfViewerProps {
    publicUrl: string;
    scale: number;
    highlights: PdfHighlightItem[];
    selectionTip: React.ReactNode;
    onTextSelection: (selection: { text: string; rects: { top: number; left: number; width: number; height: number; pageWidth?: number; pageHeight?: number }[]; pageNumber: number }) => void;
    onPageChange: (page: number) => void;
    onHighlightClick: (id: string, anchorRect: DOMRect) => void;
    setNumPages: (numPages: number) => void;
    examMode?: boolean;
    selectedPages?: number[];
    onPageSelect?: (page: number) => void;
    onPdfLoad?: (pdfDoc: any) => void;
    regionMode?: boolean;
    onRegionSelection?: (region: RegionSelection) => void;
}

interface SelectionEvent {
    type?: "text" | "area";
    content?: { text?: string; image?: string };
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

const HighlightContainer = ({ onClick }: { onClick: (highlight: ViewportHighlight, anchorRect: DOMRect) => void }) => {
    const { highlight, isScrolledTo } = useHighlightContainerContext();
    const highlightWithColor = highlight as ViewportHighlight & { color?: string };

    return (
        <div onClick={(e) => onClick(highlight, e.currentTarget.getBoundingClientRect())}>
            <TextHighlight isScrolledTo={isScrolledTo} highlight={highlight} style={{ background: highlightWithColor.color }} />
        </div>
    );
};

export const PdfViewer: React.FC<PdfViewerProps> = ({
    publicUrl,
    highlights: highlightItems,
    scale,
    setNumPages,
    selectionTip,
    onPageChange,
    onTextSelection,
    onHighlightClick,
    examMode = false,
    selectedPages = [],
    onPageSelect,
    onPdfLoad,
    regionMode = false,
    onRegionSelection,
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

    // The library snapshots selectionTip synchronously on mouseup, before our state catches up — push fresh content into the tip once it does.
    useEffect(() => {
        const utils = utilsRef.current;
        const currentTip = utils?.getTip?.();
        if (currentTip) {
            utils.setTip({ ...currentTip, content: selectionTip });
        }
    }, [selectionTip]);

    const highlights = useMemo(() => {
        return highlightItems.map((item) => ({
            id: item.id,
            color: item.color,
            content: { text: item.selectedText },
            position: {
                boundingRect: item.boundingRect,
                rects: item.rects,
                pageNumber: item.pageNumber,
            }
        }));
    }, [highlightItems]);

    const handleSelection = useCallback((selection: SelectionEvent) => {
        const position = selection?.position;
        if (!position) return;

        if (selection.type === "area") {
            const image = selection.content?.image;
            if (image && onRegionSelection) {
                const { x1, y1, x2, y2, pageNumber } = position.boundingRect;
                onRegionSelection({
                    imageBase64: image,
                    pageNumber,
                    boundingRect: { x1, y1, x2, y2 },
                });
            }
            return;
        }

        const text = selection?.content?.text || "";
        if (text.length > 0) {
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
    }, [onTextSelection, onRegionSelection]);

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
                        setTimeout(() => {
                            setNumPages(pdfDoc.numPages);
                            if (onPdfLoad) onPdfLoad(pdfDoc);
                        }, 0);
                    }
                    return (
                        <PdfHighlighter
                            pdfScaleValue={scale}
                            pdfDocument={pdfDoc}
                            enableAreaSelection={(event) => regionMode || event.altKey}
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
                            <HighlightContainer onClick={(highlight: ViewportHighlight, anchorRect: DOMRect) => {
                                onHighlightClick(highlight.id, anchorRect);
                            }} />
                        </PdfHighlighter>
                    );
                }}
            </PdfLoader>
        </div>
    );
};