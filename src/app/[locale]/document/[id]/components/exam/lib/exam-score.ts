import type { AttemptSummary } from "@/app/[locale]/document/[id]/components/exam/hooks/useExam";

export type ScoreTone = "success" | "warning" | "danger";

// Answers are graded 0-10; an attempt's score is 0-100. Same thresholds as the API's PASSING_SCORE.
const STRONG_ANSWER = 7;
const PASSING_ANSWER = 5;

export const answerTone = (score: number): ScoreTone =>
  score >= STRONG_ANSWER ? "success" : score >= PASSING_ANSWER ? "warning" : "danger";

export const attemptTone = (score: number): ScoreTone => answerTone(score / 10);

// Attempt scores are shown on the same /10 scale as answers.
export const toTenScale = (score: number) => score / 10;

// Message keys under `exam.session`.
export const VERDICT_KEY = {
  success: "correct",
  warning: "partial",
  danger: "incorrect",
} as const satisfies Record<ScoreTone, string>;

// Filled, so the state color never carries text contrast on its own (warning is too light as text on paper).
export const TONE_FILL: Record<ScoreTone, string> = {
  success: "bg-success text-success-foreground",
  warning: "bg-warning text-warning-foreground",
  danger: "bg-danger text-danger-foreground",
};

export const bestScore = (attempts: AttemptSummary[]): number | null => {
  const scores = attempts.flatMap((a) => (a.score === null ? [] : [a.score]));
  return scores.length ? Math.max(...scores) : null;
};
