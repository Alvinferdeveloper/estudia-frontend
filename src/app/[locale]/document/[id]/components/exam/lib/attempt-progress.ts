import type { AttemptView } from "@/app/[locale]/document/[id]/components/exam/hooks/useExam";

// Where a reopened attempt resumes: its first unanswered question, or the last one.
export const resumeIndex = ({ questions, answers }: AttemptView): number => {
  const answered = new Set(answers.map((a) => a.questionId));
  const next = questions.findIndex((q) => !answered.has(q.id));
  return next === -1 ? questions.length - 1 : next;
};
