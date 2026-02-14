import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload, FileText, X, Paperclip } from "lucide-react";
import { cn } from "@/lib/utils";

interface UploadSectionProps {
  selectedTopic: any;
  uploadDocument: (formData: FormData) => void;
  isUploading: boolean;
}

export const UploadSection: React.FC<UploadSectionProps> = ({ selectedTopic, uploadDocument, isUploading }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [documentTags, setDocumentTags] = useState("");
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      validateAndSetFile(event.target.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      validateAndSetFile(files[0]);
    }
  };

  const validateAndSetFile = (file: File) => {
    if (file.type !== "application/pdf") {
      alert("Only PDF files are allowed.");
      return;
    }
    setSelectedFile(file);
  };

  const handleUpload = () => {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append("file", selectedFile);
    if (selectedTopic) {
      formData.append("topicId", selectedTopic.id);
    }
    if (documentTags.trim()) {
      formData.append("tags", documentTags.trim());
    }

    uploadDocument(formData);
    setSelectedFile(null);
    setDocumentTags("");
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-2">
      {!selectedFile ? (
        <div
          onClick={() => fileInputRef.current?.click()}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={cn(
            "group relative flex items-center justify-center w-full h-24 rounded-xl border-2 border-dashed transition-all cursor-pointer overflow-hidden",
            isDragOver
              ? "border-primary bg-primary/5 scale-[1.01]"
              : "border-border hover:border-primary/50 hover:bg-muted/30"
          )}
        >
          <div className="flex flex-col items-center gap-1.5 transition-transform group-hover:scale-105">
            <div className="p-2 rounded-full bg-background shadow-sm ring-1 ring-border">
              <Upload className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
            </div>
            <p className="text-sm text-muted-foreground font-medium">
              <span className="text-foreground">Click to upload</span> or drag and drop
            </p>
          </div>
          <Input
            ref={fileInputRef}
            type="file"
            accept="application/pdf"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>
      ) : (
        <div className="bg-card rounded-xl border shadow-sm p-4 animate-in fade-in zoom-in-95 duration-200">
          <div className="flex items-start gap-4">
            <div className="shrink-0 p-3 rounded-lg bg-primary/10 text-primary">
              <FileText className="h-6 w-6" />
            </div>

            <div className="flex-1 space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-medium text-foreground truncate max-w-[300px]">{selectedFile.name}</h4>
                  <p className="text-xs text-muted-foreground">
                    {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB • {selectedTopic ? `Topic: ${selectedTopic.name}` : "No Topic Selected"}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 rounded-full hover:bg-destructive/10 hover:text-destructive -mt-1 -mr-1"
                  onClick={() => setSelectedFile(null)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <Input
                    value={documentTags}
                    onChange={(e) => setDocumentTags(e.target.value)}
                    placeholder="Add tags separated by commas..."
                    className="h-9 text-sm pr-8"
                  />
                  <Paperclip className="h-3.5 w-3.5 absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/50" />
                </div>
                <Button
                  onClick={handleUpload}
                  disabled={isUploading}
                  className="h-9 px-6 font-medium"
                >
                  {isUploading ? (
                    <span className="flex items-center gap-2">Uploading...</span>
                  ) : (
                    "Upload File"
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
