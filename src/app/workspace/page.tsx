"use client";

import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { UploadCloud } from "lucide-react";
import { authClient } from "@/app/lib/auth-client";
import { useFetchTopics } from "@/app/workspace/hooks/useFetchTopics";
import { useFetchItems } from "@/app/workspace/hooks/useFetchItems";
import { useFetchRecentDocuments } from "@/app/workspace/hooks/useFetchRecentDocuments";
import { useCreateFolder, useDeleteFolder } from "@/app/workspace/hooks/useFolders";
import { useUploadDocument } from "@/app/workspace/hooks/useUploadDocument";
import { useDeleteDocument } from "@/app/workspace/hooks/useDeleteDocument";
import { useToggleDocumentStar, useToggleFolderStar } from "@/app/workspace/hooks/useToggleStar";
import { useDebounce } from "@/app/hooks/useDebounce";
import { Sidebar } from "@/app/workspace/components/Sidebar";
import { Header, SortBy } from "@/app/workspace/components/Header";
import { DocumentList } from "@/app/workspace/components/DocumentList";
import { QueryProvider } from "@/app/providers/QueryProvider";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { Folder, Topic, Document } from "@/app/types";

type PathItem = { type: 'topic' | 'folder'; item: Topic | Folder };

const DashboardPage = () => {
  const router = useRouter();
  const [view, setView] = useState<"recent" | "topic">("recent");
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [selectedFolder, setSelectedFolder] = useState<Folder | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [folderPath, setFolderPath] = useState<Folder[]>([]);
  const debouncedSearchQuery = useDebounce(searchQuery, 500);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState<SortBy>("date");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [showBulkDeleteConfirm, setShowBulkDeleteConfirm] = useState(false);
  const [isDraggingFile, setIsDraggingFile] = useState(false);
  const dragCounter = useRef(0);

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

  const { data: recentData } = useFetchRecentDocuments(
    debouncedSearchQuery,
    view === 'recent'
  );

  const items: (Document | Folder)[] =
    view === 'recent'
      ? (recentData || []).map((doc) => ({ ...doc, type: 'document' as const }))
      : (data?.pages.flatMap((page) => page.data) || []);

  const sortedItems = useMemo(() => {
    const folders = items.filter((i): i is Folder => i.type === 'folder');
    const docs = items.filter((i): i is Document => i.type === 'document');

    if (sortBy === 'name') {
      folders.sort((a, b) => a.name.localeCompare(b.name));
      docs.sort((a, b) => a.fileName.localeCompare(b.fileName));
    } else {
      folders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      docs.sort((a, b) => {
        const bd = new Date(b.lastAccessedAt || b.createdAt).getTime();
        const ad = new Date(a.lastAccessedAt || a.createdAt).getTime();
        return bd - ad;
      });
    }
    return [...folders, ...docs];
  }, [items, sortBy]);

  const recentCount = view === 'recent' ? (recentData?.length ?? 0) : 0;

  const { mutate: uploadDocument, isPending: isUploading } = useUploadDocument(selectedTopic?.id);
  const { mutate: deleteDocument } = useDeleteDocument(selectedTopic?.id);
  const { mutate: createFolder } = useCreateFolder();
  const { mutate: deleteFolder } = useDeleteFolder();
  const { mutate: toggleDocumentStar } = useToggleDocumentStar();
  const { mutate: toggleFolderStar } = useToggleFolderStar();

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
    setView('topic');
    setSelectedTopic(topic);
    setSelectedFolder(null);
    setFolderPath([]);
    setSelectedIds(new Set());
  };

  const handleSelectRecent = () => {
    setView('recent');
    setSelectedTopic(null);
    setSelectedFolder(null);
    setFolderPath([]);
    setSelectedIds(new Set());
  };

  const handleFolderSelect = (folder: Folder | null) => {
    setSelectedIds(new Set());
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

  const handleUploadCtaClick = () => {
    document.getElementById('new-menu-file-input')?.click();
  };

  const allItemIds = useMemo(() => sortedItems.map((i) => i.id), [sortedItems]);
  const allSelected = allItemIds.length > 0 && allItemIds.every((id) => selectedIds.has(id));
  const toggleSelectAll = () => setSelectedIds(allSelected ? new Set() : new Set(allItemIds));

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const clearSelection = () => setSelectedIds(new Set());

  const handleBulkDelete = () => {
    sortedItems.forEach((item) => {
      if (!selectedIds.has(item.id)) return;
      if (item.type === 'folder') {
        deleteFolder(item.id);
      } else {
        deleteDocument(item.id);
      }
    });
    clearSelection();
    setShowBulkDeleteConfirm(false);
  };

  const handleBulkDownload = () => {
    const docs = sortedItems.filter(
      (i): i is Document => i.type === 'document' && selectedIds.has(i.id)
    );
    docs.forEach((doc) => window.open(doc.filePath, "_blank"));
  };

  // --- Drag & drop global: solo se activa al arrastrar un archivo sobre la ventana ---
  const handleWindowDrop = useCallback(
    (file: File) => {
      if (file.type !== "application/pdf") return;
      const formData = new FormData();
      formData.append("file", file);
      if (selectedTopic) formData.append("topicId", selectedTopic.id);
      if (selectedFolder) formData.append("folderId", selectedFolder.id);
      uploadDocument(formData);
    },
    [selectedTopic, selectedFolder, uploadDocument]
  );

  useEffect(() => {
    const hasFiles = (e: DragEvent) =>
      Array.from(e.dataTransfer?.types ?? []).includes("Files");

    const onDragEnter = (e: DragEvent) => {
      if (!hasFiles(e)) return;
      e.preventDefault();
      dragCounter.current += 1;
      setIsDraggingFile(true);
    };
    const onDragOver = (e: DragEvent) => {
      if (!hasFiles(e)) return;
      e.preventDefault();
    };
    const onDragLeave = (e: DragEvent) => {
      if (!hasFiles(e)) return;
      dragCounter.current -= 1;
      if (dragCounter.current <= 0) {
        dragCounter.current = 0;
        setIsDraggingFile(false);
      }
    };
    const onDrop = (e: DragEvent) => {
      if (!hasFiles(e)) return;
      e.preventDefault();
      dragCounter.current = 0;
      setIsDraggingFile(false);
      const file = e.dataTransfer?.files?.[0];
      if (file) handleWindowDrop(file);
    };

    window.addEventListener("dragenter", onDragEnter);
    window.addEventListener("dragover", onDragOver);
    window.addEventListener("dragleave", onDragLeave);
    window.addEventListener("drop", onDrop);
    return () => {
      window.removeEventListener("dragenter", onDragEnter);
      window.removeEventListener("dragover", onDragOver);
      window.removeEventListener("dragleave", onDragLeave);
      window.removeEventListener("drop", onDrop);
    };
  }, [handleWindowDrop]);

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar
        view={view}
        selectedTopic={selectedTopic}
        selectedFolder={selectedFolder}
        handleTopicSelect={handleTopicSelect}
        onSelectRecent={handleSelectRecent}
        createFolder={createFolder}
        uploadDocument={uploadDocument}
        isUploading={isUploading}
        totalDocuments={view === 'recent' ? recentCount : data?.pages[0].total || 0}
      />
      <main className="flex-1 flex flex-col overflow-hidden">
        <Header
          view={view}
          selectedTopic={selectedTopic}
          selectedFolder={selectedFolder}
          totalDocuments={view === 'recent' ? recentCount : data?.pages[0].total || 0}
          viewMode={viewMode}
          setViewMode={setViewMode}
          onGoBack={folderPath.length > 0 ? handleGoBack : undefined}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          sortBy={sortBy}
          setSortBy={setSortBy}
          selectedCount={selectedIds.size}
          onClearSelection={clearSelection}
          onBulkDelete={() => setShowBulkDeleteConfirm(true)}
          onBulkDownload={handleBulkDownload}
        />
        <div className="flex-1 overflow-y-auto p-6 scroll-smooth">
          <div className="max-w-6xl mx-auto">
            <DocumentList
              items={sortedItems}
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
              showUploadCta={view === 'topic'}
              onUploadCtaClick={handleUploadCtaClick}
              selectedIds={selectedIds}
              onToggleSelect={toggleSelect}
              allSelected={allSelected}
              onToggleSelectAll={toggleSelectAll}
              onToggleDocumentStar={(id, isStarred) => toggleDocumentStar({ id, isStarred })}
              onToggleFolderStar={(id, isStarred) => toggleFolderStar({ id, isStarred })}
            />
          </div>
        </div>
      </main>

      <ConfirmDialog
        isOpen={showBulkDeleteConfirm}
        onOpenChange={setShowBulkDeleteConfirm}
        onConfirm={handleBulkDelete}
        title={`¿Eliminar ${selectedIds.size} elemento${selectedIds.size === 1 ? "" : "s"}?`}
        description="Esta acción no se puede deshacer. Si seleccionaste una carpeta con contenido, vacíala primero para evitar dejar documentos huérfanos."
        confirmText="Eliminar"
        variant="destructive"
      />

      {/* Overlay de drag & drop global */}
      <AnimatePresence>
        {isDraggingFile && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="pointer-events-none fixed inset-0 z-[999] flex items-center justify-center bg-background/80 backdrop-blur-sm"
          >
            <div className="flex flex-col items-center gap-3 rounded-2xl border-2 border-dashed border-primary/50 bg-card px-16 py-12">
              <UploadCloud className="h-10 w-10 text-primary" />
              <p className="text-base font-medium text-foreground">Suelta el PDF para subirlo</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
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
