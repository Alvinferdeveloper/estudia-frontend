"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { ConfirmDialog } from "@/components/confirm-dialog";
import type referenceMessages from "@/messages/es";

// Each deletable item type has its own copy, since deleting a folder affects its contents differently.
export type DeletableItemType = keyof typeof referenceMessages.workspace.deleteDialog;

interface DeleteConfirmationDialogProps {
  itemType: DeletableItemType;
  onConfirm: () => void | Promise<void>;
  /** Render-prop for a custom trigger (e.g. an inline icon button). Receives
   * the click handler to attach — it already stops propagation so it's safe
   * to use inside a clickable card/row. Falls back to a text menu-item style
   * button when omitted. */
  trigger?: (onClick: (e: React.MouseEvent) => void) => React.ReactNode;
}

export const DeleteConfirmationDialog: React.FC<DeleteConfirmationDialogProps> = ({ itemType, onConfirm, trigger }) => {
  const t = useTranslations("workspace");
  const [isOpen, setIsOpen] = useState(false);

  const openDialog = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsOpen(true);
  };

  return (
    <>
      {trigger ? (
        trigger(openDialog)
      ) : (
        <button
          onClick={openDialog}
          className="flex items-center w-full text-destructive p-2 hover:bg-destructive/10 rounded-sm transition-colors text-sm font-medium cursor-pointer"
        >
          <Trash2 className="mr-2 h-4 w-4" />
          {t("actions.delete")}
        </button>
      )}

      <ConfirmDialog
        isOpen={isOpen}
        onOpenChange={setIsOpen}
        onConfirm={onConfirm}
        title={t(`deleteDialog.${itemType}.title`)}
        description={t(`deleteDialog.${itemType}.description`)}
        confirmText={t("actions.delete")}
        variant="destructive"
      />
    </>
  );
};
