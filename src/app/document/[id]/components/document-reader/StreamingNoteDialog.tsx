"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Loader2, Sparkles, Save, FileText, Edit3, Trash2 } from "lucide-react";
import { useStreamingNote } from "@/app/document/[id]/hooks/useStreamingNote";
import { Annotation } from "@/app/types";
import {
  NoteColorPicker,
  NoteEditor,
  NoteForm,
} from "@/app/document/[id]/components/document-reader/note-ui";

const DEFAULT_COLOR = "#FFEB3B";

interface StreamingNoteDialogProps {
  isOpen: boolean;
  onClose: () => void;
  selectedText: string;
  documentFileName: string;
  onSaveNote: (content: {
    selectedText: string;
    comment: string;
    aiResponse: string;
    color: string;
  }) => Promise<void>;
  onDeleteNote?: (id: string) => Promise<void>;
  existingAnnotation?: Annotation | null;
}

export const StreamingNoteDialog: React.FC<StreamingNoteDialogProps> = ({
  isOpen,
  onClose,
  selectedText,
  documentFileName,
  onSaveNote,
  onDeleteNote,
  existingAnnotation,
}) => {
  const [prompt, setPrompt] = useState("");
  const [selectedColor, setSelectedColor] = useState(DEFAULT_COLOR);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const initialPromptRef = useRef("");
  const initialCompletionRef = useRef("");

  const {
    completion,
    isLoading,
    error,
    complete,
    stop,
    setCompletion,
  } = useStreamingNote();

  const isEditMode = !!existingAnnotation;

  const handleReset = useCallback(() => {
    setPrompt("");
    setSaveError(null);
    setCompletion("");
    setIsExpanded(false);
    initialPromptRef.current = "";
    initialCompletionRef.current = "";
  }, [setCompletion]);

  useEffect(() => {
    if (isOpen) {
      if (existingAnnotation) {
        setPrompt(existingAnnotation.comment || "");
        setSelectedColor(existingAnnotation.color || DEFAULT_COLOR);
        setCompletion(existingAnnotation.aiResponse || "");
        initialPromptRef.current = existingAnnotation.comment || "";
        initialCompletionRef.current = existingAnnotation.aiResponse || "";
        setIsExpanded(true);
      } else {
        handleReset();
      }
    }
  }, [isOpen, existingAnnotation, handleReset]);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    initialPromptRef.current = prompt;
    setIsExpanded(true);
    await complete(prompt, {
      selectedText,
      prompt,
      documentContext: `Document: ${documentFileName}`,
    });
  };

  const handleRegenerate = async () => {
    if (!initialPromptRef.current) return;
    setCompletion("");
    await complete(initialPromptRef.current, {
      selectedText,
      prompt: initialPromptRef.current,
      documentContext: `Document: ${documentFileName}`,
    });
  };

  const handleRequestChanges = async (changePrompt: string) => {
    if (!changePrompt.trim()) return;
    const combinedPrompt = `${initialPromptRef.current}. Also: ${changePrompt}`;
    setCompletion("");
    await complete(combinedPrompt, {
      selectedText,
      prompt: combinedPrompt,
      documentContext: `Document: ${documentFileName}`,
    });
  };

  const handleSave = async () => {
    if (!completion.trim()) return;

    setIsSaving(true);
    setSaveError(null);

    try {
      await onSaveNote({
        selectedText,
        comment: initialPromptRef.current,
        aiResponse: completion,
        color: selectedColor,
      });
      handleClose();
    } catch (err) {
      console.error("Error saving note:", err);
      setSaveError("Failed to save note. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!existingAnnotation || !onDeleteNote) return;

    setIsDeleting(true);
    try {
      await onDeleteNote(existingAnnotation.id);
      handleClose();
    } catch (err) {
      console.error("Error deleting note:", err);
      setSaveError("Failed to delete note. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleClose = () => {
    if (isLoading) {
      stop();
    }
    handleReset();
    onClose();
  };

  const isReady = completion.trim().length > 0 && !isLoading;
  const hasError = error !== undefined;
  const showGeneratedNote = isExpanded && completion;
  const hasChanges = completion !== initialCompletionRef.current;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent
        className={`
          ${showGeneratedNote ? "h-[95vh]" : "max-h-[95vh]"}
          w-[80vw] max-w-[85vw]
          flex flex-col p-0 gap-0
        `}
        style={{ maxWidth: "85vw" }}
      >
        <DialogHeader className="px-6 py-4 border-b shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                <p className="text-xs text-muted-foreground">{documentFileName}</p>
              </div>
            </div>
            {isEditMode && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDelete}
                disabled={isDeleting}
                className="text-destructive mr-6 cursor-pointer hover:text-destructive hover:bg-destructive/10"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            )}
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-hidden flex flex-col">
          {showGeneratedNote ? (
            <div className="flex-1 flex flex-col overflow-hidden">
              <div className="border-b bg-muted/30 shrink-0">
                <div className="p-3">
                  <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground mb-1">
                    <FileText className="w-3 h-3" />
                    Selected Text
                  </div>
                  <div className="max-h-24 overflow-y-auto w-full">
                    <p className="text-sm leading-relaxed text-foreground/80 whitespace-pre-wrap pr-4">
                      {selectedText}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
                <div className="p-3 border-b bg-gradient-to-r from-primary to-primary/70 dark:from-primary/30 dark:to-primary/30 shrink-0">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm font-medium">
                      <Sparkles className="w-4 h-4 text-white" />
                      <span className="text-white font-semibold">
                        {isEditMode ? "Current Note" : "Generated Note"}
                      </span>
                    </div>
                    <span
                      className="text-xs text-white truncate max-w-[200px]"
                      title={initialPromptRef.current}
                    >
                      {initialPromptRef.current}
                    </span>
                  </div>
                </div>

                <NoteEditor
                  completion={completion}
                  isLoading={isLoading}
                  initialPrompt={initialPromptRef.current}
                  hasError={hasError}
                  errorMessage={hasError ? error?.message : undefined}
                  onRegenerate={handleRegenerate}
                  onRequestChanges={handleRequestChanges}
                  onStop={stop}
                />
              </div>
            </div>
          ) : (
            <NoteForm
              selectedText={selectedText}
              prompt={prompt}
              onPromptChange={setPrompt}
              selectedColor={selectedColor}
              onColorChange={setSelectedColor}
              error={hasError ? error?.message : undefined}
            />
          )}
        </div>

        <div className="border-t p-4 flex items-center justify-between shrink-0 bg-background">
          {showGeneratedNote ? (
            <>
              <div className="flex items-center gap-2">
                <Label className="text-sm font-medium">Highlight Color:</Label>
                <NoteColorPicker
                  selectedColor={selectedColor}
                  onColorChange={setSelectedColor}
                  size="sm"
                />
              </div>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="rounded-sm cursor-pointer"
                  onClick={handleClose}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSave}
                  disabled={isSaving || !isReady}
                  className="bg-primary cursor-pointer rounded-sm"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : isEditMode && !hasChanges ? (
                    "Update Color"
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      {isEditMode ? "Save Changes" : "Save Note"}
                    </>
                  )}
                </Button>
              </div>
            </>
          ) : (
            <>
              <Button
                variant="outline"
                className="rounded-sm cursor-pointer"
                onClick={handleClose}
              >
                Cancel
              </Button>
              <Button
                onClick={handleGenerate}
                disabled={isLoading || !prompt.trim()}
                className="bg-primary cursor-pointer rounded-sm"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Generate Note
                  </>
                )}
              </Button>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};