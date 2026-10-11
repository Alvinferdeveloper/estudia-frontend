"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { IconButton } from "@/components/ui/icon-button";
import { Input } from "@/components/ui/input";
import { CreateFolderDialog } from "@/app/[locale]/workspace/components/CreateFolderDialog";
import { Plus, FolderPlus, Upload, FileText, X, Paperclip } from "lucide-react";
import { Folder, Topic } from "@/app/types";
import { cn } from "@/lib/utils";
import { useUsage } from "@/app/[locale]/subscription/hooks/useSubscription";
import { isQuotaFull } from "@/app/[locale]/subscription/lib/usage";
import { UpgradePlanLink } from "@/components/upgrade-plan-link";

interface NewMenuProps {
  selectedTopic: Topic | null;
  selectedFolder: Folder | null;
  createFolder: (folder: { name: string; color: string; topicId: string; parentId?: string }) => void;
  uploadDocument: (formData: FormData, options?: { onSuccess?: () => void; onError?: () => void }) => void;
  isUploading: boolean;
  className?: string;
}

export const NewMenu: React.FC<NewMenuProps> = ({
  selectedTopic,
  selectedFolder,
  createFolder,
  uploadDocument,
  isUploading,
  className,
}) => {
  const t = useTranslations("workspace");
  const tCommon = useTranslations("common.actions");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showFolderDialog, setShowFolderDialog] = useState(false);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const { data: usage } = useUsage();
  // The API refuses it anyway; blocking it here says why before the user picks a file.
  const isUploadBlocked = !!usage && (isQuotaFull(usage.quotas.documents) || isQuotaFull(usage.quotas.storageBytes));
  const [tags, setTags] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.type !== "application/pdf") {
      toast.error(t("newMenu.pdfOnly"));
      return;
    }
    setPendingFile(file);
    e.target.value = "";
  };

  const handleConfirmUpload = () => {
    if (!pendingFile) return;
    const formData = new FormData();
    formData.append("file", pendingFile);
    if (selectedTopic) formData.append("topicId", selectedTopic.id);
    if (selectedFolder) formData.append("folderId", selectedFolder.id);
    if (tags.trim()) formData.append("tags", tags.trim());
    uploadDocument(formData, {
      onSuccess: () => {
        setPendingFile(null);
        setTags("");
      },
    });
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className={cn("gap-1.5", className)}>
            <Plus />
            {t("newMenu.new")}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-52">
          <DropdownMenuItem
            disabled={!selectedTopic}
            onSelect={(e) => {
              e.preventDefault();
              setShowFolderDialog(true);
            }}
          >
            <FolderPlus className="mr-2 h-4 w-4" />
            {t("newMenu.newFolder")}
          </DropdownMenuItem>
          <DropdownMenuItem
            disabled={isUploadBlocked}
            onSelect={(e) => {
              e.preventDefault();
              fileInputRef.current?.click();
            }}
          >
            <Upload className="mr-2 h-4 w-4" />
            {t("actions.uploadDocument")}
          </DropdownMenuItem>
          {isUploadBlocked && (
            <p className="px-2 pb-1.5 pt-0.5 text-xs text-muted-foreground">
              {t("newMenu.uploadLimitReached")} <UpgradePlanLink />
            </p>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <input
        id="new-menu-file-input"
        ref={fileInputRef}
        type="file"
        accept="application/pdf"
        onChange={handleFileChange}
        className="hidden"
      />

      {selectedTopic && (
        <CreateFolderDialog
          createFolder={createFolder}
          topicId={selectedTopic.id}
          parentId={selectedFolder?.id}
          open={showFolderDialog}
          onOpenChange={setShowFolderDialog}
        />
      )}

      {/* Flyout compacto de subida, estilo "toast" de OneDrive/Drive */}
      <AnimatePresence>
        {pendingFile && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 380, damping: 34 }}
            className="fixed bottom-6 right-6 z-50 w-80 rounded-xl border border-border bg-card p-4 shadow-float"
          >
            <div className="flex items-start gap-3">
              <div className="shrink-0 rounded-lg bg-primary/10 p-2 text-primary">
                <FileText className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-foreground">{pendingFile.name}</p>
                <p className="text-xs text-muted-foreground">
                  {(pendingFile.size / (1024 * 1024)).toFixed(2)} MB
                  {selectedFolder ? ` · ${selectedFolder.name}` : selectedTopic ? ` · ${selectedTopic.name}` : ""}
                </p>
              </div>
              <IconButton size="icon-sm" label={tCommon("close")} onClick={() => setPendingFile(null)}>
                <X className="size-3.5" />
              </IconButton>
            </div>

            <div className="relative mt-3">
              <Input
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder={t("newMenu.tagsPlaceholder")}
                className="h-9 pr-8 text-sm"
              />
              <Paperclip className="absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground/50" />
            </div>

            <div className="mt-3 flex justify-end gap-2">
              <Button variant="ghost" size="sm" onClick={() => setPendingFile(null)}>
                {tCommon("cancel")}
              </Button>
              <Button size="sm" disabled={isUploading} onClick={handleConfirmUpload}>
                {isUploading ? t("newMenu.uploading") : t("newMenu.upload")}
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
