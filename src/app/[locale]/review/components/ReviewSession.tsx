"use client";

import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Kbd } from "@/components/ui/kbd";
import { FlashcardSheet } from "@/app/[locale]/document/[id]/components/flashcards/components/FlashcardSheet";
import { DeckProgress } from "@/app/[locale]/document/[id]/components/flashcards/components/DeckProgress";
import { type DueFlashcard, useReviewSummary } from "@/app/[locale]/review/hooks/useReview";
import { useReviewSession } from "@/app/[locale]/review/hooks/useReviewSession";
import { RatingButtons } from "@/app/[locale]/review/components/RatingButtons";
import { ReviewCaughtUp } from "@/app/[locale]/review/components/ReviewCaughtUp";

interface ReviewSessionProps {
  dueCards: DueFlashcard[];
  documentId?: string;
  back: { href: string; label: string };
}

export const ReviewSession: React.FC<ReviewSessionProps> = ({ dueCards, documentId, back }) => {
  const t = useTranslations("review");
  const tPractice = useTranslations("flashcards.practice");
  const session = useReviewSession(dueCards);
  const { data: summary } = useReviewSummary(documentId, { enabled: session.current === null });

  if (!session.current) {
    return <ReviewCaughtUp reviewedCount={session.reviewedCount} summary={summary} back={back} />;
  }

  const total = session.reviewedCount + session.remainingCount;

  return (
    <div className="mt-6">
      <DeckProgress
        value={session.reviewedCount / total}
        label={t("remaining", { count: session.remainingCount })}
      />
      <FlashcardSheet card={session.current} isRevealed={session.isRevealed} className="mt-6">
        {session.isRevealed ? (
          <RatingButtons preview={session.current.preview} onRate={session.rate} />
        ) : (
          <div className="flex justify-end">
            <Button onClick={session.reveal}>
              {t("show")}
              <Kbd>{tPractice("spaceKey")}</Kbd>
            </Button>
          </div>
        )}
      </FlashcardSheet>
    </div>
  );
};
