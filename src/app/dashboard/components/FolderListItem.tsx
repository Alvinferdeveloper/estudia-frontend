import React from "react";
import {
  MoreHorizontal,
  Share2,
  Star,
} from "lucide-react";
import FolderIcon from "@/app/icons/Folder";
import { Folder } from "@/app/types";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface FolderListItemProps {
  folder: Folder;
  onClick?: () => void;
}

export const FolderListItem: React.FC<FolderListItemProps> = ({ folder, onClick }) => {

  return (
    <div
      className="group flex items-center w-full rounded-md hover:bg-background/10 transition-colors px-2 py-2 cursor-pointer border-b border-border/30 last:border-0"
      onClick={onClick}
    >
      <div className="grid grid-cols-12 gap-4 w-full items-center">

        {/* Columna: Name (6 spaces) */}
        <div className="col-span-6 flex items-center gap-3 overflow-hidden">
          <div className="flex-shrink-0">
            <FolderIcon size="md" color={folder.color} />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-sm font-medium truncate text-foreground/90 group-hover:text-primary transition-colors">
              {folder.name}
            </span>
            <span className="text-[11px] text-muted-foreground truncate">
              {folder.count} {folder.count === 1 ? 'archivo' : 'archivos'}
            </span>
          </div>
        </div>

        {/* Columna: Opened/Date (3 spaces) */}
        <div className="col-span-3 text-xs text-muted-foreground">
          {folder.subfoldersCount > 0 && `${folder.subfoldersCount} carpetas`}
        </div>

        {/* Columna: Owner (2 spaces) */}
        <div className="col-span-2 text-xs text-muted-foreground truncate">
          Carpeta
        </div>

        {/* Columna: Activity / Actions (1 space, aligned to right) */}
        <div className="col-span-1 flex justify-end items-center opacity-0 group-hover:opacity-100 transition-opacity">

          {/* Action Buttons (Share & Star) */}
          <div className="flex items-center mr-1">
            <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-foreground hover:bg-primary/20">
              <Share2 className="h-3.5 w-3.5" />
            </Button>
            <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-yellow-500 hover:bg-primary/20">
              <Star className="h-3.5 w-3.5" />
            </Button>
          </div>

          {/* Menu Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="default"
                size="icon"
                className="h-7 w-7"
                onClick={(e) => e.stopPropagation()}
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem className="cursor-pointer" onClick={() => console.log("Rename")}>Rename</DropdownMenuItem>
              <DropdownMenuItem className="text-red-600 focus:text-red-600 cursor-pointer" onClick={(e) => { e.stopPropagation(); console.log("Delete"); }}>
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

      </div>
    </div>
  );
};
