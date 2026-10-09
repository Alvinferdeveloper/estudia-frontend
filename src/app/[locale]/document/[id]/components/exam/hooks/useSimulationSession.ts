import { useCallback, useRef, useState } from "react";
import { getApiErrorKey } from "@/lib/api-errors";
import {
  type AttemptRef,
  type AttemptView,
  useAnswerQuestion,
  useFinishAttempt,
} from "@/app/[locale]/document/[id]/components/exam/hooks/useExam";
import { resumeIndex } from "@/app/[locale]/document/[id]/components/exam/lib/attempt-progress";

const toAnswerMap = (view: AttemptView) =>
  Object.fromEntries(view.answers.map((a) => [a.questionId, a.userAnswer]));

// Taking a simulation: answers are free to change until submitted, then everything is graded at once.
// Each answer is saved when leaving its question, so a reload or the deadline never loses more than one.
export const useSimulationSession = (ref: AttemptRef, view: AttemptView) => {
  const { questions } = view;
  const [currentIndex, setCurrentIndex] = useState(() => resumeIndex(view));
  const [drafts, setDrafts] = useState<Record<string, string>>(() => toAnswerMap(view));
  const savedRef = useRef<Record<string, string>>(toAnswerMap(view));
  const answerQuestion = useAnswerQuestion(ref);
  const finishAttempt = useFinishAttempt(ref);

  const question = questions[currentIndex];
  const draft = drafts[question.id] ?? "";
  const isAnswered = (questionId: string) => Boolean(drafts[questionId]?.trim());
  const answeredCount = questions.filter((q) => isAnswered(q.id)).length;

  const setDraft = useCallback(
    (value: string) => setDrafts((current) => ({ ...current, [question.id]: value })),
    [question.id]
  );

  // Sends the current answer if it changed since the last save; an emptied one is sent too, to clear it.
  const saveCurrent = useCallback(async () => {
    const value = drafts[question.id] ?? "";
    const saved = savedRef.current[question.id];
    if (value === saved || (saved === undefined && !value.trim())) return;
    await answerQuestion.mutateAsync({ questionId: question.id, userAnswer: value });
    savedRef.current[question.id] = value;
  }, [drafts, question.id, answerQuestion]);

  const goTo = useCallback(
    (index: number) => {
      // A failed save shows inline and the draft stays, so it's retried on the next move.
      saveCurrent().catch(() => undefined);
      setCurrentIndex(Math.max(0, Math.min(index, questions.length - 1)));
    },
    [saveCurrent, questions.length]
  );

  // Past the deadline the last save is refused, but what was saved before still gets graded.
  const submit = useCallback(async () => {
    await saveCurrent().catch(() => undefined);
    finishAttempt.mutate();
  }, [saveCurrent, finishAttempt]);

  return {
    question,
    currentIndex,
    total: questions.length,
    isLast: currentIndex === questions.length - 1,
    draft,
    setDraft,
    isAnswered,
    answeredCount,
    goTo,
    submit,
    isSaving: answerQuestion.isPending,
    isSubmitting: finishAttempt.isPending,
    errorKey: answerQuestion.error ? getApiErrorKey(answerQuestion.error) : null,
  };
};
