import { Button } from "@/components/ui/button";
import { Grid3X3, List, LayoutGrid, ArrowLeft, FolderPlus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Folder, Topic } from "@/app/types";

interface HeaderProps {
  selectedTopic: Topic | null;
  selectedFolder: Folder | null;
  totalDocuments: number;
  viewMode: "grid" | "list";
  setViewMode: (mode: "grid" | "list") => void;
  onGoBack?: () => void;
  createFolderDialog?: React.ReactNode;
}

export const Header: React.FC<HeaderProps> = ({ 
  selectedTopic, 
  selectedFolder, 
  totalDocuments, 
  viewMode, 
  setViewMode,
  onGoBack,
  createFolderDialog,
}) => {
  return (
    <header className="px-8 py-5 flex items-center justify-between bg-background/50 backdrop-blur-sm sticky top-0 z-10">
      <div className="flex items-center gap-4">
        {onGoBack && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onGoBack}
            className="h-8 w-8"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
        )}
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2 text-foreground">
            {selectedFolder ? (
              <>
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: selectedFolder.color || "#000000" }} />
                {selectedFolder.name}
              </>
            ) : selectedTopic ? (
              <>
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: selectedTopic.color || "#000000" }} />
                {selectedTopic.name}
              </>
            ) : (
              <>
                <LayoutGrid className="w-5 h-5 text-muted-foreground" />
                All Documents
              </>
            )}
          </h1>
          <p className="text-sm text-muted-foreground">
            {totalDocuments} {totalDocuments === 1 ? "document" : "documents"} available
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {selectedTopic && createFolderDialog && (
          <div className="flex items-center">
            {createFolderDialog}
          </div>
        )}
        <div className="flex items-center gap-1 bg-secondary p-1 rounded-lg">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setViewMode("grid")}
            className={cn(
              "h-8 w-8 p-0 cursor-pointer hover:bg-background/50 transition-all",
              viewMode === "grid" && "bg-background text-foreground shadow-sm"
            )}
          >
            <Grid3X3 className="h-4 w-4" />
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setViewMode("list")}
            className={cn(
              "h-8 w-8 p-0 cursor-pointer hover:bg-background/50 transition-all",
              viewMode === "list" && "bg-background text-foreground shadow-sm"
            )}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  );
};
