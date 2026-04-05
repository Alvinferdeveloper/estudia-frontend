import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

interface PageSelectorProps {
  numPages: number;
  selectedPages: number[];
  onTogglePage: (page: number) => void;
  onContinue: () => void;
  onCancel: () => void;
}

export const PageSelector: React.FC<PageSelectorProps> = ({
  numPages,
  selectedPages,
  onTogglePage,
  onContinue,
  onCancel,
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-card rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[80vh] overflow-hidden flex flex-col">
        <div className="p-4 border-b border-border">
          <h2 className="text-lg font-semibold">Select Pages for Exam</h2>
          <p className="text-sm text-muted-foreground">
            Click on pages to select. Selected: {selectedPages.length} page(s)
          </p>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
            {Array.from({ length: numPages }, (_, i) => i + 1).map((pageNum) => {
              const isSelected = selectedPages.includes(pageNum);
              const selectionIndex = selectedPages.indexOf(pageNum) + 1;

              return (
                <button
                  key={pageNum}
                  onClick={() => onTogglePage(pageNum)}
                  className={`
                    relative aspect-[3/4] rounded-lg border-2 transition-all
                    flex flex-col items-center justify-center
                    ${isSelected
                      ? "border-accent bg-accent/10"
                      : "border-border hover:border-accent/50"
                    }
                  `}
                >
                  <span className="text-lg font-medium">{pageNum}</span>
                  {isSelected && (
                    <span className="absolute -top-2 -right-2 w-6 h-6 bg-accent text-accent-foreground rounded-full text-xs flex items-center justify-center">
                      {selectionIndex}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <div className="p-4 border-t border-border flex justify-end gap-2">
          <Button variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
          <Button
            onClick={onContinue}
            disabled={selectedPages.length === 0}
          >
            Continue ({selectedPages.length} pages)
          </Button>
        </div>
      </div>
    </div>
  );
};
