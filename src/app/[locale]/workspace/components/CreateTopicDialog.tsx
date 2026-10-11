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
import { Label } from "@/components/ui/label";
import { PlusCircle } from "lucide-react";
import { CollectionColorPicker } from "@/app/[locale]/workspace/components/CollectionColorPicker";
import { DEFAULT_COLLECTION_COLOR } from "@/app/[locale]/workspace/lib/collection-colors";

interface CreateTopicDialogProps {
  createTopic: (topic: { name: string; color: string }) => void;
  trigger?: React.ReactNode;
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
      <DialogTrigger asChild>
        {trigger ?? (
          <Button className="w-full shadow-sm cursor-pointer">
            <PlusCircle className="mr-2 h-4 w-4" /> {t("topicDialog.trigger")}
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t("topicDialog.title")}</DialogTitle>
          <DialogDescription>
            {t("topicDialog.description")}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          {/* Input Nombre */}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium">
              {t("topicDialog.nameLabel")}
            </Label>
            <Input
              id="name"
              value={newTopicName}
              onChange={(e) => setNewTopicName(e.target.value)}
              placeholder={t("topicDialog.namePlaceholder")}
              className="col-span-3"
              autoFocus
            />
          </div>

          <CollectionColorPicker selectedColor={selectedColor} onColorChange={setSelectedColor} />
        </div>

        <DialogFooter className="gap-2 sm:gap-2">
          <Button variant="outline" className="press-feedback h-8 cursor-pointer" onClick={() => setIsOpen(false)}>
            {tCommon("cancel")}
          </Button>
          <Button
            onClick={handleCreate}
            disabled={!newTopicName.trim()}
            className="press-feedback h-8 cursor-pointer"
          >
            {t("topicDialog.submit")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};