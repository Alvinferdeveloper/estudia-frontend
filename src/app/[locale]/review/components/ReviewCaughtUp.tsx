"use client";

import { useFormatter, useNow, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import type { ReviewSummary } from "@/app/[locale]/review/hooks/useReview";

interface ReviewCaughtUpProps {
  reviewedCount: number;
  summary: ReviewSummary | undefined;
  back: { href: string; label: string };
}

// Nothing left to review: either the session just ended or nothing was due.
export const ReviewCaughtUp: React.FC<ReviewCaughtUpProps> = ({ reviewedCount, summary, back }) => {
  const t = useTranslations("review.caughtUp");
  const format = useFormatter();
  const now = useNow({ updateInterval: 60_000 });
  const hasCards = !summary || summary.total > 0;

  const title = !hasCards
    ? t("noCardsTitle")
    : reviewedCount > 0
      ? t("doneTitle", { count: reviewedCount })
      : t("upToDateTitle");

  const detail = !hasCards
    ? t("noCardsHint")
    : summary?.nextDueAt
      ? t("nextDue", { when: format.relativeTime(new Date(summary.nextDueAt), now) })
      : summary && t("noUpcoming");

  return (
    <div className="py-16">
      <p className="text-base font-medium text-foreground">{title}</p>
      {detail && <p className="mt-2 max-w-sm text-sm text-muted-foreground">{detail}</p>}
      <Button asChild className="mt-6">
        <Link href={back.href}>{back.label}</Link>
      </Button>
    </div>
  );
};
