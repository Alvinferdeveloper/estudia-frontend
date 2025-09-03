import { Button } from "@/components/ui/button";
import { Grid3X3, List } from "lucide-react";

interface HeaderProps {
  selectedTopic: any;
  filteredDocuments: any[];
  viewMode: "grid" | "list";
  setViewMode: (mode: "grid" | "list") => void;
}

export const Header: React.FC<HeaderProps> = ({ selectedTopic, filteredDocuments, viewMode, setViewMode }) => {
  return (
    <header className="bg-card border-b border-border p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground text-balance">
            {selectedTopic ? selectedTopic.name : "All Documents"}
          </h1>
          <p className="text-muted-foreground mt-1">
            {filteredDocuments.length} document{filteredDocuments.length !== 1 ? "s" : ""} found
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === "grid" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("grid")}
          >
            <Grid3X3 className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === "list" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("list")}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  );
};
