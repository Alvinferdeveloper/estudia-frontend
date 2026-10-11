"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Send } from "lucide-react";
import { MarkdownRenderer } from "@/app/[locale]/document/[id]/components/document-reader/note-ui";
import type { ApiErrorKey } from "@/lib/api-errors";
import { ApiErrorMessage } from "@/components/api-error-message";

interface VisualQueryPanelProps {
  isOpen: boolean;
  onClose: () => void;
  previewImage: string | null;
  isLoading: boolean;
  answer: string | null;
  errorKey: ApiErrorKey | null;
  onAsk: (question: string) => void;
}

export const VisualQueryPanel: React.FC<VisualQueryPanelProps> = ({
  isOpen,
  onClose,
  previewImage,
  isLoading,
  answer,
  errorKey,
  onAsk,
}) => {
  const t = useTranslations("reader.visualQuery");
  const defaultQuestion = t("defaultQuestion");
  const [question, setQuestion] = useState(defaultQuestion);

  useEffect(() => {
    if (isOpen) setQuestion(defaultQuestion);
  }, [isOpen, defaultQuestion]);

  const handleSubmit = () => {
    if (!question.trim() || isLoading) return;
    onAsk(question.trim());
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{t("title")}</DialogTitle>
          <DialogDescription className="sr-only">{t("description")}</DialogDescription>
        </DialogHeader>

        {previewImage && (
          <div className="flex max-h-64 justify-center overflow-auto scrollbar-thin rounded-lg bg-secondary p-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={previewImage} alt={t("previewAlt")} className="max-h-56 max-w-full rounded-md object-contain" />
          </div>
        )}

        <Textarea
          aria-label={t("title")}
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder={defaultQuestion}
          rows={2}
          disabled={isLoading}
        />

        <DialogFooter>
          <Button onClick={handleSubmit} disabled={isLoading || !question.trim()}>
            {isLoading ? <Loader2 className="animate-spin" /> : <Send />}
            {isLoading ? t("analyzing") : t("ask")}
          </Button>
        </DialogFooter>

        {(answer || errorKey || isLoading) && (
          <div className="-mx-6 -mb-6 max-h-80 overflow-y-auto scrollbar-thin border-t border-border px-6 py-4">
            {isLoading && !answer && (
              <p className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="size-4 animate-spin" />
                {t("generating")}
              </p>
            )}
            <ApiErrorMessage errorKey={errorKey} />
            {answer && <MarkdownRenderer content={answer} compact />}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
