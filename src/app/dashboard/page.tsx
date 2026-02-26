"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/app/lib/auth-client";
import { useFetchTopics } from "@/app/dashboard/hooks/useFetchTopics";
import { useFetchDocuments } from "@/app/dashboard/hooks/useFetchDocuments";
import { useUploadDocument } from "@/app/dashboard/hooks/useUploadDocument";
import { useDeleteDocument } from "@/app/dashboard/hooks/useDeleteDocument";
import { Sidebar } from "@/app/dashboard/components/Sidebar";
import { Header } from "@/app/dashboard/components/Header";
import { UploadSection } from "@/app/dashboard/components/UploadSection";
import { DocumentList } from "@/app/dashboard/components/DocumentList";
import { QueryProvider } from "@/app/providers/QueryProvider";
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
  const { 
    data, 
    fetchNextPage, 
    hasNextPage, 
    isFetchingNextPage 
  } = useFetchDocuments(selectedTopic?.id);
  
  const documents = data?.pages.flatMap((page) => page.data) || [];

  const { mutate: uploadDocument, isPending: isUploading } = useUploadDocument(selectedTopic?.id);
  const { mutate: deleteDocument } = useDeleteDocument(selectedTopic?.id);

  const filteredDocuments = documents.filter((doc: Document) => {
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
          totalDocuments={data?.pages[0].total || 0}
          viewMode={viewMode}
          setViewMode={setViewMode}
        />
        <div className="flex-1 overflow-y-auto p-6 scroll-smooth">
          <div className="max-w-6xl mx-auto space-y-8">
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
              hasNextPage={hasNextPage}
              isFetchingNextPage={isFetchingNextPage}
              fetchNextPage={fetchNextPage}
            />
          </div>
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
