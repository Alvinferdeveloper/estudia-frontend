"use client";

import { useTranslations } from "next-intl";
import { ROUTES } from "@/config/routes";
import { Skeleton } from "@/components/ui/skeleton";
import { ApiErrorMessage } from "@/components/api-error-message";
import { getApiErrorKey } from "@/lib/api-errors";
import { StudyPageLayout } from "@/app/[locale]/document/[id]/components/flashcards/components/StudyPageLayout";
import { useDueFlashcards } from "@/app/[locale]/review/hooks/useReview";
import { ReviewSession } from "@/app/[locale]/review/components/ReviewSession";

interface ReviewViewProps {
  // Set to review a single document.
  document?: { id: string; name: string };
}

const SessionSkeleton = ({ label }: { label: string }) => (
  <div role="status" aria-label={label} className="mt-6">
    <Skeleton className="h-3 w-20" />
    <Skeleton className="mt-6 h-72 w-full rounded-xl" />
  </div>
);

export const ReviewView: React.FC<ReviewViewProps> = ({ document }) => {
  const t = useTranslations("review");
  const { data: dueCards, isLoading, error } = useDueFlashcards(document?.id);
  const back = document
    ? { href: ROUTES.documentFlashcards(document.id), label: t("backToFlashcards") }
    : { href: ROUTES.workspace, label: t("backToWorkspace") };

  return (
    <StudyPageLayout back={back} eyebrow={document?.name ?? t("allDocuments")} title={t("title")}>
      {isLoading && <SessionSkeleton label={t("loading")} />}
      {error && <ApiErrorMessage errorKey={getApiErrorKey(error)} className="py-10" />}
      {dueCards && <ReviewSession dueCards={dueCards} documentId={document?.id} back={back} />}
    </StudyPageLayout>
  );
};
