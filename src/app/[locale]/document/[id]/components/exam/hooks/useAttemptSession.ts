import { useCallback, useState } from "react";
import { getApiErrorKey } from "@/lib/api-errors";
import {
  type AttemptRef,
  type AttemptView,
  useAnswerQuestion,
  useFinishAttempt,
} from "@/app/[locale]/document/[id]/components/exam/hooks/useExam";

// Taking an in-progress attempt. Answers live on the server, so a reload resumes at the first unanswered question.
export const useAttemptSession = (ref: AttemptRef, view: AttemptView) => {
  const { questions, answers } = view;
  const [currentIndex, setCurrentIndex] = useState(() => {
    const answered = new Set(answers.map((a) => a.questionId));
    const next = questions.findIndex((q) => !answered.has(q.id));
    return next === -1 ? questions.length - 1 : next;
  });
  const [draft, setDraft] = useState("");
  const answerQuestion = useAnswerQuestion(ref);
  const finishAttempt = useFinishAttempt(ref);

  const question = questions[currentIndex];
  const answer = answers.find((a) => a.questionId === question.id) ?? null;
  const isLast = currentIndex === questions.length - 1;

  const submit = useCallback(() => {
    if (!draft.trim() || answerQuestion.isPending) return;
    answerQuestion.mutate(
      { questionId: question.id, userAnswer: draft },
      { onSuccess: () => setDraft("") }
    );
  }, [draft, question.id, answerQuestion]);

  const next = useCallback(() => {
    answerQuestion.reset();
    setCurrentIndex((index) => Math.min(index + 1, questions.length - 1));
  }, [answerQuestion, questions.length]);

  const finish = useCallback(() => finishAttempt.mutate(), [finishAttempt]);

  return {
    question,
    answer,
    currentIndex,
    total: questions.length,
    answeredCount: answers.length,
    isLast,
    draft,
    setDraft,
    submit,
    next,
    finish,
    isSubmitting: answerQuestion.isPending,
    isFinishing: finishAttempt.isPending,
    errorKey: answerQuestion.error ? getApiErrorKey(answerQuestion.error) : null,
  };
};

export type AttemptSession = ReturnType<typeof useAttemptSession>;
