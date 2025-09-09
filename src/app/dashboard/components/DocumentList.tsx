import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText } from "lucide-react";
import { DocumentCard } from "./DocumentCard";
import { DocumentListItem } from "./DocumentListItem";
import { Document } from "@/app/types";
import { Topic } from "@/app/types";

interface DocumentListProps {
  filteredDocuments: Document[];
  topics: Topic[];
  viewMode: "grid" | "list";
  searchQuery: string;
  deleteDocument: (documentId: string) => void;
}

export const DocumentList: React.FC<DocumentListProps> = ({ filteredDocuments, topics, viewMode, searchQuery, deleteDocument }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Documents
        </CardTitle>
      </CardHeader>
      <CardContent>
        {filteredDocuments.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No documents found</h3>
            <p className="text-muted-foreground">
              {searchQuery ? "Try adjusting your search terms" : "Upload your first document to get started"}
            </p>
          </div>
        ) : (
          <div
            className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" : "space-y-3"}
          >
            {filteredDocuments.map((doc) => {
              const topic = topics.find((t) => t.id === doc.topicId);
              if (viewMode === "grid") {
                return <DocumentCard key={doc.id} doc={doc} topic={topic} deleteDocument={deleteDocument} />;
              } else {
                return <DocumentListItem key={doc.id} doc={doc} topic={topic} deleteDocument={deleteDocument} />;
              }
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
