import React from "react";
import { useRouter } from "next/navigation";
import { Inbox, ChevronRight, Upload, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { DocumentCard } from "@/app/workspace/components/DocumentCard";
import { DocumentListItem } from "@/app/workspace/components/DocumentListItem";
import { FolderListItem } from "@/app/workspace/components/FolderListItem";
import { FolderCard } from "@/app/workspace/components/FolderCard";
import FolderIcon from "@/app/icons/Folder";
import { Document, Topic, Folder } from "@/app/types";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

interface DocumentListProps {
  items: (Document | Folder)[];
  selectedFolder: Folder | null;
  topics: Topic[];
  viewMode: "grid" | "list";
  searchQuery: string;
  deleteDocument: (documentId: string) => void;
  hasNextPage?: boolean;
  isFetchingNextPage?: boolean;
  fetchNextPage?: () => void;
  onFolderSelect: (folder: Folder | null) => void;
  onGoBack?: () => void;
  currentPath: { type: 'topic' | 'folder', item: Topic | Folder }[];
  showUploadCta?: boolean;
  onUploadCtaClick?: () => void;
  selectedIds?: Set<string>;
  onToggleSelect?: (id: string) => void;
  allSelected?: boolean;
  onToggleSelectAll?: () => void;
  onToggleDocumentStar?: (id: string, isStarred: boolean) => void;
  onToggleFolderStar?: (id: string, isStarred: boolean) => void;
}

export const DocumentList: React.FC<DocumentListProps> = ({
  items,
  selectedFolder,
  topics,
  viewMode,
  searchQuery,
  deleteDocument,
  hasNextPage,
  isFetchingNextPage,
  fetchNextPage,
  onFolderSelect,
  onGoBack,
  currentPath,
  showUploadCta,
  onUploadCtaClick,
  selectedIds,
  onToggleSelect,
  allSelected,
  onToggleSelectAll,
  onToggleDocumentStar,
  onToggleFolderStar,
}) => {
  const router = useRouter();
  const observerTarget = React.useRef(null);

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage?.();
        }
      },
      { threshold: 0.1 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => {
      if (observerTarget.current) {
        observer.unobserve(observerTarget.current);
      }
    };
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const showEmptyState = items.length === 0;

  if (showEmptyState) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] text-center p-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
        <div className="bg-muted/30 p-6 rounded-full mb-4">
          <Inbox className="h-10 w-10 text-muted-foreground/40" />
        </div>
        <h3 className="text-lg font-semibold text-foreground">No items found</h3>
        <p className="text-sm text-muted-foreground max-w-xs mt-2">
          {searchQuery
            ? "We couldn't find anything matching your search."
            : "Upload your first document or create a folder to get started."}
        </p>
        {!searchQuery && showUploadCta && (
          <Button
            onClick={onUploadCtaClick}
            className="press-feedback mt-5"
            size="sm"
          >
            <Upload className="mr-2 h-4 w-4" />
            Subir documento
          </Button>
        )}
      </div>
    );
  }

  const handleDocumentClick = (docId: string) => {
    router.push(`/document/${docId}`);
  };

  return (
    <div className="flex flex-col h-full w-full">

      {/* Breadcrumb / Path Navigation */}
      {currentPath.length > 0 && (
        <div className="flex items-center gap-1 pb-3 overflow-x-auto">
          {currentPath.map((item, index) => (
            <React.Fragment key={index}>
              {index > 0 && <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  if (item.type === 'topic') {
                    onFolderSelect(null);
                  } else {
                    onFolderSelect(item.item as Folder);
                  }
                }}
                className="press-feedback text-sm h-7 px-2 gap-1 shrink-0"
              >
                {item.type === 'folder' && index < currentPath.length - 1 && (
                  <FolderIcon size="sm" color={(item.item as Folder).color} />
                )}
                {index === 0 ? 'Raíz' : (item.item as Folder).name}
              </Button>
            </React.Fragment>
          ))}
        </div>
      )}

      {/* Header of the table (Only visible in list mode) */}
      {viewMode === "list" && (
        <div className="grid grid-cols-12 gap-4 px-2 py-2 text-xs font-medium text-muted-foreground border-b border-border/60 select-none">
          <div className="col-span-1 flex items-center">
            <button
              onClick={onToggleSelectAll}
              className={cn(
                "press-feedback flex h-5 w-5 items-center justify-center rounded-md border-2 transition-colors duration-150",
                allSelected ? "border-primary bg-primary text-primary-foreground" : "border-border hover:border-primary"
              )}
            >
              {allSelected && <Check className="h-3 w-3" strokeWidth={3} />}
            </button>
          </div>
          <div className="col-span-5">Nombre</div>
          <div className="col-span-2">Modificado</div>
          <div className="col-span-2">Tamaño</div>
          <div className="col-span-2 text-right">Acciones</div>
        </div>
      )}

      {/* List of folders and documents */}
      <div className="flex-1 overflow-y-auto py-2">
        <div
          key={viewMode}
          className={
            viewMode === "grid"
              ? "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 p-2 animate-in fade-in duration-200"
              : "space-y-0.5 animate-in fade-in duration-200"
          }
        >
          {items.map((item, index) => {
            if (item.type === 'folder') {
              const folder = item as Folder;
              const isSelected = selectedIds?.has(folder.id) ?? false;
              return viewMode === "grid" ? (
                <FolderCard
                  key={folder.id}
                  folder={folder}
                  index={index}
                  onClick={() => onFolderSelect(folder)}
                  isSelected={isSelected}
                  onToggleSelect={() => onToggleSelect?.(folder.id)}
                  onToggleStar={() => onToggleFolderStar?.(folder.id, !folder.isStarred)}
                />
              ) : (
                <FolderListItem
                  key={folder.id}
                  folder={folder}
                  onClick={() => onFolderSelect(folder)}
                  isSelected={isSelected}
                  onToggleSelect={() => onToggleSelect?.(folder.id)}
                  onToggleStar={() => onToggleFolderStar?.(folder.id, !folder.isStarred)}
                />
              );
            } else {
              const doc = item as Document;
              const topic = topics.find((t) => t.id === doc.topicId);

              const isSelected = selectedIds?.has(doc.id) ?? false;

              return viewMode === "grid" ? (
                <DocumentCard
                  key={doc.id}
                  doc={doc}
                  topic={topic}
                  index={index}
                  deleteDocument={deleteDocument}
                  onClick={() => handleDocumentClick(doc.id)}
                  isSelected={isSelected}
                  onToggleSelect={() => onToggleSelect?.(doc.id)}
                  onToggleStar={() => onToggleDocumentStar?.(doc.id, !doc.isStarred)}
                />
              ) : (
                <DocumentListItem
                  key={doc.id}
                  doc={doc}
                  topic={topic}
                  deleteDocument={deleteDocument}
                  onClick={() => handleDocumentClick(doc.id)}
                  isSelected={isSelected}
                  onToggleSelect={() => onToggleSelect?.(doc.id)}
                  onToggleStar={() => onToggleDocumentStar?.(doc.id, !doc.isStarred)}
                />
              );
            }
          })}

          {isFetchingNextPage && viewMode === "grid" &&
            Array.from({ length: 3 }).map((_, i) => (
              <div key={`skeleton-${i}`} className="flex flex-col gap-2 p-2">
                <Skeleton className="aspect-[4/3] w-full rounded-lg" />
                <div className="space-y-1.5 px-1">
                  <Skeleton className="h-3.5 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              </div>
            ))}
        </div>

        {isFetchingNextPage && viewMode === "list" && (
          <div className="space-y-2 px-2 py-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={`skeleton-row-${i}`} className="h-10 w-full" />
            ))}
          </div>
        )}

        {/* Intersection Observer Target */}
        <div ref={observerTarget} className="h-10 w-full flex items-center justify-center mt-4">
          {!hasNextPage && items.length > 0 && (
            <span className="text-xs text-muted-foreground italic">No more items</span>
          )}
        </div>
      </div>
    </div>
  );
};