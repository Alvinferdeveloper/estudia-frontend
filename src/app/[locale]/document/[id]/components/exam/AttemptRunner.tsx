import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { type AttemptRef, type AttemptView, QUESTION_TYPES } from "@/app/[locale]/document/[id]/components/exam/hooks/useExam";
import { useAttemptSession } from "@/app/[locale]/document/[id]/components/exam/hooks/useAttemptSession";
import { ExamHeader } from "@/app/[locale]/document/[id]/components/exam/components/ExamHeader";
import { ExamFooter } from "@/app/[locale]/document/[id]/components/exam/components/ExamFooter";
import { AnswerInput } from "@/app/[locale]/document/[id]/components/exam/components/AnswerInput";
import { AnswerFeedback } from "@/app/[locale]/document/[id]/components/exam/components/AnswerFeedback";
import { ApiErrorMessage } from "@/components/api-error-message";

// Written answers need Enter for new lines, so they submit with Ctrl/Cmd + Enter.
const isWrittenAnswer = (type: string | null) => type !== QUESTION_TYPES.MULTIPLE_CHOICE && type !== QUESTION_TYPES.TRUE_FALSE;

export const AttemptRunner = ({ attemptRef, view }: { attemptRef: AttemptRef; view: AttemptView }) => {
  const t = useTranslations("exam");
  const session = useAttemptSession(attemptRef, view);
  const { question, answer, isLast } = session;
  const needsModifier = !answer && isWrittenAnswer(question.type);

  const primary = answer
    ? isLast
      ? { label: t("session.seeResults"), action: session.finish, busy: session.isFinishing, disabled: false }
      : { label: t("session.next"), action: session.next, busy: false, disabled: false }
    : { label: t("session.evaluate"), action: session.submit, busy: session.isSubmitting, disabled: !session.draft.trim() };

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Enter" || event.shiftKey || primary.disabled || primary.busy) return;
      if (needsModifier && !(event.ctrlKey || event.metaKey)) return;
      event.preventDefault();
      primary.action();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [primary, needsModifier]);

  return (
    <div className="flex min-h-dvh flex-col bg-background text-foreground">
      <ExamHeader
        documentId={view.exam.documentId}
        answeredCount={session.answeredCount}
        total={session.total}
        onFinish={session.finish}
        isFinishing={session.isFinishing}
      />

      <main className="flex-1">
        <article key={question.id} className="mx-auto w-full max-w-2xl px-4 py-10 animate-in fade-in duration-200 sm:py-14">
          <p className="mb-4 flex items-center gap-3 text-xs font-medium uppercase tracking-[0.08em] text-muted-foreground">
            <span className="font-mono tabular-nums text-foreground">
              {String(session.currentIndex + 1).padStart(2, "0")}
            </span>
            {question.type && t(`questionTypes.${question.type}`)}
          </p>

          <h1 className="max-w-[65ch] text-balance text-xl font-semibold leading-snug tracking-tight sm:text-2xl">
            {question.text}
          </h1>

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

      <ExamFooter
        label={primary.label}
        shortcut={needsModifier ? t("session.modifierEnter") : "Enter"}
        isBusy={primary.busy}
        disabled={primary.disabled}
        onAction={primary.action}
      />
    </div>
  );
};
