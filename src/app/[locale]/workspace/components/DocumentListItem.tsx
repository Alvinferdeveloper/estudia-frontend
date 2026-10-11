import React from "react";
import { useFormatter, useTranslations } from "next-intl";
import { FileText, Download, Check, Star, Trash2 } from "lucide-react";
import { Document, Topic } from "@/app/types";
import { DeleteConfirmationDialog } from "./DeleteConfirmationDialog";
import { cn } from "@/lib/utils";
import { formatBytes } from "@/lib/format";

const actionButtonClass =
  "press-feedback flex h-7 w-7 items-center justify-center rounded-full transition-opacity duration-150";

interface DocumentListItemProps {
  doc: Document;
  topic?: Topic;
  deleteDocument: (id: string) => void;
  onClick?: () => void;
  isSelected?: boolean;
  onToggleSelect?: () => void;
  onToggleStar?: () => void;
}

export const DocumentListItem: React.FC<DocumentListItemProps> = ({
  doc,
  topic,
  deleteDocument,
  onClick,
  isSelected = false,
  onToggleSelect,
  onToggleStar,
}) => {
  const t = useTranslations("workspace");
  const format = useFormatter();
  // "Modificado" refleja el contenido/metadata del documento (updatedAt), no la última
  // vez que se abrió (lastAccessedAt) — son conceptos distintos.
  const modifiedAt = doc.updatedAt ?? doc.createdAt;
  const formattedDate = modifiedAt
    ? format.dateTime(new Date(modifiedAt), { dateStyle: "medium" })
    : t("items.unknownDate");

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
              {topic?.name || t("items.noCollection")}
              {doc.pageCount ? ` · ${t("items.pageCount", { count: doc.pageCount })}` : ""}
            </span>
          </div>
        </div>

        <div className="col-span-2 text-xs text-muted-foreground">
          {formattedDate}
        </div>

        <div className="col-span-2 text-xs tabular-nums text-muted-foreground">
          {formatBytes(format, doc.fileSize)}
        </div>

        <div className="col-span-2 flex items-center justify-end gap-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleStar?.();
            }}
            title={doc.isStarred ? t("actions.unstar") : t("actions.star")}
            className={cn(
              actionButtonClass,
              doc.isStarred ? "text-ochre opacity-100" : "text-muted-foreground opacity-0 group-hover:opacity-100"
            )}
          >
            <Star className={cn("h-3.5 w-3.5", doc.isStarred && "fill-current")} />
          </button>
          <a
            href={doc.filePath}
            target="_blank"
            rel="noopener noreferrer"
            title={t("actions.download")}
            onClick={(e) => e.stopPropagation()}
            className={cn(actionButtonClass, "text-muted-foreground opacity-0 group-hover:opacity-100 hover:text-foreground")}
          >
            <Download className="h-3.5 w-3.5" />
          </a>
          <DeleteConfirmationDialog
            itemType="document"
            onConfirm={() => deleteDocument(doc.id)}
            trigger={(open) => (
              <button
                onClick={open}
                title={t("actions.delete")}
                className={cn(actionButtonClass, "text-muted-foreground opacity-0 group-hover:opacity-100 hover:text-destructive")}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            )}
          />
        </div>
      </div>
    </div>
  );
};
