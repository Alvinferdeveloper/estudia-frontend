"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { ConfirmDialog } from "@/components/confirm-dialog";
import type referenceMessages from "@/messages/es";

// Each deletable item type has its own copy, since deleting a folder affects its contents differently.
export type DeletableItemType = keyof typeof referenceMessages.workspace.deleteDialog;

interface DeleteConfirmationDialogProps {
  itemType: DeletableItemType;
  onConfirm: () => void | Promise<void>;
  // The handler stops propagation, so the trigger is safe inside a clickable card or row.
  trigger: (onClick: (e: React.MouseEvent) => void) => React.ReactNode;
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
      {trigger(openDialog)}

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
