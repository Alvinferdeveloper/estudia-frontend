"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/app/lib/auth-client";
import { useFetchTopics } from "./hooks/useFetchTopics";
import { useFetchDocuments } from "./hooks/useFetchDocuments";
import { useUploadDocument } from "./hooks/useUploadDocument";
import { useDeleteDocument } from "./hooks/useDeleteDocument";
import { Sidebar } from "./components/Sidebar";
import { Header } from "./components/Header";
import { UploadSection } from "./components/UploadSection";
import { DocumentList } from "./components/DocumentList";
import { QueryProvider } from "../providers/QueryProvider";
import { Document } from "@/app/types";

const DashboardPage = () => {
  const router = useRouter();
  const [selectedTopic, setSelectedTopic] = useState<any | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  useEffect(() => {
    const checkAuth = async () => {
      const session = await authClient.getSession();
      if (!session || !session.data || !session.data.user) {
        router.push("/login");
      }
    };
    checkAuth();
  }, [router]);

  const { data: topics } = useFetchTopics();
  const { data: documents } = useFetchDocuments(selectedTopic?.id);
  const { mutate: uploadDocument, isPending: isUploading } = useUploadDocument(selectedTopic?.id);
  const { mutate: deleteDocument } = useDeleteDocument(selectedTopic?.id);

  const filteredDocuments = (documents || []).filter((doc: Document) => {
    const matchesTopic = !selectedTopic || doc.topicId === selectedTopic.id;
    const matchesSearch =
      !searchQuery ||
      doc.fileName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (doc.tags && doc.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())));
    return matchesTopic && matchesSearch;
  });

  const handleTopicSelect = (topic: any | null) => {
    setSelectedTopic(topic);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedTopic={selectedTopic}
        handleTopicSelect={handleTopicSelect}
      />
      <main className="flex-1 flex flex-col overflow-hidden">
        <Header
          selectedTopic={selectedTopic}
          filteredDocuments={filteredDocuments}
          viewMode={viewMode}
          setViewMode={setViewMode}
        />
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <UploadSection
            selectedTopic={selectedTopic}
            uploadDocument={uploadDocument}
            isUploading={isUploading}
          />
          <DocumentList
            filteredDocuments={filteredDocuments}
            topics={topics || []}
            viewMode={viewMode}
            searchQuery={searchQuery}
            deleteDocument={deleteDocument}
          />
        </div>
      </main>
    </div>
  );
}

export default function Dashboard() {
  return (
    <QueryProvider>
      <DashboardPage />
    </QueryProvider>
  )
}
