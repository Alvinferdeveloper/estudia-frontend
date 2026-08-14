import React from "react";
import FolderIcon from "@/app/icons/Folder";
import { Folder } from "@/app/types";
import { Check, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatBytes } from "@/lib/format";

interface FolderCardProps {
  folder: Folder;
  onClick: () => void;
  className?: string;
  index?: number;
  isSelected?: boolean;
  onToggleSelect?: () => void;
  onToggleStar?: () => void;
}

export const FolderCard: React.FC<FolderCardProps> = ({
  folder,
  onClick,
  className,
  index = 0,
  isSelected = false,
  onToggleSelect,
  onToggleStar,
}) => {
  const tint = folder.color || "var(--muted-foreground)";

  return (
    <div
      onClick={onClick}
      style={{ animationDelay: `${Math.min(index, 12) * 40}ms` }}
      className={cn(
        "group relative flex cursor-pointer flex-col gap-2 rounded-xl p-2 transition-colors duration-150 ease-[var(--ease-out)] animate-in fade-in slide-in-from-bottom-1",
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

        {/* Favorito */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleStar?.();
          }}
          className={cn(
            "press-feedback absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-card/90 shadow-sm transition-opacity duration-150",
            folder.isStarred ? "text-amber-500 opacity-100" : "text-foreground opacity-0 group-hover:opacity-100"
          )}
        >
          <Star className={cn("h-3.5 w-3.5", folder.isStarred && "fill-current")} />
        </button>
      </div>

      {/* Metadatos */}
      <div className="min-w-0 px-1">
        <h4 className="truncate text-sm font-medium text-foreground">{folder.name}</h4>
        <p className="truncate text-xs text-muted-foreground">
          {folder.count} {folder.count === 1 ? 'archivo' : 'archivos'}
          {Number(folder.totalSize) > 0 ? ` · ${formatBytes(folder.totalSize)}` : ""}
        </p>
      </div>
    </div>
  );
};
