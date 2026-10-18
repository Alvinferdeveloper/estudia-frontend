"use client";

import { useId } from "react";
import { useFormatter, useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Kbd } from "@/components/ui/kbd";
import { FLASHCARD_RATINGS, type FlashcardRating } from "@/app/[locale]/review/hooks/useReview";
import { intervalUntil } from "@/app/[locale]/review/lib/interval";

interface RatingButtonsProps {
  preview: Record<FlashcardRating, string>;
  onRate: (rating: FlashcardRating) => void;
}

// The four FSRS ratings, each with when the card would come back.
export const RatingButtons: React.FC<RatingButtonsProps> = ({ preview, onRate }) => {
  const t = useTranslations("review");
  const format = useFormatter();
  const id = useId();
  const now = new Date();

  return (
    <div role="group" aria-label={t("rateLabel")} className="grid grid-cols-2 gap-2 sm:grid-cols-4">
      {FLASHCARD_RATINGS.map((rating, index) => {
        const { value, unit } = intervalUntil(new Date(preview[rating]), now);
        const interval = format.number(value, { style: "unit", unit, unitDisplay: "short" });
        const hintId = `${id}-${rating}`;
        return (
          <div key={rating} className="flex flex-col items-center gap-1.5">
            <span id={hintId} className="font-mono text-xs tabular-nums text-muted-foreground">
              <span className="sr-only">{t("intervalHint", { interval })}</span>
              <span aria-hidden>{interval}</span>
            </span>
            <Button variant="secondary" className="w-full" aria-describedby={hintId} onClick={() => onRate(rating)}>
              {t(`ratings.${rating}`)}
              <Kbd>{index + 1}</Kbd>
            </Button>
          </div>
        );
      })}
    </div>
  );
};
