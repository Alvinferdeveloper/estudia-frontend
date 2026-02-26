import React from "react";
import { Inbox } from "lucide-react";
import { DocumentCard } from "@/app/dashboard/components/DocumentCard";
import { DocumentListItem } from "@/app/dashboard/components/DocumentListItem";
import { Document, Topic } from "@/app/types";

interface DocumentListProps {
  filteredDocuments: Document[];
  topics: Topic[];
  viewMode: "grid" | "list";
  searchQuery: string;
  deleteDocument: (documentId: string) => void;
  hasNextPage?: boolean;
  isFetchingNextPage?: boolean;
  fetchNextPage?: () => void;
}

export const DocumentList: React.FC<DocumentListProps> = ({
  filteredDocuments,
  topics,
  viewMode,
  searchQuery,
  deleteDocument,
  hasNextPage,
  isFetchingNextPage,
  fetchNextPage,
}) => {
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

  if (filteredDocuments.length === 0) {
    // ...
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] text-center p-8 animate-in fade-in zoom-in-95 duration-300">
        <div className="bg-muted/30 p-6 rounded-full mb-4">
          <Inbox className="h-10 w-10 text-muted-foreground/40" />
        </div>
        <h3 className="text-lg font-semibold text-foreground">No documents found</h3>
        <p className="text-sm text-muted-foreground max-w-xs mt-2">
          {searchQuery
            ? "We couldn't find anything matching your search."
            : "Upload your first document to get started."}
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full w-full bg-secondary rounded-2xl">

      {/* Header of the table (Only visible in list mode) */}
      {viewMode === "list" && (
        <div className="grid grid-cols-12 gap-4 px-6 py-3 text-xs font-medium text-muted-foreground border-b border-border/40 select-none">
          <div className="col-span-6 pl-2">Name</div>
          <div className="col-span-3">Opened</div>
          <div className="col-span-2">Owner</div>
          <div className="col-span-1 text-right">Activity</div>
        </div>
      )}

      {/* List of documents */}
      <div className="flex-1 overflow-y-auto px-4 py-2">
        <div
          className={
            viewMode === "grid"
              ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-2"
              : "space-y-0.5"
          }
        >
          {filteredDocuments.map((doc) => {
            const topic = topics.find((t) => t.id === doc.topicId);

            // Pass additional props for styling
            const commonProps = {
              key: doc.id,
              doc,
              topic,
              deleteDocument
            };

            return viewMode === "grid" ? (
              <DocumentCard {...commonProps} />
            ) : (
              <DocumentListItem {...commonProps} />
            );
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
          {!hasNextPage && filteredDocuments.length > 0 && (
            <span className="text-xs text-muted-foreground italic">No more documents</span>
          )}
        </div>
      </div>
    </div>
  );
};