"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import { ConfirmDialog } from "@/components/confirm-dialog";

interface DeleteConfirmationDialogProps {
  onConfirm: () => void | Promise<void>;
  /** Render-prop for a custom trigger (e.g. an inline icon button). Receives
   * the click handler to attach — it already stops propagation so it's safe
   * to use inside a clickable card/row. Falls back to a text menu-item style
   * button when omitted. */
  trigger?: (onClick: (e: React.MouseEvent) => void) => React.ReactNode;
}

export const DeleteConfirmationDialog: React.FC<DeleteConfirmationDialogProps> = ({ onConfirm, trigger }) => {
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
          Delete
        </button>
      )}

      <ConfirmDialog
        isOpen={isOpen}
        onOpenChange={setIsOpen}
        onConfirm={onConfirm}
        title="Delete Document"
        description="Are you sure you want to delete this document? This action cannot be undone and will permanently delete all associated data."
        confirmText="Delete"
        variant="destructive"
      />
    </>
  );
};
