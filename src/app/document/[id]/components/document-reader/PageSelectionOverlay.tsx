"use client";

import { Check, X } from "lucide-react";

interface PageOverlayProps {
    pageNumber: number;
    isSelected: boolean;
    selectionIndex: number | null;
    onClick: () => void;
}

export const PageOverlay: React.FC<PageOverlayProps> = ({
    pageNumber,
    isSelected,
    selectionIndex,
    onClick,
}) => {
    return (
        <div
            className="absolute inset-0 cursor-pointer transition-all duration-200 z-10"
            onClick={onClick}
        >
            {isSelected && (
                <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-red-600 flex items-center justify-center shadow-lg border-2 border-background">
                    {selectionIndex !== null ? (
                        <span className="text-sm font-bold text-accent-foreground">
                            {selectionIndex + 1}
                        </span>
                    ) : (
                        <Check className="w-5 h-5 text-accent-foreground" />
                    )}
                </div>
            )}

            <div className={`absolute inset-0 transition-all duration-200 pointer-events-none ${isSelected
                ? 'ring-4 ring-accent/40 bg-accent/10'
                : 'hover:ring-2 hover:ring-accent/20 hover:bg-accent/5'
                }`}>
                {!isSelected && (
                    <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-card/90 border-2 border-dashed border-muted-foreground/50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                        <span className="text-xs text-muted-foreground font-medium">+</span>
                    </div>
                )}
            </div>
        </div>
    );
};

interface PageSelectionIndicatorProps {
    selectedPages: number[];
    currentPage: number;
    onPageSelect: (page: number) => void;
    isExamMode: boolean;
}

export const PageSelectionIndicator: React.FC<PageSelectionIndicatorProps> = ({
    selectedPages,
    currentPage,
    onPageSelect,
    isExamMode,
}) => {
    if (!isExamMode) return null;

    const isSelected = selectedPages.includes(currentPage);
    const selectionIndex = isSelected ? selectedPages.indexOf(currentPage) : null;

    return (
        <PageOverlay
            pageNumber={currentPage}
            isSelected={isSelected}
            selectionIndex={selectionIndex}
            onClick={() => onPageSelect(currentPage)}
        />
    );
};