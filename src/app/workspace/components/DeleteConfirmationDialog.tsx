"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import { ConfirmDialog } from "@/components/confirm-dialog";

interface DeleteConfirmationDialogProps {
  onConfirm: () => void | Promise<void>;
}

export const DeleteConfirmationDialog: React.FC<DeleteConfirmationDialogProps> = ({ onConfirm }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center w-full text-destructive p-2 hover:bg-destructive/10 rounded-sm transition-colors text-sm font-medium cursor-pointer"
      >
        <Trash2 className="mr-2 h-4 w-4" />
        Delete
      </button>

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
