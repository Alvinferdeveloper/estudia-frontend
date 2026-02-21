import React from "react";
import { format } from "date-fns";
import {
  MoreHorizontal,
  Share2,
  Star,
  FileText,
} from "lucide-react";
import { Document, Topic } from "@/app/types";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface DocumentListItemProps {
  doc: Document;
  topic?: Topic;
  deleteDocument: (id: string) => void;
}


export const DocumentListItem: React.FC<DocumentListItemProps> = ({ doc, topic, deleteDocument }) => {
  const formattedDate = doc.createdAt
    ? format(new Date(doc.createdAt), "MMM d, yyyy")
    : "Unknown";

  const router = useRouter();

  const handleOpenDocument = () => {
    router.push(`/document/${doc.id}`);
  };

  return (
    <div className="group flex items-center w-full rounded-md hover:bg-background/10 transition-colors px-2 py-2 cursor-pointer border-b border-border/30 last:border-0">
      <div className="grid grid-cols-12 gap-4 w-full items-center">

        {/* Columna: Name ( 6 spaces) */}
        <div className="col-span-6 flex items-center gap-3 overflow-hidden">
          <div className="flex-shrink-0">
            <FileText className="h-5 w-5 text-red-600" />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-sm font-medium truncate text-foreground/90 group-hover:text-primary transition-colors">
              {doc.fileName}
            </span>
            <span className="text-[11px] text-muted-foreground truncate">
              {topic?.name || "My Files"}
            </span>
          </div>
        </div>

        {/* Columna: Opened/Date ( 3 spaces) */}
        <div className="col-span-3 text-xs text-muted-foreground">
          {formattedDate}
        </div>

        {/* Columna: Owner ( 2 spaces) */}
        <div className="col-span-2 text-xs text-muted-foreground truncate">
          You
        </div>

        {/* Columna: Activity / Actions ( 1 space, aligned to right) */}
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
              <Button variant="default" size="icon" className="h-7 w-7">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem className="cursor-pointer" onClick={() => handleOpenDocument()}>Open</DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer" onClick={() => console.log("Rename")}>Rename</DropdownMenuItem>
              <DropdownMenuItem
                className="text-red-600 focus:text-red-600 cursor-pointer"
                onClick={(e) => { e.stopPropagation(); deleteDocument(doc.id); }}
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

      </div>
    </div>
  );
};