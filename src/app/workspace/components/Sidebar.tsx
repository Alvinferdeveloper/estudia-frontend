import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Clock, FolderOpen, Plus } from "lucide-react";
import { TopicList } from "@/app/workspace/components/TopicList";
import { CreateTopicDialog } from "@/app/workspace/components/CreateTopicDialog";
import { NewMenu } from "@/app/workspace/components/NewMenu";
import { useFetchTopics } from "@/app/workspace/hooks/useFetchTopics";
import { useCreateTopic } from "@/app/workspace/hooks/useCreateTopic";
import { cn } from "@/lib/utils";
import { Folder, Topic } from "@/app/types";

interface SidebarProps {
  view: 'recent' | 'topic';
  selectedTopic: Topic | null;
  selectedFolder: Folder | null;
  handleTopicSelect: (topic: Topic | null) => void;
  onSelectRecent: () => void;
  createFolder: (folder: { name: string; color: string; topicId: string; parentId?: string }) => void;
  uploadDocument: (formData: FormData, options?: { onSuccess?: () => void; onError?: () => void }) => void;
  isUploading: boolean;
  totalDocuments: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  view,
  selectedTopic,
  selectedFolder,
  handleTopicSelect,
  onSelectRecent,
  createFolder,
  uploadDocument,
  isUploading,
  totalDocuments,
}) => {
  const { data: topics } = useFetchTopics();
  const { mutate: createTopic } = useCreateTopic();

  return (
    <aside className="flex h-screen w-64 shrink-0 flex-col border-r border-border/60 bg-secondary/60">
      {/* --- BRANDING --- */}
      <div className="flex items-center gap-2 px-5 pt-5">
        <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary text-primary-foreground">
          <span className="text-sm font-bold">e</span>
        </div>
        <h2 className="text-base font-semibold tracking-tight text-foreground">estudiIA</h2>
      </div>

      {/* --- NEW BUTTON --- */}
      <div className="px-5 pt-4">
        <NewMenu
          selectedTopic={selectedTopic}
          selectedFolder={selectedFolder}
          createFolder={createFolder}
          uploadDocument={uploadDocument}
          isUploading={isUploading}
          className="w-full justify-center"
        />
      </div>

      {/* --- NAVIGATION --- */}
      <div className="mt-5 flex-1 overflow-hidden px-3">
        <ScrollArea className="h-full pr-2">
          <nav className="space-y-0.5">
            <button
              onClick={onSelectRecent}
              className={cn(
                "press-feedback flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-sm transition-colors duration-150",
                view === 'recent'
                  ? "bg-primary/10 font-medium text-primary"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground"
              )}
            >
              <Clock className="h-4 w-4" />
              Recientes
            </button>
          </nav>

          <div className="mt-6 flex items-center justify-between px-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Colecciones
            </h3>
            <CreateTopicDialog
              createTopic={createTopic}
              trigger={
                <button className="press-feedback flex h-5 w-5 items-center justify-center rounded text-muted-foreground transition-colors hover:bg-accent hover:text-foreground">
                  <Plus className="h-3.5 w-3.5" />
                </button>
              }
            />
          </div>

          <div className="mt-1">
            {topics && topics.length > 0 ? (
              <TopicList
                topics={topics}
                selectedTopic={view === 'topic' ? selectedTopic : null}
                handleTopicSelect={handleTopicSelect}
              />
            ) : (
              <p className="px-3 py-2 text-xs text-muted-foreground">
                Aún no tienes colecciones.
              </p>
            )}
          </div>
        </ScrollArea>
      </div>

      {/* --- FOOTER STAT --- */}
      <div className="flex items-center gap-2 border-t border-border/60 px-5 py-4 text-xs text-muted-foreground">
        <FolderOpen className="h-3.5 w-3.5" />
        <span>
          <span className="font-medium tabular-nums text-foreground">{totalDocuments}</span> documento{totalDocuments === 1 ? "" : "s"} guardado{totalDocuments === 1 ? "" : "s"}
        </span>
      </div>
    </aside>
  );
};
