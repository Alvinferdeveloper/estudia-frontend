"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { ROUTES } from "@/config/routes";
import { getApiErrorKey } from "@/lib/api-errors";
import { ApiErrorMessage } from "@/components/api-error-message";
import { ATTEMPT_STATUS, type AttemptRef, useAttempt } from "@/app/[locale]/document/[id]/components/exam/hooks/useExam";
import { AttemptRunner } from "@/app/[locale]/document/[id]/components/exam/AttemptRunner";
import { AttemptResults } from "@/app/[locale]/document/[id]/components/exam/AttemptResults";

interface AttemptScreenProps extends AttemptRef {
  documentId: string;
}

// An attempt by URL: taken while in progress, reviewed once finished.
export const AttemptScreen = ({ documentId, examId, attemptId }: AttemptScreenProps) => {
  const t = useTranslations("exam");
  const { data: view, error } = useAttempt({ examId, attemptId });

  if (error) {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center gap-4 bg-background px-4 text-center">
        <ApiErrorMessage errorKey={getApiErrorKey(error)} />
        <Link href={ROUTES.documentExams(documentId)} className="text-sm text-muted-foreground underline underline-offset-4 hover:text-foreground">
          {t("allExams")}
        </Link>
      </div>
    );
  }

  if (!view) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-background">
        <div role="status" aria-label={t("loading")} className="h-6 w-6 animate-spin rounded-full border-2 border-primary/20 border-t-primary" />
      </div>
    );
  }

  return view.attempt.status === ATTEMPT_STATUS.COMPLETED ? (
    <AttemptResults view={view} />
  ) : (
    <AttemptRunner attemptRef={{ examId, attemptId }} view={view} />
  );
};
