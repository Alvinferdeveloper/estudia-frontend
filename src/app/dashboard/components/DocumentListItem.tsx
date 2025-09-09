import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { FileText, MoreHorizontal, Download, Eye } from "lucide-react";
import { Document } from "@/app/types";
import { Topic } from "@/app/types";
import { DeleteConfirmationDialog } from "./DeleteConfirmationDialog";

interface DocumentListItemProps {
  doc: Document;
  topic: Topic | undefined;
  deleteDocument: (documentId: string) => void;
}

export const DocumentListItem: React.FC<DocumentListItemProps> = ({ doc, topic, deleteDocument }) => {
  return (
    <div className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors">
      <div className="flex items-center gap-4">
        <div
          className="p-2 rounded-lg"
          style={{ backgroundColor: topic?.color || "#cccccc" }}
        >
          <FileText className="h-5 w-5 text-white" />
        </div>
        <div>
          <h4 className="font-medium">{doc.fileName}</h4>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span>{(Number(doc.fileSize) / (1024 * 1024)).toFixed(1)} MB</span>
            <span>•</span>
            <span>{new Date(doc.createdAt).toLocaleDateString()}</span>
            {topic && (
              <>
                <span>•</span>
                <Badge variant="secondary" className="text-xs">
                  {topic.name}
                </Badge>
              </>
            )}
            {doc.tags.length > 0 && (
              <>
                <span>•</span>
                <div className="flex flex-wrap gap-1">
                  {doc.tags.map((tag, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem>
            <a href={`/document/${doc.id}`} className="flex items-center w-full">
              <Eye className="mr-2 h-4 w-4" />
              View
            </a>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <a href={doc.filePath} target="_blank" rel="noopener noreferrer" className="flex items-center w-full">
              <Download className="mr-2 h-4 w-4" />
              Download
            </a>
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
            <DeleteConfirmationDialog onConfirm={() => deleteDocument(doc.id)} />
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
