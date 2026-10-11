import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogDescription
} from "@/components/ui/dialog";
import { FolderPlus } from "lucide-react";
import { CollectionColorPicker } from "@/app/[locale]/workspace/components/CollectionColorPicker";
import { DEFAULT_COLLECTION_COLOR } from "@/app/[locale]/workspace/lib/collection-colors";
import { Field } from "@/components/ui/field";

interface CreateFolderDialogProps {
  createFolder: (folder: { name: string; color: string; topicId: string; parentId?: string }) => void;
  topicId: string;
  parentId?: string;
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export const CreateFolderDialog: React.FC<CreateFolderDialogProps> = ({
  createFolder,
  topicId,
  parentId,
  trigger,
  open: openProp,
  onOpenChange: onOpenChangeProp,
}) => {
  const t = useTranslations("workspace");
  const tCommon = useTranslations("common.actions");
  const [newFolderName, setNewFolderName] = useState("");
  const [selectedColor, setSelectedColor] = useState(DEFAULT_COLLECTION_COLOR);
  const [internalOpen, setInternalOpen] = useState(false);

  const isOpen = openProp ?? internalOpen;
  const setIsOpen = (open: boolean) => {
    onOpenChangeProp?.(open);
    setInternalOpen(open);
  };

  const handleCreate = () => {
    if (!newFolderName.trim()) return;
    createFolder({ name: newFolderName, color: selectedColor, topicId, parentId });
    resetForm();
    setIsOpen(false);
  };

  const resetForm = () => {
    setNewFolderName("");
    setSelectedColor(DEFAULT_COLLECTION_COLOR);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      setIsOpen(open);
      if (!open) resetForm();
    }}>
      <DialogTrigger asChild>
        {trigger ?? (
          <Button variant="ghost" className="w-full justify-start rounded-lg px-2 font-normal">
            <FolderPlus />
            <span>{t("folderDialog.trigger")}</span>
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t("folderDialog.title")}</DialogTitle>
          <DialogDescription>
            {t("folderDialog.description")}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 py-2">
          <Field id="folder-name" label={t("folderDialog.nameLabel")}>
            <Input
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              placeholder={t("folderDialog.namePlaceholder")}
              autoFocus
            />
          </Field>

          <CollectionColorPicker selectedColor={selectedColor} onColorChange={setSelectedColor} />
        </div>

        <DialogFooter className="gap-2 sm:gap-2">
          <Button variant="ghost" onClick={() => setIsOpen(false)}>
            {tCommon("cancel")}
          </Button>
          <Button onClick={handleCreate} disabled={!newFolderName.trim()}>
            {t("folderDialog.submit")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
