import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { FileText, MoreHorizontal, Download, Eye, Check } from "lucide-react";
import { Document } from "@/app/types";
import { Topic } from "@/app/types";
import { DeleteConfirmationDialog } from "./DeleteConfirmationDialog";
import { cn } from "@/lib/utils";

interface DocumentCardProps {
  doc: Document;
  topic: Topic | undefined;
  deleteDocument: (documentId: string) => void;
  onClick?: () => void;
  index?: number;
  isSelected?: boolean;
  onToggleSelect?: () => void;
}

export const DocumentCard: React.FC<DocumentCardProps> = ({
  doc,
  topic,
  deleteDocument,
  onClick,
  index = 0,
  isSelected = false,
  onToggleSelect,
}) => {
  const tint = topic?.color || "var(--muted-foreground)";

  return (
    <div
      onClick={onClick}
      style={{ animationDelay: `${Math.min(index, 12) * 40}ms` }}
      className={cn(
        "group relative flex cursor-pointer flex-col gap-2 rounded-xl p-2 transition-colors duration-150 ease-[var(--ease-out)] animate-in fade-in slide-in-from-bottom-1",
        isSelected ? "bg-primary/[0.06]" : "hover:bg-accent/60"
      )}
    >
      {/* Miniatura */}
      <div
        className={cn(
          "relative flex aspect-[4/3] items-center justify-center overflow-hidden rounded-lg transition-transform duration-200 ease-[var(--ease-out)] group-hover:scale-[1.02]",
          isSelected && "ring-2 ring-primary"
        )}
        style={{ backgroundColor: `color-mix(in oklch, ${tint} 10%, var(--muted))` }}
      >
        <FileText className="h-9 w-9" style={{ color: tint }} strokeWidth={1.5} />

        {/* Checkbox de selección */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleSelect?.();
          }}
          className={cn(
            "press-feedback absolute left-2 top-2 flex h-5 w-5 items-center justify-center rounded-md border-2 transition-all duration-150",
            isSelected
              ? "border-primary bg-primary text-primary-foreground opacity-100"
              : "border-white/80 bg-black/10 opacity-0 backdrop-blur-sm group-hover:opacity-100 hover:border-primary"
          )}
        >
          {isSelected && <Check className="h-3 w-3" strokeWidth={3} />}
        </button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              onClick={(e) => e.stopPropagation()}
              className="press-feedback absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-card/90 text-foreground opacity-0 shadow-sm transition-opacity duration-150 group-hover:opacity-100"
            >
              <MoreHorizontal className="h-3.5 w-3.5" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
            <DropdownMenuItem>
              <a href={`/document/${doc.id}`} className="flex items-center w-full">
                <Eye className="mr-2 h-4 w-4" />
                View
              </a>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <a href={doc.filePath} target="_blank" rel="noopener noreferrer" className="flex items-center w-full">
                <Download className="mr-2 h-4 w-4" />
                Download
              </a>
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
              <DeleteConfirmationDialog onConfirm={() => deleteDocument(doc.id)} />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Metadatos */}
      <div className="min-w-0 px-1">
        <h4 className="truncate text-sm font-medium text-foreground">{doc.fileName}</h4>
        <p className="truncate text-xs text-muted-foreground">
          {topic ? `${topic.name} · ` : ""}
          {(Number(doc.fileSize) / (1024 * 1024)).toFixed(1)} MB
        </p>
      </div>
    </div>
  );
};
