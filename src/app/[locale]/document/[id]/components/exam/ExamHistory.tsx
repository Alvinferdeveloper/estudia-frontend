"use client";

import { ArrowLeft } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { ROUTES } from "@/config/routes";
import { getApiErrorKey } from "@/lib/api-errors";
import { ApiErrorMessage } from "@/components/api-error-message";
import { useUserExams } from "@/app/[locale]/document/[id]/components/exam/hooks/useExam";
import { useRetakeExam } from "@/app/[locale]/document/[id]/components/exam/hooks/useRetakeExam";
import { ExamHistoryItem } from "@/app/[locale]/document/[id]/components/exam/components/ExamHistoryItem";

interface ExamHistoryProps {
  documentId: string;
  documentName: string;
}

// Every exam made from a document, with its attempts to continue or review.
export const ExamHistory = ({ documentId, documentName }: ExamHistoryProps) => {
  const t = useTranslations("exam");
  const { data: exams, isLoading, error } = useUserExams(documentId);
  const { retake, pendingExamId } = useRetakeExam(documentId);

  return (
    <div className="min-h-dvh bg-background text-foreground">
      <div className="mx-auto w-full max-w-2xl px-4 pb-16 pt-6">
        <Link
          href={ROUTES.document(documentId)}
          className="press-feedback -ml-2 inline-flex items-center gap-1.5 rounded-full px-2 py-1.5 text-sm text-muted-foreground transition-colors duration-150 hover:bg-accent hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          {t("backToDocument")}
        </Link>

        <header className="mt-10 border-b border-border pb-6">
          <p className="truncate text-xs font-medium uppercase tracking-[0.08em] text-muted-foreground">{documentName}</p>
          <h1 className="mt-2 font-serif text-4xl italic leading-tight">{t("myExams")}</h1>
        </header>

        {isLoading && (
          <div className="flex justify-center py-16">
            <div role="status" aria-label={t("loading")} className="h-6 w-6 animate-spin rounded-full border-2 border-primary/20 border-t-primary" />
          </div>
        )}

        {error && <ApiErrorMessage errorKey={getApiErrorKey(error)} className="py-10" />}

        {exams?.length === 0 && (
          <div className="py-16 text-center">
            <p className="text-base font-medium text-foreground">{t("history.emptyTitle")}</p>
            <p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">{t("history.emptyHint")}</p>
            <Link
              href={ROUTES.document(documentId)}
              className="press-feedback mt-6 inline-flex h-9 items-center rounded-full bg-primary px-5 text-sm font-medium text-primary-foreground transition-colors duration-150 hover:bg-primary/90"
            >
              {t("history.emptyAction")}
            </Link>
          </div>
        )}

        {exams && exams.length > 0 && (
          <div className="divide-y divide-border">
            {exams.map((exam) => (
              <ExamHistoryItem
                key={exam.id}
                exam={exam}
                onRetake={() => retake(exam.id)}
                isRetaking={pendingExamId === exam.id}
                retakeDisabled={pendingExamId !== null}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
