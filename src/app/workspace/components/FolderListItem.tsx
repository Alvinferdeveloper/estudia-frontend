import React from "react";
import { format } from "date-fns";
import { ChevronRight, Check, Star } from "lucide-react";
import FolderIcon from "@/app/icons/Folder";
import { Folder } from "@/app/types";
import { cn } from "@/lib/utils";
import { formatBytes } from "@/lib/format";

interface FolderListItemProps {
  folder: Folder;
  onClick?: () => void;
  isSelected?: boolean;
  onToggleSelect?: () => void;
  onToggleStar?: () => void;
}

export const FolderListItem: React.FC<FolderListItemProps> = ({
  folder,
  onClick,
  isSelected = false,
  onToggleSelect,
  onToggleStar,
}) => {
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
              {folder.count} {folder.count === 1 ? 'archivo' : 'archivos'}
              {folder.subfoldersCount > 0 && ` · ${folder.subfoldersCount} carpetas`}
            </span>
          </div>
        </div>

        <div className="col-span-2 text-xs text-muted-foreground">
          {folder.updatedAt ? format(new Date(folder.updatedAt), "MMM d, yyyy") : "—"}
        </div>

        <div className="col-span-2 text-xs tabular-nums text-muted-foreground">
          {Number(folder.totalSize) > 0 ? formatBytes(folder.totalSize) : "—"}
        </div>

        <div className="col-span-2 flex items-center justify-end gap-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleStar?.();
            }}
            className={cn(
              "press-feedback flex h-7 w-7 items-center justify-center rounded-full transition-opacity duration-150",
              folder.isStarred ? "text-amber-500 opacity-100" : "text-muted-foreground opacity-0 group-hover:opacity-100"
            )}
          >
            <Star className={cn("h-3.5 w-3.5", folder.isStarred && "fill-current")} />
          </button>
          <ChevronRight className="h-4 w-4 text-muted-foreground/50 opacity-0 transition-opacity group-hover:opacity-100" />
        </div>
      </div>
    </div>
  );
};
