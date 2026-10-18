import React from "react";
import { useTranslations } from "next-intl";
import { IconButton } from "@/components/ui/icon-button";
import { Clock, Plus } from "lucide-react";
import { TopicList } from "@/app/[locale]/workspace/components/TopicList";
import { CreateTopicDialog } from "@/app/[locale]/workspace/components/CreateTopicDialog";
import { NewMenu } from "@/app/[locale]/workspace/components/NewMenu";
import { StorageQuota } from "@/app/[locale]/workspace/components/StorageQuota";
import { ReviewNavLink } from "@/app/[locale]/review/components/ReviewNavLink";
import { useFetchTopics } from "@/app/[locale]/workspace/hooks/useFetchTopics";
import { useCreateTopic } from "@/app/[locale]/workspace/hooks/useCreateTopic";
import { cn } from "@/lib/utils";
import { BrandLogo } from "@/components/brand/BrandLogo";
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
}) => {
  const t = useTranslations("workspace");
  const { data: topics } = useFetchTopics();
  const { mutate: createTopic } = useCreateTopic();

  return (
    <aside className="flex h-screen w-64 shrink-0 flex-col border-r border-border/60 bg-secondary/60">
      {/* --- BRANDING --- */}
      <div className="px-5 pt-5">
        <BrandLogo className="text-base text-foreground" />
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
      <div className="mt-5 min-h-0 flex-1 overflow-y-auto scrollbar-thin px-3">
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
            {t("sidebar.recent")}
          </button>
          <ReviewNavLink />
        </nav>

        <div className="mt-6 flex items-center justify-between px-3">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {t("sidebar.collections")}
          </h3>
          <CreateTopicDialog
            createTopic={createTopic}
            trigger={
              <IconButton size="icon-sm" label={t("topicDialog.trigger")} className="-my-1">
                <Plus className="size-3.5" />
              </IconButton>
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
              {t("sidebar.noCollections")}
            </p>
          )}
        </div>
      </div>

      <StorageQuota />
    </aside>
  );
};
