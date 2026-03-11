import React from "react";
import { useRouter } from "next/navigation";
import { Inbox, ChevronRight } from "lucide-react";
import { DocumentCard } from "@/app/workspace/components/DocumentCard";
import { DocumentListItem } from "@/app/workspace/components/DocumentListItem";
import { FolderListItem } from "@/app/workspace/components/FolderListItem";
import { FolderCard } from "@/app/workspace/components/FolderCard";
import FolderIcon from "@/app/icons/Folder";
import { Document, Topic, Folder } from "@/app/types";
import { Button } from "@/components/ui/button";

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
      <div className="flex flex-col items-center justify-center h-[50vh] text-center p-8 animate-in fade-in zoom-in-95 duration-300">
        <div className="bg-muted/30 p-6 rounded-full mb-4">
          <Inbox className="h-10 w-10 text-muted-foreground/40" />
        </div>
        <h3 className="text-lg font-semibold text-foreground">No items found</h3>
        <p className="text-sm text-muted-foreground max-w-xs mt-2">
          {searchQuery
            ? "We couldn't find anything matching your search."
            : "Upload your first document or create a folder to get started."}
        </p>
      </div>
    );
  }

  const handleDocumentClick = (docId: string) => {
    router.push(`/document/${docId}`);
  };

  return (
    <div className="flex flex-col h-full w-full bg-secondary rounded-2xl">

      {/* Breadcrumb / Path Navigation */}
      {currentPath.length > 0 && (
        <div className="flex items-center gap-1 px-4 py-3 border-b border-border/40 overflow-x-auto">
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
                className="text-sm h-7 px-2 gap-1 shrink-0"
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
        <div className="grid grid-cols-12 gap-4 px-6 py-3 text-xs font-medium text-muted-foreground border-b border-border/40 select-none">
          <div className="col-span-6 pl-2">Name</div>
          <div className="col-span-3">Opened</div>
          <div className="col-span-2">Owner</div>
          <div className="col-span-1 text-right">Activity</div>
        </div>
      )}

      {/* List of folders and documents */}
      <div className="flex-1 overflow-y-auto px-4 py-2">
        <div
          className={
            viewMode === "grid"
              ? "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 p-2"
              : "space-y-0.5"
          }
        >
          {items.map((item) => {
            if (item.type === 'folder') {
              const folder = item as Folder;
              return viewMode === "grid" ? (
                <FolderCard
                  key={folder.id}
                  folder={folder}
                  onClick={() => onFolderSelect(folder)}
                />
              ) : (
                <FolderListItem
                  key={folder.id}
                  folder={folder}
                  onClick={() => onFolderSelect(folder)}
                />
              );
            } else {
              const doc = item as Document;
              const topic = topics.find((t) => t.id === doc.topicId);

              return viewMode === "grid" ? (
                <DocumentCard
                  key={doc.id}
                  doc={doc}
                  topic={topic}
                  deleteDocument={deleteDocument}
                  onClick={() => handleDocumentClick(doc.id)}
                />
              ) : (
                <DocumentListItem
                  key={doc.id}
                  doc={doc}
                  topic={topic}
                  deleteDocument={deleteDocument}
                  onClick={() => handleDocumentClick(doc.id)}
                />
              );
            }
          })}
        </div>

        {/* Intersection Observer Target */}
        <div ref={observerTarget} className="h-10 w-full flex items-center justify-center mt-4">
          {isFetchingNextPage && (
            <div className="flex items-center gap-2 text-muted-foreground animate-pulse">
              <div className="h-2 w-2 bg-muted-foreground rounded-full animate-bounce" />
              <div className="h-2 w-2 bg-muted-foreground rounded-full animate-bounce [animation-delay:0.2s]" />
              <div className="h-2 w-2 bg-muted-foreground rounded-full animate-bounce [animation-delay:0.4s]" />
              <span className="text-xs ml-2">Loading more...</span>
            </div>
          )}
          {!hasNextPage && items.length > 0 && (
            <span className="text-xs text-muted-foreground italic">No more items</span>
          )}
        </div>
      </div>
    </div>
  );
};