import { Button } from "@/components/ui/button";
import { Grid3X3, List, LayoutGrid } from "lucide-react";
import { cn } from "@/lib/utils";

interface HeaderProps {
  selectedTopic: any;
  filteredDocuments: any[];
  viewMode: "grid" | "list";
  setViewMode: (mode: "grid" | "list") => void;
}

export const Header: React.FC<HeaderProps> = ({ selectedTopic, filteredDocuments, viewMode, setViewMode }) => {
  return (
    <header className="px-8 py-5 flex items-center justify-between bg-background/50 backdrop-blur-sm sticky top-0 z-10">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2 text-foreground">
          {selectedTopic ? (
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
          {filteredDocuments.length} {filteredDocuments.length === 1 ? "document" : "documents"} available
        </p>
      </div>

      <div className="flex items-center gap-1 bg-muted/50 p-1 rounded-lg">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setViewMode("grid")}
          className={cn(
            "h-8 w-8 p-0 hover:bg-background transition-all",
            viewMode === "grid" && "bg-background text-foreground shadow-sm"
          )}
        >
          <Grid3X3 className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setViewMode("list")}
          className={cn(
            "h-8 w-8 p-0 hover:bg-background transition-all",
            viewMode === "list" && "bg-background text-foreground shadow-sm"
          )}
        >
          <List className="h-4 w-4" />
        </Button>
      </div>
    </header>
  );
};
