"use client";

import { useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Loader2, Sparkles, FileText, Trash2 } from "lucide-react";
import { Annotation } from "@/app/types";
import {
  NoteColorPicker,
  NoteEditor,
  NoteForm,
} from "@/app/document/[id]/components/document-reader/note-ui";
import { useNoteDialog } from "@/app/document/[id]/hooks/useNoteDialog";
import { useNoteActions } from "@/app/document/[id]/hooks/useNoteActions";
import { ConfirmDialog } from "@/components/confirm-dialog";

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
  }) => Promise<Annotation>;
  onDeleteNote?: (id: string) => Promise<void>;
  onAnnotationUpdated?: (updatedAnnotation: Annotation) => void;
  onColorChange: (color: string) => Promise<void>;
  existingAnnotation?: Annotation | null;
}

export const StreamingNoteDialog: React.FC<StreamingNoteDialogProps> = ({
  isOpen,
  onClose,
  selectedText,
  documentFileName,
  onSaveNote,
  onDeleteNote,
  onAnnotationUpdated,
  onColorChange,
  existingAnnotation,
}) => {
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const dialog = useNoteDialog({
    isOpen,
    existingAnnotation,
    onClose,
  });

  const actions = useNoteActions({
    isOpen,
    documentFileName,
    selectedText,
    existingAnnotation,
    onSaveNote,
    onDeleteNote,
    onAnnotationUpdated,
    onClose: dialog.handleReset, // Reset on internal "success" close
    prompt: dialog.prompt,
    selectedColor: dialog.selectedColor,
    initialPromptRef: dialog.initialPromptRef,
    originalCompletionRef: dialog.originalCompletionRef,
    setIsExpanded: dialog.setIsExpanded,
    setSaveError: dialog.setSaveError,
    setLocalOriginalNote: dialog.setLocalOriginalNote,
  });

  const handleClose = () => {
    if (actions.isLoading) {
      actions.stop();
    }
    dialog.handleReset();
    onClose();
  };

  const handleChangeColor = async (color: string) => {
    dialog.setSelectedColor(color);
    onColorChange(color);
  };

  const isReady = actions.completion.trim().length > 0 && !actions.isLoading;
  const hasError = actions.error !== undefined;
  const showGeneratedNote = dialog.isExpanded && (existingAnnotation || actions.completion);

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
        <DialogTitle className="sr-only">Note Editor</DialogTitle>
        <DialogDescription className="sr-only">
          AI-powered note generation and editing from selected document text.
        </DialogDescription>

        <div className="flex-1 overflow-hidden flex flex-col">
          {showGeneratedNote ? (
            <div className="flex-1 flex flex-col overflow-hidden">
              <div className="border-b bg-muted/30 shrink-0">
                <div className="p-3">
                  <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground mb-1">
                    <FileText className="w-3 h-3" />
                    Selected Text
                  </div>
                  <div className="max-h-24 overflow-y-auto flex justify-between w-full">
                    <p className="text-sm leading-relaxed text-foreground/80 whitespace-pre-wrap pr-4">
                      {selectedText}
                    </p>
                    {dialog.isEditMode && (
                      <>
                        <Button
                          variant="ghost"
                          size="sm"
                          title="Delete note"
                          onClick={() => setIsDeleteConfirmOpen(true)}
                          disabled={actions.isDeleting}
                          className="text-destructive mr-6 cursor-pointer hover:text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>

                        <ConfirmDialog
                          isOpen={isDeleteConfirmOpen}
                          onOpenChange={setIsDeleteConfirmOpen}
                          onConfirm={actions.handleDelete}
                          title="Delete Note?"
                          description="Are you sure you want to delete this note? This action cannot be undone."
                          confirmText="Delete"
                          isLoading={actions.isDeleting}
                        />
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
                <div className="p-3 border-b bg-gradient-to-r from-primary to-primary/70 dark:from-primary/30 dark:to-primary/30 shrink-0">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm font-medium">
                      <Sparkles className="w-4 h-4 text-white" />
                      <span className="text-white font-semibold">
                        {dialog.isEditMode ? "Current Note" : "Generated Note"}
                      </span>
                    </div>
                    <span
                      className="text-xs text-white truncate max-w-[200px]"
                      title={dialog.initialPromptRef.current}
                    >
                      {dialog.initialPromptRef.current}
                    </span>
                  </div>
                </div>

                <NoteEditor
                  completion={actions.completion}
                  isLoading={actions.isLoading}
                  initialPrompt={dialog.initialPromptRef.current}
                  originalNote={dialog.localOriginalNote}
                  hasError={hasError}
                  errorMessage={hasError ? actions.error?.message : undefined}
                  onRegenerate={actions.handleRegenerate}
                  onRequestChanges={actions.handleRequestChanges}
                  onStop={actions.stop}
                  onAcceptChanges={dialog.isEditMode ? actions.handleAcceptChanges : undefined}
                  onOriginalNoteUpdated={dialog.isEditMode ? dialog.setLocalOriginalNote : undefined}
                />
              </div>
            </div>
          ) : (
            <NoteForm
              selectedText={selectedText}
              prompt={dialog.prompt}
              onPromptChange={dialog.setPrompt}
              selectedColor={dialog.selectedColor}
              onColorChange={dialog.setSelectedColor}
              error={hasError ? actions.error?.message : undefined}
            />
          )}
        </div>

        <div className="border-t p-4 flex items-center justify-between shrink-0 bg-background">
          {showGeneratedNote ? (
            <div className="flex items-center gap-2">
              <Label className="text-sm font-medium">Highlight Color:</Label>
              <NoteColorPicker
                selectedColor={dialog.selectedColor}
                onColorChange={handleChangeColor}
                size="sm"
              />
            </div>
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
                onClick={actions.handleGenerate}
                disabled={actions.isLoading || !dialog.prompt.trim()}
                className="bg-primary cursor-pointer rounded-sm"
              >
                {actions.isLoading ? (
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
