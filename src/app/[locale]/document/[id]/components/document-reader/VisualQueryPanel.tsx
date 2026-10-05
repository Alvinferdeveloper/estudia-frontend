"use client";

import { useEffect, useState } from "react";
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

interface VisualQueryPanelProps {
  isOpen: boolean;
  onClose: () => void;
  previewImage: string | null;
  isLoading: boolean;
  answer: string | null;
  error: string | null;
  onAsk: (question: string) => void;
}

const DEFAULT_QUESTION = "¿Qué significa esto?";

export const VisualQueryPanel: React.FC<VisualQueryPanelProps> = ({
  isOpen,
  onClose,
  previewImage,
  isLoading,
  answer,
  error,
  onAsk,
}) => {
  const [question, setQuestion] = useState(DEFAULT_QUESTION);

  useEffect(() => {
    if (isOpen) setQuestion(DEFAULT_QUESTION);
  }, [isOpen]);

  const handleSubmit = () => {
    if (!question.trim() || isLoading) return;
    onAsk(question.trim());
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="w-[600px] max-w-[90vw] flex flex-col gap-0 p-0">
        <DialogTitle className="sr-only">Preguntar sobre imagen o fórmula</DialogTitle>
        <DialogDescription className="sr-only">
          Hacé una pregunta sobre la imagen o fórmula seleccionada en el documento.
        </DialogDescription>

        <div className="p-4 border-b bg-muted/30 flex items-center gap-2 text-sm font-medium text-muted-foreground">
          <ImageIcon className="w-4 h-4" />
          Región seleccionada
        </div>

        {previewImage && (
          <div className="p-4 border-b bg-muted/10 flex justify-center max-h-64 overflow-auto">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={previewImage}
              alt="Región seleccionada del documento"
              className="max-w-full max-h-56 object-contain rounded-md border"
            />
          </div>
        )}

        <div className="p-4 space-y-3">
          <Textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder={DEFAULT_QUESTION}
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
                  Analizando...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Preguntar
                </>
              )}
            </Button>
          </div>
        </div>

        {(answer || error || isLoading) && (
          <div className="border-t max-h-80 overflow-y-auto">
            {isLoading && !answer && (
              <div className="p-6 flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                Generando explicación...
              </div>
            )}
            {error && (
              <p className="p-4 text-sm text-destructive">{error}</p>
            )}
            {answer && <MarkdownRenderer content={answer} compact />}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
