import React from "react";
import FolderIcon from "@/app/icons/Folder";
import { Folder } from "@/app/types";
import { cn } from "@/lib/utils";

interface FolderCardProps {
  folder: Folder;
  onClick: () => void;
  className?: string;
}

export const FolderCard: React.FC<FolderCardProps> = ({
  folder,
  onClick,
  className,
}) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        "group flex flex-col items-center justify-center p-4 rounded-xl border bg-card border-border hover:border-primary/50 hover:bg-accent/50 transition-all text-left w-full shadow-sm hover:shadow-md",
        className
      )}
    >
      <div className="p-2 rounded-lg mb-2 group-hover:scale-110 transition-transform duration-200">
        <FolderIcon size="lg" color={folder.color} />
      </div>
      <span className="text-sm font-semibold truncate w-full text-center group-hover:text-primary transition-colors">
        {folder.name}
      </span>
      <div className="flex items-center gap-2 mt-1">
        <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-secondary text-muted-foreground font-medium uppercase tracking-wider">
          Carpeta
        </span>
        <span className="text-xs text-muted-foreground">
          {folder.count} {folder.count === 1 ? 'archivo' : 'archivos'}
        </span>
      </div>
    </button>
  );
};
