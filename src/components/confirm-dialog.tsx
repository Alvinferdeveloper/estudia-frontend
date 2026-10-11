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
import { Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";

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
  confirmText,
  cancelText,
  variant = "destructive",
  isLoading = false,
}: ConfirmDialogProps) {
  const t = useTranslations("common.actions");
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
          <Button variant="ghost" onClick={() => onOpenChange(false)} disabled={isLoading} className="flex-1">
            {cancelText ?? t("cancel")}
          </Button>
          <Button variant={variant} onClick={handleConfirm} disabled={isLoading} className="flex-1">
            {isLoading && <Loader2 className="animate-spin" />}
            {confirmText ?? t("confirm")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
