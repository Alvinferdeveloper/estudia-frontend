"use client";

import { Layers } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { ROUTES } from "@/config/routes";
import { useReviewSummary } from "@/app/[locale]/review/hooks/useReview";

// The global review in the workspace navigation; absent for people who have no cards.
export const ReviewNavLink: React.FC = () => {
  const t = useTranslations("review");
  const { data: summary } = useReviewSummary();

  if (!summary?.total) return null;

  return (
    <Link
      href={ROUTES.review()}
      className="press-feedback flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors duration-150 hover:bg-accent hover:text-foreground"
    >
      <Layers className="h-4 w-4" />
      <span className="flex-1">{t("title")}</span>
      {summary.due > 0 && (
        <span className="font-mono text-xs font-semibold tabular-nums text-foreground">
          <span className="sr-only">{t("dueCount", { count: summary.due })}</span>
          <span aria-hidden>{summary.due}</span>
        </span>
      )}
    </Link>
  );
};
