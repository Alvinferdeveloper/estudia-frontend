import { useEffect, useCallback, useRef } from "react";

interface UsePdfPageOverlayProps {
    examMode: boolean;
    selectedPages: number[];
    onPageSelect: ((page: number) => void) | undefined;
}

export const usePdfPageOverlay = ({
    examMode,
    selectedPages,
    onPageSelect,
}: UsePdfPageOverlayProps) => {
    const utilsRef = useRef<any>(null);
    const onPageSelectRef = useRef(onPageSelect);
    const selectedPagesRef = useRef(selectedPages);
    const isInitialized = useRef(false);

    useEffect(() => {
        onPageSelectRef.current = onPageSelect;
    }, [onPageSelect]);

    useEffect(() => {
        selectedPagesRef.current = selectedPages;
    }, [selectedPages]);

    // Looks live in globals.css (.exam-page-overlay); only the selected state is set here.
    const updatePageOverlay = useCallback((pageEl: HTMLElement, pageNumber: number) => {
        const overlay = pageEl.querySelector<HTMLDivElement>(".exam-page-overlay");
        const badge = pageEl.querySelector<HTMLDivElement>(".exam-page-badge");
        if (!overlay || !badge) return;

        const isSelected = selectedPagesRef.current.includes(pageNumber);
        overlay.dataset.selected = String(isSelected);
        badge.textContent = isSelected ? "✓" : "+";
    }, []);

    const createPageOverlay = useCallback((pageEl: HTMLElement, pageNumber: number) => {
        if (pageEl.querySelector(".exam-page-overlay")) return;

        const overlay = document.createElement("div");
        overlay.className = "exam-page-overlay";
        overlay.onclick = (e) => {
            e.stopPropagation();
            onPageSelectRef.current?.(pageNumber);
        };

        const badge = document.createElement("div");
        badge.className = "exam-page-badge";
        badge.setAttribute("aria-hidden", "true");

        overlay.appendChild(badge);
        pageEl.appendChild(overlay);
    }, []);

    // Also runs on every page render, so it must do nothing outside exam mode.
    const applyOverlays = useCallback(() => {
        if (!examMode || !utilsRef.current) return;
        const viewer = utilsRef.current.getViewer();
        if (!viewer?.container) return;

        const pages = viewer.container.querySelectorAll(".page") as NodeListOf<HTMLElement>;
        pages.forEach((pageEl) => {
            const pageNumber = parseInt(pageEl.dataset.pageNumber || "0");
            if (!pageNumber) return;

            createPageOverlay(pageEl, pageNumber);
            updatePageOverlay(pageEl, pageNumber);
        });

        isInitialized.current = true;
    }, [examMode, createPageOverlay, updatePageOverlay]);

    const cleanupOverlays = useCallback(() => {
        if (!utilsRef.current) return;
        const viewer = utilsRef.current.getViewer();
        if (!viewer?.container) return;

        const overlays = viewer.container.querySelectorAll(".exam-page-overlay");
        overlays.forEach((o: any) => o.remove());
    }, []);

    useEffect(() => {
        if (utilsRef.current) {
            const viewer = utilsRef.current.getViewer();
            if (viewer?.eventBus) {
                const handlePageRendered = () => applyOverlays();
                viewer.eventBus.on("pagerendered", handlePageRendered);
                return () => viewer.eventBus.off("pagerendered", handlePageRendered);
            }
        }
    }, [applyOverlays]);

    useEffect(() => {
        if (examMode) {
            applyOverlays();
        } else {
            cleanupOverlays();
        }
    }, [examMode, applyOverlays, cleanupOverlays]);

    useEffect(() => {
        if (examMode && isInitialized.current) {
            if (!utilsRef.current) return;
            const viewer = utilsRef.current.getViewer();
            if (!viewer?.container) return;

            const pages = viewer.container.querySelectorAll(".page") as NodeListOf<HTMLElement>;
            pages.forEach((pageEl) => {
                const pageNumber = parseInt(pageEl.dataset.pageNumber || "0");
                if (pageNumber) updatePageOverlay(pageEl, pageNumber);
            });
        }
    }, [selectedPages, examMode, updatePageOverlay]);

    return {
        setUtils: (utils: any) => { utilsRef.current = utils; },
    };
};