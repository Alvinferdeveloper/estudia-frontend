"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

interface ConfirmDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void | Promise<void>;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "default" | "destructive";
  isLoading?: boolean;
}

export function ConfirmDialog({
  isOpen,
  onOpenChange,
  onConfirm,
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "destructive",
  isLoading = false,
}: ConfirmDialogProps) {
  const handleConfirm = async () => {
    await onConfirm();
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px] p-0 overflow-hidden">
        <DialogHeader className="flex flex-col items-center gap-3 pt-8 px-6">
          <DialogTitle className="text-xl font-semibold text-foreground text-center">
            {title}
          </DialogTitle>
          <DialogDescription className="text-center text-muted-foreground text-sm leading-relaxed">
            {description}
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="flex gap-3 mt-8 p-6 bg-muted/40 border-t border-border">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
            className="press-feedback flex-1 cursor-pointer transition-colors"
          >
            {cancelText}
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={isLoading}
            className={cn(
              "press-feedback flex-1 cursor-pointer font-medium transition-all",
              variant === "destructive"
                ? "bg-destructive hover:bg-destructive/90 text-white"
                : "bg-primary hover:bg-primary/90 text-primary-foreground"
            )}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : null}
            {confirmText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
