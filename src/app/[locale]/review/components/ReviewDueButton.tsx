"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { ROUTES } from "@/config/routes";
import { Button } from "@/components/ui/button";
import { useReviewSummary } from "@/app/[locale]/review/hooks/useReview";

// Reviews one document's due cards; hidden while nothing is due.
export const ReviewDueButton: React.FC<{ documentId: string }> = ({ documentId }) => {
  const t = useTranslations("review");
  const { data: summary } = useReviewSummary(documentId);

  if (!summary?.due) return null;

  return (
    <Button asChild variant="secondary" size="sm">
      <Link href={ROUTES.review(documentId)}>{t("reviewDue", { count: summary.due })}</Link>
    </Button>
  );
};
