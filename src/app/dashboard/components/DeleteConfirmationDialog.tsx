"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { Trash2 } from "lucide-react";

interface DeleteConfirmationDialogProps {
  onConfirm: () => void;
}

export const DeleteConfirmationDialog: React.FC<DeleteConfirmationDialogProps> = ({ onConfirm }) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="flex items-center w-full text-destructive">
          <Trash2 className="mr-2 h-4 w-4" />
          Delete
        </button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you sure you want to delete this document?</DialogTitle>
        </DialogHeader>
        <p className="text-muted-foreground">
          This action cannot be undone. This will permanently delete the document and all of its associated data.
        </p>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button variant="destructive" onClick={onConfirm}>Delete</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
