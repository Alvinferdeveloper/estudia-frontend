import { useState } from "react";
import { useTranslations } from "next-intl";
import type { AttemptRef, AttemptView } from "@/app/[locale]/document/[id]/components/exam/hooks/useExam";
import { useSimulationSession } from "@/app/[locale]/document/[id]/components/exam/hooks/useSimulationSession";
import { useCountdown } from "@/app/[locale]/document/[id]/components/exam/hooks/useCountdown";
import { needsModifierEnter, useEnterShortcut } from "@/app/[locale]/document/[id]/components/exam/hooks/useEnterShortcut";
import { ExamHeader } from "@/app/[locale]/document/[id]/components/exam/components/ExamHeader";
import { ExamAction, ExamFooter } from "@/app/[locale]/document/[id]/components/exam/components/ExamFooter";
import { QuestionHeading } from "@/app/[locale]/document/[id]/components/exam/components/QuestionHeading";
import { QuestionNavigator } from "@/app/[locale]/document/[id]/components/exam/components/QuestionNavigator";
import { CountdownClock } from "@/app/[locale]/document/[id]/components/exam/components/CountdownClock";
import { AnswerInput } from "@/app/[locale]/document/[id]/components/exam/components/AnswerInput";
import { ApiErrorMessage } from "@/components/api-error-message";
import { Button } from "@/components/ui/button";

interface SimulationRunnerProps {
  attemptRef: AttemptRef;
  view: AttemptView;
  // When the client received `view`, to read its server time correctly.
  receivedAt: number;
}

// Simulation: a countdown, free movement between questions, no feedback until it is handed in.
export const SimulationRunner = ({ attemptRef, view, receivedAt }: SimulationRunnerProps) => {
  const t = useTranslations("exam");
  const session = useSimulationSession(attemptRef, view);
  const [isConfirming, setIsConfirming] = useState(false);
  const [timeIsUp, setTimeIsUp] = useState(false);
  const { question, currentIndex, isLast, total, answeredCount } = session;

  const secondsLeft = useCountdown({
    deadline: view.attempt.deadline!,
    serverNow: view.serverNow,
    receivedAt,
    onExpire: () => {
      setTimeIsUp(true);
      session.submit();
    },
  });

  // Once time is up, answers are locked; a failed grading leaves only a retry.
  const locked = timeIsUp || session.isSubmitting;
  const unanswered = total - answeredCount;
  const advance = () => (isLast ? setIsConfirming(true) : session.goTo(currentIndex + 1));

  useEnterShortcut(advance, { enabled: !isConfirming && !locked, withModifier: needsModifierEnter(question) });

  return (
    <div className="flex min-h-dvh flex-col bg-background text-foreground">
      <ExamHeader documentId={view.exam.documentId} leaveLabel={t("simulation.leave")}>
        <CountdownClock secondsLeft={secondsLeft} />
        <span className="flex-1 text-xs text-muted-foreground">
          {t("session.progress", { answered: answeredCount, total })}
        </span>
        {!isLast && !locked && (
          <Button variant="ghost" size="sm" onClick={() => setIsConfirming(true)} className="h-7 text-xs">
            {t("simulation.handIn")}
          </Button>
        )}
      </ExamHeader>

      <QuestionNavigator
        total={total}
        currentIndex={currentIndex}
        isAnswered={(index) => session.isAnswered(view.questions[index].id)}
        onSelect={session.goTo}
      />

      <main className="flex-1">
        <article key={question.id} className="mx-auto w-full max-w-2xl px-4 py-8 animate-in fade-in duration-200 sm:py-10">
          <QuestionHeading question={question} number={currentIndex + 1} />
          <div className="mt-6">
            <AnswerInput question={question} value={session.draft} isSubmitting={locked} onChange={session.setDraft} />
            <ApiErrorMessage errorKey={session.errorKey} className="mt-4" />
          </div>
        </article>
      </main>

      <ExamFooter shortcut={isConfirming || locked ? undefined : needsModifierEnter(question) ? t("session.modifierEnter") : "Enter"}>
        {session.isSubmitting ? (
          <ExamAction isBusy>{t("simulation.grading")}</ExamAction>
        ) : timeIsUp ? (
          <>
            <p aria-live="assertive" className="mr-auto text-sm text-foreground">
              {t("simulation.timeUp")}
            </p>
            <ExamAction onClick={session.submit}>{t("simulation.handIn")}</ExamAction>
          </>
        ) : isConfirming ? (
          <>
            <p aria-live="polite" className="mr-auto text-sm text-foreground">
              {unanswered > 0 ? t("simulation.confirmUnanswered", { count: unanswered }) : t("simulation.confirmAll")}
            </p>
            <ExamAction variant="ghost" onClick={() => setIsConfirming(false)}>
              {t("simulation.keepGoing")}
            </ExamAction>
            <ExamAction onClick={session.submit}>{t("simulation.handIn")}</ExamAction>
          </>
        ) : (
          <>
            <ExamAction variant="ghost" disabled={currentIndex === 0} onClick={() => session.goTo(currentIndex - 1)}>
              {t("simulation.previous")}
            </ExamAction>
            <ExamAction onClick={advance}>{isLast ? t("simulation.handIn") : t("session.next")}</ExamAction>
          </>
        )}
      </ExamFooter>
    </div>
  );
};
