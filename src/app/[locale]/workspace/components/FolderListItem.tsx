import React from "react";
import { useFormatter, useTranslations } from "next-intl";
import { Check, Star, Trash2 } from "lucide-react";
import FolderIcon from "@/app/icons/Folder";
import { Folder } from "@/app/types";
import { cn } from "@/lib/utils";
import { IconButton } from "@/components/ui/icon-button";
import { formatBytes } from "@/lib/format";
import { DeleteConfirmationDialog } from "./DeleteConfirmationDialog";

interface FolderListItemProps {
  folder: Folder;
  onClick?: () => void;
  deleteFolder?: (folderId: string) => void;
  isSelected?: boolean;
  onToggleSelect?: () => void;
  onToggleStar?: () => void;
}

const actionButtonClass = "focus-visible:opacity-100";

export const FolderListItem: React.FC<FolderListItemProps> = ({
  folder,
  onClick,
  deleteFolder,
  isSelected = false,
  onToggleSelect,
  onToggleStar,
}) => {
  const t = useTranslations("workspace");
  const format = useFormatter();

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

        <div className="col-span-5 flex min-w-0 items-center gap-3">
          <FolderIcon size="md" color={folder.color} />
          <div className="flex min-w-0 flex-col">
            <span className="truncate text-sm font-medium text-foreground/90 transition-colors group-hover:text-primary">
              {folder.name}
            </span>
            <span className="truncate text-[11px] text-muted-foreground">
              {t("items.fileCount", { count: folder.count })}
              {folder.subfoldersCount > 0 && ` · ${t("items.folderCount", { count: folder.subfoldersCount })}`}
            </span>
          </div>
        </div>

        <div className="col-span-2 text-xs text-muted-foreground">
          {folder.updatedAt ? format.dateTime(new Date(folder.updatedAt), { dateStyle: "medium" }) : "—"}
        </div>

        <div className="col-span-2 text-xs tabular-nums text-muted-foreground">
          {Number(folder.totalSize) > 0 ? formatBytes(format, folder.totalSize) : "—"}
        </div>

        <div className="col-span-2 flex items-center justify-end gap-1">
          <IconButton
            size="icon-sm"
            label={folder.isStarred ? t("actions.unstar") : t("actions.star")}
            onClick={(e) => {
              e.stopPropagation();
              onToggleStar?.();
            }}
            className={cn(actionButtonClass, folder.isStarred ? "text-ochre opacity-100 hover:text-ochre" : "opacity-0 group-hover:opacity-100")}
          >
            <Star className={cn("size-3.5", folder.isStarred && "fill-current")} />
          </IconButton>
          <DeleteConfirmationDialog
            itemType="folder"
            onConfirm={() => deleteFolder?.(folder.id)}
            trigger={(open) => (
              <IconButton
                size="icon-sm"
                variant="ghost-destructive"
                label={t("actions.delete")}
                onClick={open}
                className={cn(actionButtonClass, "opacity-0 group-hover:opacity-100")}
              >
                <Trash2 className="size-3.5" />
              </IconButton>
            )}
          />
        </div>
      </div>
    </div>
  );
};
