import { useFormatter, useTranslations } from "next-intl";
import { FileText, Download, Check, Star, Trash2 } from "lucide-react";
import { Document } from "@/app/types";
import { Topic } from "@/app/types";
import { DeleteConfirmationDialog } from "./DeleteConfirmationDialog";
import { cn } from "@/lib/utils";
import { formatBytes } from "@/lib/format";

interface DocumentCardProps {
  doc: Document;
  topic: Topic | undefined;
  deleteDocument: (documentId: string) => void;
  onClick?: () => void;
  index?: number;
  isSelected?: boolean;
  onToggleSelect?: () => void;
  onToggleStar?: () => void;
}

const actionButtonClass =
  "press-feedback flex h-6 w-6 items-center justify-center rounded-full bg-card/90 shadow-sm transition-opacity duration-150";

export const DocumentCard: React.FC<DocumentCardProps> = ({
  doc,
  topic,
  deleteDocument,
  onClick,
  index = 0,
  isSelected = false,
  onToggleSelect,
  onToggleStar,
}) => {
  const t = useTranslations("workspace");
  const format = useFormatter();
  const tint = topic?.color || "var(--muted-foreground)";

  return (
    <div
      onClick={onClick}
      style={{ animationDelay: `${Math.min(index, 12) * 40}ms` }}
      className={cn(
        "group relative flex cursor-pointer flex-col gap-2 rounded-lg p-2 transition-colors duration-150 ease-[var(--ease-out)] animate-in fade-in slide-in-from-bottom-1",
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

        {/* Acciones en línea */}
        <div className="absolute right-2 top-2 flex items-center gap-1">
          <a
            href={doc.filePath}
            target="_blank"
            rel="noopener noreferrer"
            title={t("actions.download")}
            onClick={(e) => e.stopPropagation()}
            className={cn(actionButtonClass, "text-foreground opacity-0 group-hover:opacity-100")}
          >
            <Download className="h-3.5 w-3.5" />
          </a>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleStar?.();
            }}
            title={doc.isStarred ? t("actions.unstar") : t("actions.star")}
            className={cn(
              actionButtonClass,
              doc.isStarred ? "text-amber-500 opacity-100" : "text-foreground opacity-0 group-hover:opacity-100"
            )}
          >
            <Star className={cn("h-3.5 w-3.5", doc.isStarred && "fill-current")} />
          </button>
          <DeleteConfirmationDialog
            itemType="document"
            onConfirm={() => deleteDocument(doc.id)}
            trigger={(open) => (
              <button
                onClick={open}
                title={t("actions.delete")}
                className={cn(actionButtonClass, "text-foreground opacity-0 hover:text-destructive group-hover:opacity-100")}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            )}
          />
        </div>
      </div>

      {/* Metadatos */}
      <div className="min-w-0 px-1">
        <h4 className="truncate text-sm font-medium text-foreground">{doc.fileName}</h4>
        <p className="truncate text-xs text-muted-foreground">
          {topic ? `${topic.name} · ` : ""}
          {formatBytes(format, doc.fileSize)}
          {doc.pageCount ? ` · ${t("items.pageCount", { count: doc.pageCount })}` : ""}
        </p>
        <p className="truncate text-[11px] text-muted-foreground/70">
          {doc.updatedAt ? format.dateTime(new Date(doc.updatedAt), { dateStyle: "medium" }) : "—"}
        </p>
      </div>
    </div>
  );
};
