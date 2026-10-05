import React from "react";
import { useFormatter, useTranslations } from "next-intl";
import FolderIcon from "@/app/icons/Folder";
import { Folder } from "@/app/types";
import { Check, Star, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatBytes } from "@/lib/format";
import { DeleteConfirmationDialog } from "./DeleteConfirmationDialog";

interface FolderCardProps {
  folder: Folder;
  onClick: () => void;
  deleteFolder?: (folderId: string) => void;
  className?: string;
  index?: number;
  isSelected?: boolean;
  onToggleSelect?: () => void;
  onToggleStar?: () => void;
}

const actionButtonClass =
  "press-feedback flex h-6 w-6 items-center justify-center rounded-full bg-card/90 shadow-sm transition-opacity duration-150";

export const FolderCard: React.FC<FolderCardProps> = ({
  folder,
  onClick,
  deleteFolder,
  className,
  index = 0,
  isSelected = false,
  onToggleSelect,
  onToggleStar,
}) => {
  const t = useTranslations("workspace");
  const format = useFormatter();
  const tint = folder.color || "var(--muted-foreground)";

  return (
    <div
      onClick={onClick}
      style={{ animationDelay: `${Math.min(index, 12) * 40}ms` }}
      className={cn(
        "group relative flex cursor-pointer flex-col gap-2 rounded-lg p-2 transition-colors duration-150 ease-[var(--ease-out)] animate-in fade-in slide-in-from-bottom-1",
        isSelected ? "bg-primary/[0.06]" : "hover:bg-accent/60",
        className
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
        <FolderIcon size="lg" color={folder.color} />

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
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleStar?.();
            }}
            title={folder.isStarred ? t("actions.unstar") : t("actions.star")}
            className={cn(
              actionButtonClass,
              folder.isStarred ? "text-amber-500 opacity-100" : "text-foreground opacity-0 group-hover:opacity-100"
            )}
          >
            <Star className={cn("h-3.5 w-3.5", folder.isStarred && "fill-current")} />
          </button>
          <DeleteConfirmationDialog
            onConfirm={() => deleteFolder?.(folder.id)}
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
        <h4 className="truncate text-sm font-medium text-foreground">{folder.name}</h4>
        <p className="truncate text-xs text-muted-foreground">
          {t("items.fileCount", { count: folder.count })}
          {folder.subfoldersCount > 0 ? ` · ${t("items.folderCount", { count: folder.subfoldersCount })}` : ""}
          {Number(folder.totalSize) > 0 ? ` · ${formatBytes(folder.totalSize)}` : ""}
        </p>
        <p className="truncate text-[11px] text-muted-foreground/70">
          {folder.updatedAt ? format.dateTime(new Date(folder.updatedAt), { dateStyle: "medium" }) : "—"}
        </p>
      </div>
    </div>
  );
};
