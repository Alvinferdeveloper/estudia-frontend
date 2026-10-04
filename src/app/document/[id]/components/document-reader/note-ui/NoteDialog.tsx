"use client";

import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { Annotation } from "@/app/types";
import { NoteDraft, NoteSession, useNoteSession } from "@/app/document/[id]/hooks/useNoteSession";
import { NoteDialogHeader } from "./NoteDialogHeader";
import { NoteComposeForm } from "./NoteComposeForm";
import { NoteReader } from "./NoteReader";
import { NoteDiffReview } from "./NoteDiffReview";

interface NoteDialogProps {
  isOpen: boolean;
  onClose: () => void;
  selectedText: string;
  documentFileName: string;
  existingAnnotation?: Annotation | null;
  onSaveNote: (draft: NoteDraft) => Promise<Annotation>;
  onDeleteNote?: (id: string) => Promise<void>;
  onColorChange: (color: string) => Promise<void>;
}

type NoteWorkspaceProps = Omit<NoteDialogProps, "isOpen">;

const NotePhaseView: React.FC<{ session: NoteSession; onClose: () => void }> = ({ session, onClose }) => {
  if (session.phase === "compose") {
    return (
      <NoteComposeForm
        defaultPrompt={session.instruction}
        color={session.color}
        error={session.error}
        onColorChange={session.changeColor}
        onSubmit={session.generate}
        onCancel={onClose}
      />
    );
  }
  if (session.phase === "reviewing" && session.proposal) {
    return <NoteDiffReview original={session.note} proposal={session.proposal} onResolve={session.resolveReview} />;
  }
  return <NoteReader session={session} />;
};

// Lives inside DialogContent, so it mounts fresh on every open and its state never leaks between notes.
const NoteWorkspace: React.FC<NoteWorkspaceProps> = ({
  onClose,
  selectedText,
  documentFileName,
  existingAnnotation,
  onSaveNote,
  onDeleteNote,
  onColorChange,
}) => {
  const session = useNoteSession({
    selectedText,
    documentFileName,
    annotation: existingAnnotation ?? null,
    onSave: onSaveNote,
    onColorChange,
  });

  const annotationId = existingAnnotation?.id;
  const handleDelete =
    annotationId && onDeleteNote
      ? async () => {
          await onDeleteNote(annotationId);
          onClose();
        }
      : undefined;

  return (
    <>
      <NoteDialogHeader
        selectedText={selectedText}
        instruction={session.phase === "compose" ? undefined : session.instruction}
        onDelete={handleDelete}
        onClose={onClose}
      />
      <NotePhaseView session={session} onClose={onClose} />
    </>
  );
};

export const NoteDialog: React.FC<NoteDialogProps> = ({ isOpen, ...workspaceProps }) => (
  <Dialog open={isOpen} onOpenChange={(open) => !open && workspaceProps.onClose()}>
    <DialogContent
      showCloseButton={false}
      className="flex max-h-[85vh] w-[calc(100vw-2rem)] max-w-[720px] flex-col gap-0 overflow-hidden p-0 sm:max-w-[720px]"
    >
      <DialogTitle className="sr-only">Nota</DialogTitle>
      <DialogDescription className="sr-only">
        Crea o edita una nota con IA a partir del texto seleccionado.
      </DialogDescription>
      <NoteWorkspace {...workspaceProps} />
    </DialogContent>
  </Dialog>
);
