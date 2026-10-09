"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { ROUTES } from "@/config/routes";
import { getApiErrorKey } from "@/lib/api-errors";
import { ApiErrorMessage } from "@/components/api-error-message";
import { ATTEMPT_MODES, ATTEMPT_STATUS, type AttemptRef, useAttempt } from "@/app/[locale]/document/[id]/components/exam/hooks/useExam";
import { PracticeRunner } from "@/app/[locale]/document/[id]/components/exam/PracticeRunner";
import { SimulationRunner } from "@/app/[locale]/document/[id]/components/exam/SimulationRunner";
import { AttemptResults } from "@/app/[locale]/document/[id]/components/exam/AttemptResults";

interface AttemptScreenProps extends AttemptRef {
  documentId: string;
}

// An attempt by URL: taken in its mode while in progress, reviewed once finished.
export const AttemptScreen = ({ documentId, examId, attemptId }: AttemptScreenProps) => {
  const t = useTranslations("exam");
  const { data: view, error, dataUpdatedAt } = useAttempt({ examId, attemptId });

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

  if (view.attempt.status === ATTEMPT_STATUS.COMPLETED) return <AttemptResults view={view} />;

  return view.attempt.mode === ATTEMPT_MODES.SIMULATION ? (
    <SimulationRunner attemptRef={{ examId, attemptId }} view={view} receivedAt={dataUpdatedAt} />
  ) : (
    <PracticeRunner attemptRef={{ examId, attemptId }} view={view} />
  );
};
