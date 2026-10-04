
import { ZoomIn, ZoomOut, ScanSearch } from "lucide-react";
import { ZocratisMark } from "@/components/brand/ZocratisMark";

interface PdfControlsProps {
    pageNumber: number;
    numPages: number | null;
    scale: number;
    isChatOpen: boolean;
    selectedText: string | null;
    onChatToggle: () => void;
    onZoomIn: () => void;
    onZoomOut: () => void;
    examMode?: boolean;
    selectedPages?: number[];
    onPageSelect?: (page: number) => void;
    regionMode?: boolean;
    onRegionModeToggle?: () => void;
}

export const PdfControls: React.FC<PdfControlsProps> = ({
    pageNumber,
    numPages,
    scale,
    isChatOpen,
    selectedText,
    onChatToggle,
    onZoomIn,
    onZoomOut,
    examMode = false,
    regionMode = false,
    onRegionModeToggle,
}) => (
    <>
        {/* Floating toolbar: page indicator + zoom */}
        <div className="pointer-events-none absolute inset-x-0 top-4 z-20 flex justify-center">
            <div className="pointer-events-auto flex items-center gap-1 rounded-full border border-border/60 bg-card/90 px-2 py-1.5 shadow-lg shadow-black/5 backdrop-blur-md">
                <span className="px-2 text-xs font-medium tabular-nums text-muted-foreground">
                    {pageNumber || 1} / {numPages || "--"}
                </span>
                <div className="h-4 w-px bg-border" />
                <button
                    onClick={onZoomOut}
                    className="press-feedback flex h-7 w-7 items-center justify-center rounded-full text-muted-foreground transition-colors duration-150 hover:bg-accent hover:text-foreground"
                >
                    <ZoomOut className="h-3.5 w-3.5" />
                </button>
                <span className="min-w-10 text-center text-xs font-medium tabular-nums text-muted-foreground">
                    {Math.round(scale * 100)}%
                </span>
                <button
                    onClick={onZoomIn}
                    className="press-feedback flex h-7 w-7 items-center justify-center rounded-full text-muted-foreground transition-colors duration-150 hover:bg-accent hover:text-foreground"
                >
                    <ZoomIn className="h-3.5 w-3.5" />
                </button>
            </div>
        </div>

        {/* Floating region-selection toggle: images/formulas visual query */}
        {!examMode && onRegionModeToggle && (
            <div className="absolute right-40 top-4 z-20">
                <button
                    onClick={onRegionModeToggle}
                    title="Preguntar sobre una imagen o fórmula"
                    className={`press-feedback flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-medium shadow-lg backdrop-blur-md transition-colors duration-150 ${
                        regionMode
                            ? "border border-primary/40 bg-primary text-primary-foreground shadow-primary/20"
                            : "border border-border/60 bg-card/90 text-foreground shadow-black/5 hover:border-primary/40"
                    }`}
                >
                    <ScanSearch className="h-4 w-4" />
                    Imagen o fórmula
                </button>
            </div>
        )}

        {/* Floating "Ask AI" trigger */}
        <div className="absolute right-4 top-4 z-20">
            <button
                onClick={onChatToggle}
                className={`press-feedback flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-medium shadow-lg backdrop-blur-md transition-colors duration-150 ${
                    isChatOpen
                        ? "border border-primary/40 bg-primary text-primary-foreground shadow-primary/20"
                        : "border border-border/60 bg-card/90 text-foreground shadow-black/5 hover:border-primary/40"
                }`}
            >
                <ZocratisMark className="size-[18px]" />
                Asistente IA
                {selectedText && !isChatOpen && (
                    <span className="relative flex h-2 w-2">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary/60" />
                        <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
                    </span>
                )}
            </button>
        </div>
    </>
);
