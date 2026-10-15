"use client";

import { Layers } from "lucide-react";
import { useTranslations } from "next-intl";
import { IconButton } from "@/components/ui/icon-button";
import type { VocabularyEntry } from "@/app/types";
import {
  useAddWordsToFlashcards,
  useDeleteFlashcard,
  useFlashcards,
} from "@/app/[locale]/document/[id]/components/flashcards/hooks/useFlashcards";

// Adds one saved word to the review, or takes it out again.
export const WordDeckToggle: React.FC<{ entry: VocabularyEntry }> = ({ entry }) => {
  const t = useTranslations("flashcards.words");
  const { data: cards } = useFlashcards(entry.documentId);
  const addWords = useAddWordsToFlashcards(entry.documentId);
  const deleteCard = useDeleteFlashcard(entry.documentId);
  const card = cards?.find((item) => item.vocabularyEntryId === entry.id);
  const isPending = addWords.isPending || deleteCard.isPending;

  if (!cards || !entry.explanation?.meanings.length) return null;

  return (
    <IconButton
      label={card ? t("removeOne") : t("addOne")}
      aria-pressed={Boolean(card)}
      disabled={isPending}
      onClick={() => (card ? deleteCard.mutate(card.id) : addWords.mutate([entry.id]))}
    >
      <Layers />
    </IconButton>
  );
};
