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
import { ReviewWaiting } from "@/app/[locale]/review/components/ReviewWaiting";

interface ReviewSessionProps {
  dueCards: DueFlashcard[];
  documentId?: string;
  back: { href: string; label: string };
}

export const ReviewSession: React.FC<ReviewSessionProps> = ({ dueCards, documentId, back }) => {
  const t = useTranslations("review");
  const tPractice = useTranslations("flashcards.practice");
  const session = useReviewSession(dueCards);
  const { data: summary } = useReviewSummary(documentId, { enabled: session.isFinished });

  if (session.waitingUntil !== null) {
    return <ReviewWaiting until={session.waitingUntil} back={back} />;
  }
  if (session.isFinished) {
    return <ReviewCaughtUp reviewedCount={session.reviewedCount} summary={summary} back={back} />;
  }
  // The last rating is still being saved.
  if (!session.current) return null;

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
