import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { FileText, MoreHorizontal, Download, Eye, Trash2 } from "lucide-react";
import { Document } from "../hooks/useDocuments";
import { Topic } from "../hooks/useTopics";

interface DocumentCardProps {
  doc: Document;
  topic: Topic | undefined;
}

export const DocumentCard: React.FC<DocumentCardProps> = ({ doc, topic }) => {
  return (
    <Card className="hover:shadow-md transition-shadow cursor-pointer group">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div
              className="p-2 rounded-lg"
              style={{ backgroundColor: topic?.color || "#cccccc" }}
            >
              <FileText className="h-5 w-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-medium truncate text-pretty">{doc.fileName}</h4>
              <p className="text-sm text-muted-foreground">
                {(Number(doc.fileSize) / (1024 * 1024)).toFixed(1)} MB
              </p>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="opacity-0 group-hover:opacity-100 transition-opacity"
              >
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
              <DropdownMenuItem className="text-destructive">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="space-y-2">
          {topic && (
            <Badge variant="secondary" className="text-xs">
              {topic.name}
            </Badge>
          )}
          <div className="flex flex-wrap gap-1">
            {doc?.tags?.map((tag, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
          <p className="text-xs text-muted-foreground">
            Uploaded {new Date(doc.createdAt).toLocaleDateString()}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
