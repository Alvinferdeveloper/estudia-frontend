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
import { CollectionColorPicker } from "@/app/[locale]/workspace/components/CollectionColorPicker";
import { DEFAULT_COLLECTION_COLOR } from "@/app/[locale]/workspace/lib/collection-colors";
import { Field } from "@/components/ui/field";

interface CreateTopicDialogProps {
  createTopic: (topic: { name: string; color: string }) => void;
  trigger: React.ReactNode;
}

export const CreateTopicDialog: React.FC<CreateTopicDialogProps> = ({ createTopic, trigger }) => {
  const t = useTranslations("workspace");
  const tCommon = useTranslations("common.actions");
  const [newTopicName, setNewTopicName] = useState("");
  const [selectedColor, setSelectedColor] = useState(DEFAULT_COLLECTION_COLOR);
  const [isOpen, setIsOpen] = useState(false);

  const handleCreate = () => {
    if (!newTopicName.trim()) return;
    createTopic({ name: newTopicName, color: selectedColor });
    resetForm();
    setIsOpen(false);
  };

  const resetForm = () => {
    setNewTopicName("");
    setSelectedColor(DEFAULT_COLLECTION_COLOR);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      setIsOpen(open);
      if (!open) resetForm();
    }}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t("topicDialog.title")}</DialogTitle>
          <DialogDescription>
            {t("topicDialog.description")}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 py-2">
          <Field id="topic-name" label={t("topicDialog.nameLabel")}>
            <Input
              value={newTopicName}
              onChange={(e) => setNewTopicName(e.target.value)}
              placeholder={t("topicDialog.namePlaceholder")}
              autoFocus
            />
          </Field>

          <CollectionColorPicker selectedColor={selectedColor} onColorChange={setSelectedColor} />
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={() => setIsOpen(false)}>
            {tCommon("cancel")}
          </Button>
          <Button onClick={handleCreate} disabled={!newTopicName.trim()}>
            {t("topicDialog.submit")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};