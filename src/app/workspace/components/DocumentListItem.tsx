import React from "react";
import { format } from "date-fns";
import { MoreHorizontal, FileText, Eye, Download, Check } from "lucide-react";
import { Document, Topic } from "@/app/types";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DeleteConfirmationDialog } from "./DeleteConfirmationDialog";
import { cn } from "@/lib/utils";

interface DocumentListItemProps {
  doc: Document;
  topic?: Topic;
  deleteDocument: (id: string) => void;
  onClick?: () => void;
  isSelected?: boolean;
  onToggleSelect?: () => void;
}

export const DocumentListItem: React.FC<DocumentListItemProps> = ({
  doc,
  topic,
  deleteDocument,
  onClick,
  isSelected = false,
  onToggleSelect,
}) => {
  const formattedDate = doc.lastAccessedAt
    ? format(new Date(doc.lastAccessedAt), "MMM d, yyyy")
    : doc.createdAt
      ? format(new Date(doc.createdAt), "MMM d, yyyy")
      : "Unknown";

  const tint = topic?.color || "var(--muted-foreground)";

  return (
    <div
      className={cn(
        "group flex w-full cursor-pointer items-center rounded-md px-2 py-2 transition-colors duration-150",
        isSelected ? "bg-primary/[0.06]" : "hover:bg-accent/60"
      )}
      onClick={onClick}
    >
      <div className="grid w-full grid-cols-12 items-center gap-4">
        <div className="col-span-1 flex items-center">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleSelect?.();
            }}
            className={cn(
              "press-feedback flex h-5 w-5 items-center justify-center rounded-md border-2 transition-all duration-150",
              isSelected
                ? "border-primary bg-primary text-primary-foreground opacity-100"
                : "border-border opacity-0 group-hover:opacity-100 hover:border-primary"
            )}
          >
            {isSelected && <Check className="h-3 w-3" strokeWidth={3} />}
          </button>
        </div>

        <div className="col-span-5 flex items-center gap-3 overflow-hidden">
          <FileText className="h-4 w-4 shrink-0" style={{ color: tint }} />
          <div className="flex min-w-0 flex-col">
            <span className="truncate text-sm font-medium text-foreground/90 transition-colors group-hover:text-primary">
              {doc.fileName}
            </span>
            <span className="truncate text-[11px] text-muted-foreground">
              {topic?.name || "Sin colección"}
            </span>
          </div>
        </div>

        <div className="col-span-2 text-xs text-muted-foreground">
          {formattedDate}
        </div>

        <div className="col-span-2 text-xs tabular-nums text-muted-foreground">
          {(Number(doc.fileSize) / (1024 * 1024)).toFixed(1)} MB
        </div>

        <div className="col-span-2 flex items-center justify-end opacity-0 transition-opacity group-hover:opacity-100">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="press-feedback h-7 w-7"
                onClick={(e) => e.stopPropagation()}
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
              <DropdownMenuItem>
                <a href={`/document/${doc.id}`} className="flex w-full items-center">
                  <Eye className="mr-2 h-4 w-4" />
                  Ver
                </a>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <a href={doc.filePath} target="_blank" rel="noopener noreferrer" className="flex w-full items-center">
                  <Download className="mr-2 h-4 w-4" />
                  Descargar
                </a>
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                <DeleteConfirmationDialog onConfirm={() => deleteDocument(doc.id)} />
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
};
