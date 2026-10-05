import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

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
  return (
    <Dialog open onOpenChange={(open) => !open && onCancel()}>
      <DialogContent className="flex max-h-[80vh] max-w-2xl flex-col gap-0 p-0">
        <DialogHeader className="p-4 pb-3">
          <DialogTitle>Select Pages for Exam</DialogTitle>
          <DialogDescription>
            Click on pages to select. Selected: {selectedPages.length} page(s)
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto p-4 pt-0">
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5">
            {Array.from({ length: numPages }, (_, i) => i + 1).map((pageNum) => {
              const isSelected = selectedPages.includes(pageNum);
              const selectionIndex = selectedPages.indexOf(pageNum) + 1;

              return (
                <button
                  key={pageNum}
                  onClick={() => onTogglePage(pageNum)}
                  className={cn(
                    "press-feedback relative flex aspect-[3/4] flex-col items-center justify-center rounded-lg border-2 transition-colors duration-150",
                    isSelected
                      ? "border-primary bg-primary/[0.06]"
                      : "border-border hover:border-primary/40"
                  )}
                >
                  <span className="text-lg font-medium">{pageNum}</span>
                  {isSelected && (
                    <span className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                      {selectionIndex}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <DialogFooter className="border-t border-border p-4">
          <Button variant="ghost" className="press-feedback" onClick={onCancel}>
            Cancel
          </Button>
          <Button
            className="press-feedback"
            onClick={onContinue}
            disabled={selectedPages.length === 0}
          >
            Continue ({selectedPages.length} pages)
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
