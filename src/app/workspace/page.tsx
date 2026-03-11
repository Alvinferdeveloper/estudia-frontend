"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/app/lib/auth-client";
import { useFetchTopics } from "@/app/workspace/hooks/useFetchTopics";
import { useFetchItems } from "@/app/workspace/hooks/useFetchItems";
import { useCreateFolder } from "@/app/workspace/hooks/useFolders";
import { useUploadDocument } from "@/app/workspace/hooks/useUploadDocument";
import { useDeleteDocument } from "@/app/workspace/hooks/useDeleteDocument";
import { useDebounce } from "@/app/hooks/useDebounce";
import { Sidebar } from "@/app/workspace/components/Sidebar";
import { Header } from "@/app/workspace/components/Header";
import { UploadSection } from "@/app/workspace/components/UploadSection";
import { DocumentList } from "@/app/workspace/components/DocumentList";
import { CreateFolderDialog } from "@/app/workspace/components/CreateFolderDialog";
import { QueryProvider } from "@/app/providers/QueryProvider";
import { Folder, Topic, Document } from "@/app/types";

type PathItem = { type: 'topic' | 'folder'; item: Topic | Folder };

const DashboardPage = () => {
  const router = useRouter();
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [selectedFolder, setSelectedFolder] = useState<Folder | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [folderPath, setFolderPath] = useState<Folder[]>([]);
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
  } = useFetchItems(
    selectedTopic?.id,
    debouncedSearchQuery,
    selectedFolder?.id || null
  );

  const items = data?.pages.flatMap((page) => page.data) || [];

  const { mutate: uploadDocument, isPending: isUploading } = useUploadDocument(selectedTopic?.id);
  const { mutate: deleteDocument } = useDeleteDocument(selectedTopic?.id);
  const { mutate: createFolder } = useCreateFolder();

  // Build current path for breadcrumb
  const currentPath: PathItem[] = useMemo(() => {
    const path: PathItem[] = [];
    if (selectedTopic) {
      path.push({ type: 'topic', item: selectedTopic });
    }
    folderPath.forEach(folder => {
      path.push({ type: 'folder', item: folder });
    });
    return path;
  }, [selectedTopic, folderPath]);

  const handleTopicSelect = (topic: Topic | null) => {
    setSelectedTopic(topic);
    setSelectedFolder(null);
    setFolderPath([]);
  };

  const handleFolderSelect = (folder: Folder | null) => {
    if (!folder) {
      // Go back to root
      setSelectedFolder(null);
      setFolderPath([]);
    } else {
      // Navigate into folder
      setSelectedFolder(folder);

      // If folder is already in path, truncate path to it
      const folderIndex = folderPath.findIndex(f => f.id === folder.id);
      if (folderIndex !== -1) {
        setFolderPath(folderPath.slice(0, folderIndex + 1));
      } else {
        setFolderPath(prev => [...prev, folder]);
      }
    }
  };

  const handleGoBack = () => {
    if (folderPath.length > 0) {
      const newPath = folderPath.slice(0, -1);
      setFolderPath(newPath);
      setSelectedFolder(newPath.length > 0 ? newPath[newPath.length - 1] : null);
    }
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
          selectedFolder={selectedFolder}
          totalDocuments={data?.pages[0].total || 0}
          viewMode={viewMode}
          setViewMode={setViewMode}
          onGoBack={folderPath.length > 0 ? handleGoBack : undefined}
          createFolderDialog={
            selectedTopic ? (
              <CreateFolderDialog
                createFolder={createFolder}
                topicId={selectedTopic.id}
                parentId={selectedFolder?.id}
              />
            ) : undefined
          }
        />
        <div className="flex-1 overflow-y-auto p-6 scroll-smooth">
          <div className="max-w-6xl mx-auto space-y-8">
            <UploadSection
              selectedTopic={selectedTopic}
              selectedFolder={selectedFolder}
              uploadDocument={uploadDocument}
              isUploading={isUploading}
            />
            <DocumentList
              items={items}
              selectedFolder={selectedFolder}
              topics={topics || []}
              viewMode={viewMode}
              searchQuery={searchQuery}
              deleteDocument={deleteDocument}
              hasNextPage={hasNextPage}
              isFetchingNextPage={isFetchingNextPage}
              fetchNextPage={fetchNextPage}
              onFolderSelect={handleFolderSelect}
              currentPath={currentPath}
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
