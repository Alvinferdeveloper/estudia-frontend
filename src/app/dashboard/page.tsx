"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/app/lib/auth-client";
import { useFetchTopics } from "@/app/dashboard/hooks/useFetchTopics";
import { useFetchDocuments } from "@/app/dashboard/hooks/useFetchDocuments";
import { useUploadDocument } from "@/app/dashboard/hooks/useUploadDocument";
import { useDeleteDocument } from "@/app/dashboard/hooks/useDeleteDocument";
import { useDebounce } from "@/app/hooks/useDebounce";
import { Sidebar } from "@/app/dashboard/components/Sidebar";
import { Header } from "@/app/dashboard/components/Header";
import { UploadSection } from "@/app/dashboard/components/UploadSection";
import { DocumentList } from "@/app/dashboard/components/DocumentList";
import { QueryProvider } from "@/app/providers/QueryProvider";

const DashboardPage = () => {
  const router = useRouter();
  const [selectedTopic, setSelectedTopic] = useState<any | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery, 500);
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
  } = useFetchDocuments(selectedTopic?.id, debouncedSearchQuery);

  const documents = data?.pages.flatMap((page) => page.data) || [];

  const { mutate: uploadDocument, isPending: isUploading } = useUploadDocument(selectedTopic?.id);
  const { mutate: deleteDocument } = useDeleteDocument(selectedTopic?.id);

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
              filteredDocuments={documents}
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
