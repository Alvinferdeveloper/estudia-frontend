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

    const getOverlayStyles = useCallback((isSelected: boolean) => ({
        overlay: {
            border: isSelected ? "3px solid #3b82f6" : "3px solid transparent",
            backgroundColor: isSelected ? "rgba(59, 130, 246, 0.1)" : "transparent",
        },
        badge: {
            backgroundColor: isSelected ? "#3b82f6" : "white",
            color: isSelected ? "white" : "#3b82f6",
            innerText: isSelected ? "" : "+",
            opacity: isSelected ? "1" : "0",
            transform: isSelected ? "scale(1)" : "scale(0.8)",
        },
    }), []);

    const updatePageOverlay = useCallback((pageEl: HTMLElement, pageNumber: number) => {
        const overlay = pageEl.querySelector(".exam-page-overlay") as HTMLDivElement;
        const badge = pageEl.querySelector(".exam-page-badge") as HTMLDivElement;
        if (!overlay || !badge) return;

        if (!examMode) {
            overlay.style.display = "none";
            return;
        }

        overlay.style.display = "flex";
        const index = selectedPagesRef.current.indexOf(pageNumber);
        const isSelected = index !== -1;
        const styles = getOverlayStyles(isSelected);

        Object.assign(overlay.style, styles.overlay);
        Object.assign(badge.style, styles.badge);

        if (isSelected) {
            badge.innerText = (index + 1).toString();
        } else {
            badge.innerText = "+";
        }

        badge.style.opacity = styles.badge.opacity;
        badge.style.transform = styles.badge.transform;
    }, [examMode, getOverlayStyles]);

    const createPageOverlay = useCallback((pageEl: HTMLElement, pageNumber: number) => {
        if (pageEl.querySelector(".exam-page-overlay")) return;

        const overlay = document.createElement("div");
        overlay.className = "exam-page-overlay";
        Object.assign(overlay.style, {
            position: "absolute",
            inset: "0",
            zIndex: "30",
            cursor: "pointer",
            transition: "all 0.2s ease",
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
            padding: "16px",
            pointerEvents: "auto",
            boxSizing: "border-box"
        });

        overlay.onclick = (e) => {
            e.stopPropagation();
            onPageSelectRef.current?.(pageNumber);
        };

        overlay.onmouseenter = () => {
            if (!selectedPagesRef.current.includes(pageNumber)) {
                const b = overlay.querySelector(".exam-page-badge") as HTMLDivElement;
                if (b) {
                    b.style.opacity = "0.7";
                    b.style.transform = "scale(0.9)";
                }
            }
        };

        overlay.onmouseleave = () => {
            if (!selectedPagesRef.current.includes(pageNumber)) {
                const b = overlay.querySelector(".exam-page-badge") as HTMLDivElement;
                if (b) {
                    b.style.opacity = "0";
                    b.style.transform = "scale(0.8)";
                }
            }
        };

        const badge = document.createElement("div");
        badge.className = "exam-page-badge";
        Object.assign(badge.style, {
            width: "28px",
            height: "28px",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "12px",
            fontWeight: "bold",
            transition: "all 0.2s ease",
            boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
        });

        overlay.appendChild(badge);
        pageEl.appendChild(overlay);
    }, []);

    const applyOverlays = useCallback(() => {
        if (!utilsRef.current) return;
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
    }, [createPageOverlay, updatePageOverlay]);

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