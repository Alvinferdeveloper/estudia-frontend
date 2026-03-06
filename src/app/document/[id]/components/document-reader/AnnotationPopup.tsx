import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { Annotation } from "@/app/types";

interface AnnotationPopupProps {
  annotation: Annotation;
  onClose: () => void;
  onDelete: (id: string) => void;
}

export const AnnotationPopup: React.FC<AnnotationPopupProps> = ({
  annotation,
  onClose,
  onDelete,
}) => {
  return (
    <div className="fixed bottom-4 right-4 bg-background border rounded-lg shadow-lg p-4 max-w-md z-50">
      <div className="flex justify-between items-start mb-2">
        <div
          className="w-4 h-4 rounded-full"
          style={{ backgroundColor: annotation.color }}
        />
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>
      <p className="text-sm text-muted-foreground mb-2">
        &quot;{annotation.selectedText}&quot;
      </p>
      {annotation.comment && (
        <p className="text-xs text-muted-foreground mb-2">
          Note: {annotation.comment}
        </p>
      )}
      {annotation.aiResponse && (
        <p className="text-sm">{annotation.aiResponse}</p>
      )}
      <Button
        variant="destructive"
        size="sm"
        className="mt-3"
        onClick={() => onDelete(annotation.id)}
      >
        Delete Note
      </Button>
    </div>
  );
};
