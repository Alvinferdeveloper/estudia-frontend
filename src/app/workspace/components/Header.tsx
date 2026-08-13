import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Search,
  Grid3X3,
  List,
  LayoutGrid,
  ArrowLeft,
  Clock,
  ArrowUpDown,
  X,
  Trash2,
  Download,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Folder, Topic } from "@/app/types";
import { UserProfileMenu } from "@/components/user-profile-menu";

export type SortBy = "name" | "date";

interface HeaderProps {
  view: "recent" | "topic";
  selectedTopic: Topic | null;
  selectedFolder: Folder | null;
  totalDocuments: number;
  viewMode: "grid" | "list";
  setViewMode: (mode: "grid" | "list") => void;
  onGoBack?: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  sortBy: SortBy;
  setSortBy: (sort: SortBy) => void;
  selectedCount: number;
  onClearSelection: () => void;
  onBulkDelete: () => void;
  onBulkDownload: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  view,
  selectedTopic,
  selectedFolder,
  totalDocuments,
  viewMode,
  setViewMode,
  onGoBack,
  searchQuery,
  setSearchQuery,
  sortBy,
  setSortBy,
  selectedCount,
  onClearSelection,
  onBulkDelete,
  onBulkDownload,
}) => {
  const hasSelection = selectedCount > 0;

  return (
    <header className="flex items-center justify-between gap-4 border-b border-border/60 bg-background px-6 py-3.5">
      {hasSelection ? (
        <div className="flex w-full items-center gap-3 animate-in fade-in slide-in-from-top-1 duration-200">
          <button
            onClick={onClearSelection}
            className="press-feedback flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground transition-colors duration-150 hover:bg-accent hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
          <span className="text-sm font-medium tabular-nums">
            {selectedCount} seleccionado{selectedCount === 1 ? "" : "s"}
          </span>
          <div className="ml-auto flex items-center gap-2">
            <Button variant="outline" size="sm" className="press-feedback gap-2" onClick={onBulkDownload}>
              <Download className="h-3.5 w-3.5" />
              Descargar
            </Button>
            <Button variant="outline" size="sm" className="press-feedback gap-2 text-destructive hover:text-destructive" onClick={onBulkDelete}>
              <Trash2 className="h-3.5 w-3.5" />
              Eliminar
            </Button>
          </div>
        </div>
      ) : (
        <>
          <div className="flex min-w-0 items-center gap-3">
            {onGoBack && (
              <button
                onClick={onGoBack}
                className="press-feedback flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors duration-150 hover:bg-accent hover:text-foreground"
              >
                <ArrowLeft className="h-4 w-4" />
              </button>
            )}
            <div className="min-w-0">
              <h1 className="flex items-center gap-2 truncate text-lg font-semibold tracking-tight text-foreground">
                {view === "recent" ? (
                  <>
                    <Clock className="h-4 w-4 shrink-0 text-muted-foreground" />
                    Recientes
                  </>
                ) : selectedFolder ? (
                  <>
                    <span className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: selectedFolder.color || "var(--muted-foreground)" }} />
                    {selectedFolder.name}
                  </>
                ) : selectedTopic ? (
                  <>
                    <span className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: selectedTopic.color || "var(--muted-foreground)" }} />
                    {selectedTopic.name}
                  </>
                ) : (
                  <>
                    <LayoutGrid className="h-4 w-4 shrink-0 text-muted-foreground" />
                    Todos los documentos
                  </>
                )}
              </h1>
              <p className="text-xs text-muted-foreground">
                {totalDocuments} documento{totalDocuments === 1 ? "" : "s"}
              </p>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <div className="relative hidden sm:block">
              <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground/70" />
              <Input
                placeholder="Buscar..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-8 w-44 border-transparent bg-secondary/60 pl-8 text-sm transition-all focus-visible:w-64 focus-visible:bg-background focus-visible:ring-1"
              />
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="press-feedback h-8 gap-1.5 px-2 text-muted-foreground">
                  <ArrowUpDown className="h-3.5 w-3.5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setSortBy("name")} className={cn(sortBy === "name" && "font-medium text-primary")}>
                  Ordenar por nombre
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy("date")} className={cn(sortBy === "date" && "font-medium text-primary")}>
                  Ordenar por fecha
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <div className="flex items-center gap-0.5 rounded-lg bg-secondary p-0.5">
              <button
                onClick={() => setViewMode("grid")}
                className={cn(
                  "press-feedback flex h-7 w-7 items-center justify-center rounded-md transition-all duration-150",
                  viewMode === "grid" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Grid3X3 className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={cn(
                  "press-feedback flex h-7 w-7 items-center justify-center rounded-md transition-all duration-150",
                  viewMode === "list" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                )}
              >
                <List className="h-3.5 w-3.5" />
              </button>
            </div>

            <div className="ml-1 h-6 w-px bg-border" />

            <UserProfileMenu />
          </div>
        </>
      )}
    </header>
  );
};
