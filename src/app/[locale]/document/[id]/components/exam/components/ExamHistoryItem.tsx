import { ChevronRight } from "lucide-react";
import { useFormatter, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { ROUTES } from "@/config/routes";
import {
  ATTEMPT_STATUS,
  type AttemptSummary,
  type ExamWithAttempts,
  type AttemptMode,
  isDifficultyLevel,
} from "@/app/[locale]/document/[id]/components/exam/hooks/useExam";
import { attemptTone, bestScore, toTenScale } from "@/app/[locale]/document/[id]/components/exam/lib/exam-score";
import { ToneMark } from "@/app/[locale]/document/[id]/components/exam/components/ToneMark";
import { RetakeMenu } from "@/app/[locale]/document/[id]/components/exam/components/RetakeMenu";

interface ExamHistoryItemProps {
  exam: ExamWithAttempts;
  onRetake: (mode: AttemptMode) => void;
  isRetaking: boolean;
  retakeDisabled: boolean;
}

const AttemptRow = ({ exam, attempt }: { exam: ExamWithAttempts; attempt: AttemptSummary }) => {
  const t = useTranslations("exam");
  const format = useFormatter();
  const inProgress = attempt.status === ATTEMPT_STATUS.IN_PROGRESS;

  return (
    <li>
      <Link
        href={ROUTES.examAttempt(exam.documentId, exam.id, attempt.id)}
        className="press-feedback group flex items-center gap-3 rounded-lg px-2 py-2.5 text-sm transition-colors duration-150 hover:bg-accent/60"
      >
        {inProgress || attempt.score === null ? (
          <span aria-hidden className="h-5 w-5 shrink-0 rounded-full border border-dashed border-muted-foreground/50" />
        ) : (
          <ToneMark tone={attemptTone(attempt.score)} />
        )}
        <span className="flex-1 text-muted-foreground">
          {format.dateTime(new Date(attempt.startedAt), { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
          <span className="ml-2 text-xs">{t(`modes.${attempt.mode}.title`)}</span>
        </span>
        <span className="font-mono font-semibold tabular-nums text-foreground">
          {inProgress || attempt.score === null
            ? t("history.inProgress")
            : t("history.score", { score: format.number(toTenScale(attempt.score), { maximumFractionDigits: 1 }) })}
        </span>
        <span className="w-16 text-right text-xs text-muted-foreground group-hover:text-foreground">
          {inProgress ? t("history.continue") : t("history.review")}
        </span>
        <ChevronRight aria-hidden className="h-4 w-4 text-muted-foreground/60" />
      </Link>
    </li>
  );
};

export const ExamHistoryItem: React.FC<ExamHistoryItemProps> = ({ exam, onRetake, isRetaking, retakeDisabled }) => {
  const t = useTranslations("exam");
  const format = useFormatter();
  const best = bestScore(exam.attempts);

  return (
    <section className="py-6">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h2 className="truncate text-base font-semibold text-foreground">{exam.title}</h2>
          <p className="mt-1 flex flex-wrap gap-x-2 text-sm text-muted-foreground">
            <span>{t("questionCount", { count: exam.totalQuestions })}</span>
            {isDifficultyLevel(exam.difficulty) && (
              <>
                <span aria-hidden>·</span>
                <span>{t(`difficulty.${exam.difficulty}`)}</span>
              </>
            )}
            {exam.questionType && (
              <>
                <span aria-hidden>·</span>
                <span>{t(`questionTypes.${exam.questionType}`)}</span>
              </>
            )}
            <span aria-hidden>·</span>
            <span>{format.dateTime(new Date(exam.createdAt), { day: "numeric", month: "short", year: "numeric" })}</span>
          </p>
          {best !== null && (
            <p className="mt-1 text-sm text-muted-foreground">
              {t("history.best", { score: format.number(toTenScale(best), { maximumFractionDigits: 1 }) })}
            </p>
          )}
        </div>
        <RetakeMenu appearance="quiet" onRetake={onRetake} isPending={isRetaking} disabled={retakeDisabled} />
      </div>

      {exam.attempts.length > 0 && (
        <ul className="-mx-2 mt-3" aria-label={t("history.attempts")}>
          {exam.attempts.map((attempt) => (
            <AttemptRow key={attempt.id} exam={exam} attempt={attempt} />
          ))}
        </ul>
      )}
    </section>
  );
};
