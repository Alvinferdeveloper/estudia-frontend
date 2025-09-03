import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, FileText } from "lucide-react";

interface UploadSectionProps {
  selectedTopic: any;
  uploadDocument: (formData: FormData) => void;
  isUploading: boolean;
}

export const UploadSection: React.FC<UploadSectionProps> = ({ selectedTopic, uploadDocument, isUploading }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [documentTags, setDocumentTags] = useState("");
  const [uploadMessage, setUploadMessage] = useState("");
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
      setUploadMessage("");
    } else {
      setSelectedFile(null);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files.length > 0 && files[0].type === "application/pdf") {
      setSelectedFile(files[0]);
    }
  };

  const handleUpload = () => {
    if (!selectedFile) {
      setUploadMessage("Please select a file to upload.");
      return;
    }

    if (selectedFile.type !== "application/pdf") {
      setUploadMessage("Only PDF files are allowed.");
      return;
    }

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
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          Upload New Document {selectedTopic && `to ${selectedTopic.name}`}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div
          className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors"
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <div className="space-y-2">
            <p className="text-lg font-medium">Drop your PDF here or click to browse</p>
            <p className="text-sm text-muted-foreground">Supports PDF files up to 10MB</p>
          </div>
          <Input
            ref={fileInputRef}
            type="file"
            accept="application/pdf"
            onChange={handleFileChange}
            className="hidden"
          />
          <Button variant="outline" className="mt-4 bg-transparent" onClick={() => fileInputRef.current?.click()}>
            Choose File
          </Button>
        </div>

        {selectedFile && (
          <div className="mt-4 p-4 bg-muted rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FileText className="h-8 w-8 text-primary" />
                <div>
                  <p className="font-medium">{selectedFile.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {(selectedFile.size / (1024 * 1024)).toFixed(1)} MB
                  </p>
                </div>
              </div>
              <Button onClick={handleUpload} disabled={isUploading} className="min-w-[100px]">
                {isUploading ? "Uploading..." : "Upload"}
              </Button>
            </div>
            <div className="mt-4">
              <Label htmlFor="document-tags">Tags (comma-separated)</Label>
              <Input
                id="document-tags"
                value={documentTags}
                onChange={(e) => setDocumentTags(e.target.value)}
                placeholder="e.g., chemistry, notes, exam"
              />
            </div>
          </div>
        )}

        {uploadMessage && (
          <div className="mt-4 p-3 bg-primary/10 text-primary rounded-lg text-center">{uploadMessage}</div>
        )}
      </CardContent>
    </Card>
  );
};
