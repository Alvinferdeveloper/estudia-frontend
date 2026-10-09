import { useTranslations } from "next-intl";
import type { AttemptRef, AttemptView } from "@/app/[locale]/document/[id]/components/exam/hooks/useExam";
import { usePracticeSession } from "@/app/[locale]/document/[id]/components/exam/hooks/usePracticeSession";
import { needsModifierEnter, useEnterShortcut } from "@/app/[locale]/document/[id]/components/exam/hooks/useEnterShortcut";
import { ExamHeader } from "@/app/[locale]/document/[id]/components/exam/components/ExamHeader";
import { ExamAction, ExamFooter } from "@/app/[locale]/document/[id]/components/exam/components/ExamFooter";
import { QuestionHeading } from "@/app/[locale]/document/[id]/components/exam/components/QuestionHeading";
import { AnswerInput } from "@/app/[locale]/document/[id]/components/exam/components/AnswerInput";
import { AnswerFeedback } from "@/app/[locale]/document/[id]/components/exam/components/AnswerFeedback";
import { Progress } from "@/components/ui/progress";
import { ApiErrorMessage } from "@/components/api-error-message";

// Practice: each answer is graded right away, with feedback before moving on.
export const PracticeRunner = ({ attemptRef, view }: { attemptRef: AttemptRef; view: AttemptView }) => {
  const t = useTranslations("exam.session");
  const session = usePracticeSession(attemptRef, view);
  const { question, answer, isLast, answeredCount, total } = session;
  const withModifier = !answer && needsModifierEnter(question);

  const primary = answer
    ? isLast
      ? { label: t("seeResults"), action: session.finish, busy: session.isFinishing, disabled: false }
      : { label: t("next"), action: session.next, busy: false, disabled: false }
    : { label: t("evaluate"), action: session.submit, busy: session.isSubmitting, disabled: !session.draft.trim() };

  useEnterShortcut(primary.action, { enabled: !primary.disabled && !primary.busy, withModifier });

  return (
    <div className="flex min-h-dvh flex-col bg-background text-foreground">
      <ExamHeader documentId={view.exam.documentId} leaveLabel={t("leave")}>
        <Progress
          value={(answeredCount / total) * 100}
          aria-label={t("progress", { answered: answeredCount, total })}
          className="h-1.5 flex-1 rounded-full bg-secondary"
        />
        <span className="font-mono text-xs font-semibold tabular-nums text-muted-foreground">
          {answeredCount}/{total}
        </span>
        {answeredCount > 0 && answeredCount < total && (
          <button
            onClick={session.finish}
            disabled={session.isFinishing}
            className="press-feedback rounded-full px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors duration-150 hover:bg-accent hover:text-foreground disabled:opacity-50"
          >
            {t("finishNow")}
          </button>
        )}
      </ExamHeader>

      <main className="flex-1">
        <article key={question.id} className="mx-auto w-full max-w-2xl px-4 py-10 animate-in fade-in duration-200 sm:py-14">
          <QuestionHeading question={question} number={session.currentIndex + 1} />
          <div className="mt-6">
            {answer ? (
              <AnswerFeedback question={question} answer={answer} />
            ) : (
              <>
                <AnswerInput
                  question={question}
                  value={session.draft}
                  isSubmitting={session.isSubmitting}
                  onChange={session.setDraft}
                />
                <ApiErrorMessage errorKey={session.errorKey} className="mt-4" />
              </>
            )}
          </div>
        </article>
      </main>

      <ExamFooter shortcut={withModifier ? t("modifierEnter") : "Enter"}>
        <ExamAction isBusy={primary.busy} disabled={primary.disabled} onClick={primary.action}>
          {primary.label}
        </ExamAction>
      </ExamFooter>
    </div>
  );
};
