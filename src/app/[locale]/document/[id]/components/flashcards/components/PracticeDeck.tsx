"use client";

import { ArrowLeft, ArrowRight, RotateCcw } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { IconButton } from "@/components/ui/icon-button";
import { Kbd } from "@/components/ui/kbd";
import type { Flashcard } from "@/app/[locale]/document/[id]/components/flashcards/hooks/useFlashcards";
import { usePracticeDeck } from "@/app/[locale]/document/[id]/components/flashcards/hooks/usePracticeDeck";
import { FlashcardSheet } from "@/app/[locale]/document/[id]/components/flashcards/components/FlashcardSheet";
import { DeckProgress } from "@/app/[locale]/document/[id]/components/flashcards/components/DeckProgress";

interface PracticeDeckProps {
  cards: Flashcard[];
  onExit: () => void;
}

// Free practice: flip through the cards without grading them.
export const PracticeDeck: React.FC<PracticeDeckProps> = ({ cards, onExit }) => {
  const t = useTranslations("flashcards.practice");
  const deck = usePracticeDeck(cards);

  if (deck.isFinished) {
    return (
      <div className="py-16">
        <p className="text-base font-medium text-foreground">{t("doneTitle", { count: deck.total })}</p>
        <p className="mt-2 max-w-sm text-sm text-muted-foreground">{t("doneHint")}</p>
        <div className="mt-6 flex flex-wrap items-center gap-2">
          <Button onClick={deck.restart}>
            <RotateCcw className="size-4" />
            {t("restart")}
          </Button>
          <Button variant="ghost" onClick={onExit}>
            {t("backToList")}
          </Button>
        </div>
      </div>
    );
  }

  const card = deck.current!;
  const isLast = deck.index === deck.total - 1;

  return (
    <div className="mt-6">
      <DeckProgress
        value={(deck.index + 1) / deck.total}
        label={t("progress", { current: deck.index + 1, total: deck.total })}
      >
        <div className="-mr-1.5 flex items-center gap-0.5">
          <IconButton label={t("previous")} size="icon-sm" onClick={deck.previous} disabled={deck.index === 0}>
            <ArrowLeft />
          </IconButton>
          <IconButton label={t("next")} size="icon-sm" onClick={deck.next}>
            <ArrowRight />
          </IconButton>
        </div>
      </DeckProgress>

      <FlashcardSheet card={card} isRevealed={deck.isRevealed} cardsBehind={deck.total - deck.index - 1} className="mt-6">
        <div className="flex justify-end">
          <Button onClick={deck.isRevealed ? deck.next : deck.reveal}>
            {deck.isRevealed ? (isLast ? t("finish") : t("next")) : t("show")}
            <Kbd>{t("spaceKey")}</Kbd>
          </Button>
        </div>
      </FlashcardSheet>
    </div>
  );
};
