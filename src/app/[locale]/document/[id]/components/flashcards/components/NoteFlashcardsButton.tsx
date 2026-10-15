"use client";

import { Layers } from "lucide-react";
import { useTranslations } from "next-intl";
import { IconButton } from "@/components/ui/icon-button";
import type { Annotation } from "@/app/types";
import { useFlashcards } from "@/app/[locale]/document/[id]/components/flashcards/hooks/useFlashcards";

interface NoteFlashcardsButtonProps {
  note: Annotation;
  onClick: () => void;
  disabled?: boolean;
}

// Says how many cards the note already has, so making more is a deliberate choice.
export const NoteFlashcardsButton: React.FC<NoteFlashcardsButtonProps> = ({ note, onClick, disabled }) => {
  const t = useTranslations("flashcards.note");
  const { data: cards } = useFlashcards(note.documentId);
  const existing = cards?.filter((card) => card.annotationId === note.id).length ?? 0;

  return (
    <IconButton
      label={existing ? t("createWithExisting", { count: existing }) : t("create")}
      onClick={onClick}
      disabled={disabled}
    >
      <Layers />
    </IconButton>
  );
};
