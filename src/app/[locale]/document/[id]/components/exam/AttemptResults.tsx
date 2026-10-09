import { ArrowLeft } from "lucide-react";
import { useFormatter, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { ROUTES } from "@/config/routes";
import { ATTEMPT_MODES, type AttemptView, isDifficultyLevel, isGraded } from "@/app/[locale]/document/[id]/components/exam/hooks/useExam";
import { useRetakeExam } from "@/app/[locale]/document/[id]/components/exam/hooks/useRetakeExam";
import { attemptTone, toTenScale } from "@/app/[locale]/document/[id]/components/exam/lib/exam-score";
import { ToneMark } from "@/app/[locale]/document/[id]/components/exam/components/ToneMark";
import { AnswerReview } from "@/app/[locale]/document/[id]/components/exam/components/AnswerReview";
import { RetakeMenu } from "@/app/[locale]/document/[id]/components/exam/components/RetakeMenu";
import { attemptDuration, formatDuration } from "@/app/[locale]/document/[id]/components/exam/lib/exam-timing";

// A finished attempt: the score as the moment of ceremony, then a question-by-question review.
export const AttemptResults = ({ view }: { view: AttemptView }) => {
  const t = useTranslations("exam");
  const format = useFormatter();
  const { attempt, exam, questions, answers } = view;
  const { retake, pendingExamId } = useRetakeExam(exam.documentId);
  const score = attempt.score ?? 0;
  const tone = attemptTone(score);
  const duration = attempt.mode === ATTEMPT_MODES.SIMULATION ? attemptDuration(attempt) : null;

  return (
    <div className="min-h-dvh bg-background text-foreground">
      <div className="mx-auto w-full max-w-2xl px-4 pb-16 pt-6">
        <nav className="flex items-center justify-between text-sm">
          <Link
            href={ROUTES.document(exam.documentId)}
            className="press-feedback -ml-2 flex items-center gap-1.5 rounded-full px-2 py-1.5 text-muted-foreground transition-colors duration-150 hover:bg-accent hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            {t("backToDocument")}
          </Link>
          <Link
            href={ROUTES.documentExams(exam.documentId)}
            className="rounded-full px-2 py-1.5 text-muted-foreground underline-offset-4 transition-colors duration-150 hover:text-foreground hover:underline"
          >
            {t("allExams")}
          </Link>
        </nav>

        <header className="mt-12 border-b border-border pb-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <p className="text-xs font-medium uppercase tracking-[0.08em] text-muted-foreground">
            {t("results.finished", { mode: attempt.mode })}
          </p>
          <h1 className="mt-2 text-balance text-xl font-semibold tracking-tight">{exam.title}</h1>

          <p className="mt-8 flex items-baseline gap-2">
            <span className="font-serif text-7xl italic leading-none tabular-nums">
              {format.number(toTenScale(score), { maximumFractionDigits: 1 })}
            </span>
            <span className="text-lg text-muted-foreground">/10</span>
          </p>

          <p className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5 font-medium text-foreground">
              <ToneMark tone={tone} />
              {t(`results.verdict.${tone}`)}
            </span>
            <span>{t("results.correctCount", { correct: attempt.correctAnswers, total: attempt.totalQuestions })}</span>
            {duration !== null && attempt.timeLimitSeconds !== null && (
              <>
                <span aria-hidden>·</span>
                <span className="tabular-nums">
                  {t("results.timeUsed", { used: formatDuration(duration), limit: formatDuration(attempt.timeLimitSeconds) })}
                </span>
              </>
            )}
            <span aria-hidden>·</span>
            <span>{t("results.pages", { count: exam.pages.length })}</span>
            {isDifficultyLevel(exam.difficulty) && (
              <>
                <span aria-hidden>·</span>
                <span>{t(`difficulty.${exam.difficulty}`)}</span>
              </>
            )}
          </p>
        </header>

        <section className="mt-8">
          <h2 className="mb-2 text-xs font-medium uppercase tracking-[0.08em] text-muted-foreground">
            {t("results.review")}
          </h2>
          <ol className="-mx-2 divide-y divide-border">
            {questions.map((question, index) => (
              <AnswerReview
                key={question.id}
                number={index + 1}
                question={question}
                answer={answers.filter(isGraded).find((a) => a.questionId === question.id) ?? null}
              />
            ))}
          </ol>
        </section>

        <div className="mt-10 flex justify-end">
          <RetakeMenu appearance="primary" onRetake={(mode) => retake(exam.id, mode)} isPending={pendingExamId !== null} />
        </div>
      </div>
    </div>
  );
};
