"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/app/lib/auth-client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { PlusCircle, Upload, Search, FileText, MoreHorizontal, Grid3X3, List, Download, Eye, Trash2, Folder } from "lucide-react";

interface Topic {
  id: string;
  name: string;
  color: string;
  count: number;
}

interface Document {
  id: string;
  fileName: string;
  filePath: string;
  mimeType: string;
  createdAt: string;
  fileSize: string;
  topicId: string | null;
  tags: string[];
}

export default function Dashboard() {
  const router = useRouter();
  const [topics, setTopics] = useState<Topic[]>([]);
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [newTopicName, setNewTopicName] = useState("");
  const [newTopicColor, setNewTopicColor] = useState("#000000");
  const [isCreatingTopic, setIsCreatingTopic] = useState(false);
  const [isUploadingDocument, setIsUploadingDocument] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadMessage, setUploadMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [documentTags, setDocumentTags] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const checkAuthAndFetchData = async () => {
      const session = await authClient.getSession();
      if (!session || !session.data || !session.data.user) {
        router.push("/login");
        return;
      }
      fetchTopics();
      fetchDocuments(); // Fetch all documents initially
    };
    checkAuthAndFetchData();
  }, [router]);

  const filteredDocuments = documents.filter((doc) => {
    const matchesTopic = !selectedTopic || doc.topicId === selectedTopic.id;
    const matchesSearch =
      !searchQuery ||
      doc.fileName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesTopic && matchesSearch;
  });

  const fetchTopics = async () => {
    try {
      const response = await fetch("http://localhost:3001/topics", {
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      if (response.ok) {
        const data = await response.json();
        setTopics(data);
      } else {
        console.error("Failed to fetch topics");
      }
    } catch (error) {
      console.error("Error fetching topics:", error);
    }
  };

  const createTopic = async () => {
    if (!newTopicName.trim()) return;
    try {
      const response = await fetch("http://localhost:3001/topics", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ name: newTopicName, color: newTopicColor }),
      });
      if (response.ok) {
        setNewTopicName("");
        setNewTopicColor("#000000");
        setIsCreatingTopic(false);
        fetchTopics(); // Refresh topics list
      } else {
        console.error("Failed to create topic");
      }
    } catch (error) {
      console.error("Error creating topic:", error);
    }
  };

  const fetchDocuments = async (topicId?: string) => {
    try {
      const url = topicId
        ? `http://localhost:3001/documents?topicId=${topicId}`
        : `http://localhost:3001/documents`;
      const response = await fetch(url, {
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      if (response.ok) {
        const data = await response.json();
        setDocuments(data);
      } else {
        console.error("Failed to fetch documents");
      }
    } catch (error) {
      console.error("Error fetching documents:", error);
    }
  };

  console.log(documents)
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

  const handleTopicSelect = (topic: Topic | null) => {
    setSelectedTopic(topic);
    fetchDocuments(topic?.id);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
      setUploadMessage("");
    } else {
      setSelectedFile(null);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setUploadMessage("Please select a file to upload.");
      return;
    }

    if (selectedFile.type !== "application/pdf") {
      setUploadMessage("Only PDF files are allowed.");
      return;
    }

    setIsUploadingDocument(true);
    setUploadMessage("Uploading...");

    const formData = new FormData();
    formData.append("file", selectedFile);
    if (selectedTopic) {
      formData.append("topicId", selectedTopic.id);
    }
    if (documentTags.trim()) {
      formData.append("tags", documentTags.trim());
    }

    try {
      const response = await fetch("http://localhost:3001/documents/upload", {
        method: "POST",
        body: formData,
        credentials: "include"
      });

      if (response.ok) {
        setUploadMessage("File uploaded successfully!");
        setSelectedFile(null);
        setDocumentTags("");
        fetchDocuments(selectedTopic?.id); // Refresh documents list
      } else {
        const errorData = await response.json();
        setUploadMessage(`Upload failed: ${errorData.message || response.statusText}`);
      }
    } catch (error) {
      console.error("Error during upload:", error);
      setUploadMessage("An error occurred during upload.");
    } finally {
      setIsUploadingDocument(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      {/* Enhanced Sidebar */}
      <aside className="w-80 bg-card shadow-lg border-r border-border flex flex-col">
        <div className="p-6 border-b border-border">
          <h2 className="text-2xl font-bold text-foreground mb-4">StudyDocs</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search documents..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="p-6 flex-1 overflow-y-auto">
          <Button
            variant={!selectedTopic ? "default" : "ghost"}
            onClick={() => handleTopicSelect(null)}
            className="w-full justify-start mb-4 h-12"
          >
            <FileText className="mr-3 h-5 w-5" />
            <div className="flex-1 text-left">
              <div className="font-medium">All Documents</div>
              <div className="text-xs text-muted-foreground">{documents.length} files</div>
            </div>
          </Button>

          <Separator className="my-4" />

          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">Topics</h3>
            {topics.map((topic) => (
              <Button
                key={topic.id}
                variant={selectedTopic?.id === topic.id ? "default" : "ghost"}
                onClick={() => handleTopicSelect(topic)}
                className="w-full justify-start h-12 group"
              >
                <div
                  className="mr-3 p-1.5 rounded-md"
                  style={{ backgroundColor: topic.color || "#000000" }}
                >
                  <Folder className="h-4 w-4 text-white" />
                </div>
                <div className="flex-1 text-left">
                  <div className="font-medium">{topic.name}</div>
                  <div className="text-xs text-muted-foreground">{topic.count} files</div>
                </div>
              </Button>
            ))}
          </div>
        </div>

        <div className="p-6 border-t border-border">
          <Dialog open={isCreatingTopic} onOpenChange={setIsCreatingTopic}>
            <DialogTrigger asChild>
              <Button className="w-full">
                <PlusCircle className="mr-2 h-4 w-4" /> Create New Topic
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Topic</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Name
                  </Label>
                  <Input
                    id="name"
                    value={newTopicName}
                    onChange={(e) => setNewTopicName(e.target.value)}
                    className="col-span-3"
                    placeholder="e.g., Chemistry, Art History"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="color" className="text-right">
                    Color
                  </Label>
                  <Input
                    id="color"
                    type="color"
                    value={newTopicColor}
                    onChange={(e) => setNewTopicColor(e.target.value)}
                    className="col-span-3 h-10"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCreatingTopic(false)}>
                  Cancel
                </Button>
                <Button onClick={createTopic}>Create</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </aside>

      {/* Enhanced Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
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

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Upload Section */}
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
                    <Button onClick={handleUpload} disabled={isUploadingDocument} className="min-w-[100px]">
                      {isUploadingDocument ? "Uploading..." : "Upload"}
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

          {/* Documents Section */}
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
                    console.log(doc)
                    if (viewMode === "grid") {
                      return (
                        <Card key={doc.id} className="hover:shadow-md transition-shadow cursor-pointer group">
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
                    } else {
                      return (
                        <div
                          key={doc.id}
                          className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors"
                        >
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
                              <DropdownMenuItem className="text-destructive">
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      );
                    }
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
