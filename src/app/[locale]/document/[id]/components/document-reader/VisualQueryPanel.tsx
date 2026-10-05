"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Send, ImageIcon } from "lucide-react";
import { MarkdownRenderer } from "@/app/[locale]/document/[id]/components/document-reader/note-ui";
import type { ApiErrorKey } from "@/lib/api-errors";

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
  const tErrors = useTranslations("errors");
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
      <DialogContent className="w-[600px] max-w-[90vw] flex flex-col gap-0 p-0">
        <DialogTitle className="sr-only">{t("title")}</DialogTitle>
        <DialogDescription className="sr-only">{t("description")}</DialogDescription>

        <div className="p-4 border-b bg-muted/30 flex items-center gap-2 text-sm font-medium text-muted-foreground">
          <ImageIcon className="w-4 h-4" />
          {t("selectedRegion")}
        </div>

        {previewImage && (
          <div className="p-4 border-b bg-muted/10 flex justify-center max-h-64 overflow-auto">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={previewImage}
              alt={t("previewAlt")}
              className="max-w-full max-h-56 object-contain rounded-md border"
            />
          </div>
        )}

        <div className="p-4 space-y-3">
          <Textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder={defaultQuestion}
            rows={2}
            disabled={isLoading}
          />
          <div className="flex justify-end">
            <Button
              onClick={handleSubmit}
              disabled={isLoading || !question.trim()}
              className="cursor-pointer"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t("analyzing")}
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  {t("ask")}
                </>
              )}
            </Button>
          </div>
        </div>

        {(answer || errorKey || isLoading) && (
          <div className="border-t max-h-80 overflow-y-auto">
            {isLoading && !answer && (
              <div className="p-6 flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                {t("generating")}
              </div>
            )}
            {errorKey && (
              <p className="p-4 text-sm text-destructive">{tErrors(errorKey)}</p>
            )}
            {answer && <MarkdownRenderer content={answer} compact />}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
