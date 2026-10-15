"use client";

import { useMemo } from "react";
import { Layers } from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useFetchVocabulary } from "@/app/[locale]/document/[id]/hooks/useVocabulary";
import {
  useAddWordsToFlashcards,
  useFlashcards,
  wordsOutsideDeck,
} from "@/app/[locale]/document/[id]/components/flashcards/hooks/useFlashcards";

interface AddWordsToDeckButtonProps {
  documentId: string;
  className?: string;
}

// Only shown while some saved word has no card, so people who don't use cards never see it nagging.
export const AddWordsToDeckButton: React.FC<AddWordsToDeckButtonProps> = ({ documentId, className }) => {
  const t = useTranslations("flashcards.words");
  const { data: words } = useFetchVocabulary(documentId);
  const { data: cards } = useFlashcards(documentId);
  const addWords = useAddWordsToFlashcards(documentId);
  const pendingCount = useMemo(() => (words && cards ? wordsOutsideDeck(words, cards).length : 0), [words, cards]);

  if (pendingCount === 0) return null;

  const handleClick = async () => {
    const { added } = await addWords.mutateAsync(undefined);
    toast.success(t("added", { count: added }));
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => void handleClick().catch(() => undefined)}
      disabled={addWords.isPending}
      className={className}
    >
      <Layers className="size-4" />
      {t("addAll", { count: pendingCount })}
    </Button>
  );
};
