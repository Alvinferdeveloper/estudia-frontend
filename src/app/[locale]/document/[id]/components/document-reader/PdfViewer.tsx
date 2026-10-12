"use client";

import { useRef, useMemo, useCallback, useEffect, useImperativeHandle } from "react";
import { PdfLoader, PdfHighlighter, TextHighlight, useHighlightContainerContext, ViewportHighlight } from "react-pdf-highlighter-extended";
import "react-pdf-highlighter-extended/dist/esm/style/PdfHighlighter.css";
import "react-pdf-highlighter-extended/dist/esm/style/pdf_viewer.css";
import { AnnotationRect, BoundingRect } from "@/app/types";
import { usePdfPageOverlay } from "../../hooks/usePdfPageOverlay";
import { PdfSkeleton } from "./PdfSkeleton";
import type { PdfDocument } from "@/app/[locale]/document/[id]/lib/pdf-document";

// Lets the reader move the viewer from outside it (the page thumbnails).
export interface PdfNavigation {
    goToPage: (pageNumber: number) => void;
}

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
    onHighlightClick: (id: string, anchor: Element) => void;
    setNumPages: (numPages: number) => void;
    examMode?: boolean;
    selectedPages?: number[];
    onPageSelect?: (page: number) => void;
    onPdfLoad?: (pdfDoc: PdfDocument) => void;
    navigationRef?: React.Ref<PdfNavigation>;
    regionMode?: boolean;
    onRegionSelection?: (region: RegionSelection) => void;
    viewportRef?: React.Ref<HTMLDivElement>;
    // Page to open on once pdf.js has laid out the pages; onReady fires after that, or right away without one.
    initialPage?: number;
    onReady?: () => void;
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

// Only .TextHighlight__part elements have a real box, and the click target isn't always one, so pick by position.
const getClickedPart = (container: Element, x: number, y: number): Element => {
    const parts = Array.from(container.querySelectorAll(".TextHighlight__part"));
    const hit = parts.find((part) => {
        const rect = part.getBoundingClientRect();
        return x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom;
    });
    return hit ?? parts[0] ?? container;
};

const HighlightContainer = ({ onClick }: { onClick: (highlight: ViewportHighlight, anchor: Element) => void }) => {
    const { highlight, isScrolledTo } = useHighlightContainerContext();
    const highlightWithColor = highlight as ViewportHighlight & { color?: string };

    return (
        <div onClick={(e) => onClick(highlight, getClickedPart(e.currentTarget, e.clientX, e.clientY))}>
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
    navigationRef,
    regionMode = false,
    onRegionSelection,
    viewportRef,
    initialPage,
    onReady,
}) => {
    const utilsRef = useRef<any>(null);
    const numPagesRef = useRef<number | null>(null);
    const eventBusAttachedRef = useRef(false);
    const onPageChangeRef = useRef(onPageChange);
    const initialPageRef = useRef(initialPage);
    const onReadyRef = useRef(onReady);

    const { setUtils } = usePdfPageOverlay({
        examMode,
        selectedPages,
        onPageSelect,
    });

    useEffect(() => {
        onPageChangeRef.current = onPageChange;
        onReadyRef.current = onReady;
    }, [onPageChange, onReady]);

    useImperativeHandle(navigationRef, () => ({
        goToPage: (pageNumber) => utilsRef.current?.getViewer()?.scrollPageIntoView({ pageNumber }),
    }), []);

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
        // contain:paint also clips position:fixed descendants (popovers portaled here), which overflow-hidden alone doesn't.
        <div ref={viewportRef} className="flex-1 overflow-hidden bg-reader-canvas relative [contain:paint]">
            <PdfLoader
                document={publicUrl}
                beforeLoad={() => <PdfSkeleton />}
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
                                    const openInitialPage = () => {
                                        const page = initialPageRef.current;
                                        if (page && page > 1 && page <= viewer.pagesCount) viewer.currentPageNumber = page;
                                        onReadyRef.current?.();
                                    };
                                    if (viewer.pagesCount > 0) openInitialPage();
                                    else viewer.eventBus.on("pagesinit", openInitialPage, { once: true });
                                }
                            }}
                        >
                            <HighlightContainer onClick={(highlight: ViewportHighlight, anchor: Element) => {
                                onHighlightClick(highlight.id, anchor);
                            }} />
                        </PdfHighlighter>
                    );
                }}
            </PdfLoader>
        </div>
    );
};