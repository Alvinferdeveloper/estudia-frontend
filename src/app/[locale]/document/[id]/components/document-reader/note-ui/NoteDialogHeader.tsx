import { useState } from "react";
import { Trash2, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { IconButton } from "@/components/ui/icon-button";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { TextQuote } from "@/app/[locale]/document/[id]/components/document-reader/shared/TextQuote";

interface NoteDialogHeaderProps {
  selectedText: string;
  instruction?: string;
  // Extra icon actions before delete.
  actions?: React.ReactNode;
  onDelete?: () => Promise<void>;
  onClose: () => void;
}

export const NoteDialogHeader: React.FC<NoteDialogHeaderProps> = ({ selectedText, instruction, actions, onDelete, onClose }) => {
  const t = useTranslations("notes.header");
  const tCommon = useTranslations("common");
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!onDelete) return;
    setIsDeleting(true);
    try {
      await onDelete();
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <header className="flex shrink-0 items-start gap-3 border-b border-border px-6 pb-4 pt-5">
      <div className="min-w-0 flex-1">
        <TextQuote text={selectedText} expandable />
        {instruction && (
          <p className="mt-2 truncate px-0.5 text-xs text-muted-foreground" title={instruction}>
            <span className="font-medium text-foreground/70">{t("instructionLabel")}</span> {instruction}
          </p>
        )}
      </div>

      <div className="-mr-2 -mt-1 flex items-center gap-0.5">
        {actions}
        {onDelete && (
          <IconButton
            label={t("delete")}
            onClick={() => setIsConfirmingDelete(true)}
            variant="ghost-destructive"
          >
            <Trash2 />
          </IconButton>
        )}
        <IconButton label={tCommon("actions.close")} onClick={onClose}>
          <X />
        </IconButton>
      </div>

      {onDelete && (
        <ConfirmDialog
          isOpen={isConfirmingDelete}
          onOpenChange={setIsConfirmingDelete}
          onConfirm={handleDelete}
          title={t("confirmDelete.title")}
          description={t("confirmDelete.description")}
          confirmText={t("confirmDelete.confirm")}
          variant="destructive"
          isLoading={isDeleting}
        />
      )}
    </header>
  );
};
