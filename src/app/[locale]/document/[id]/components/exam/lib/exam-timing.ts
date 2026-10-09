import { QUESTION_TYPES, type AttemptSummary, type QuestionType } from "@/app/[locale]/document/[id]/components/exam/hooks/useExam";

type SingleType = Exclude<QuestionType, typeof QUESTION_TYPES.MIXED>;

// Mirrors estudia-api `exam/exam-timing.ts`, to preview a simulation's time limit before generating.
const SECONDS_PER_QUESTION: Record<SingleType, number> = {
  [QUESTION_TYPES.OPEN]: 180,
  [QUESTION_TYPES.FILL_BLANK]: 90,
  [QUESTION_TYPES.MULTIPLE_CHOICE]: 60,
  [QUESTION_TYPES.TRUE_FALSE]: 45,
};

// A mixed exam splits its questions over these types in this order, like the API's generator.
const MIXED_ORDER: SingleType[] = [
  QUESTION_TYPES.OPEN,
  QUESTION_TYPES.MULTIPLE_CHOICE,
  QUESTION_TYPES.TRUE_FALSE,
  QUESTION_TYPES.FILL_BLANK,
];

export const simulationTimeLimit = (questionType: QuestionType, count: number): number => {
  if (questionType !== QUESTION_TYPES.MIXED) return SECONDS_PER_QUESTION[questionType] * count;
  return MIXED_ORDER.reduce((total, type, index) => {
    const share = Math.floor(count / MIXED_ORDER.length) + (index < count % MIXED_ORDER.length ? 1 : 0);
    return total + SECONDS_PER_QUESTION[type] * share;
  }, 0);
};

// "m:ss", or "h:mm:ss" from an hour up.
export const formatDuration = (totalSeconds: number): string => {
  const seconds = Math.max(0, Math.floor(totalSeconds));
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = String(seconds % 60).padStart(2, "0");
  return h > 0 ? `${h}:${String(m).padStart(2, "0")}:${s}` : `${m}:${s}`;
};

// How long a finished attempt took, capped at its limit (grading after the deadline doesn't count).
export const attemptDuration = ({ startedAt, finishedAt, timeLimitSeconds }: AttemptSummary): number | null => {
  if (!finishedAt) return null;
  const seconds = (new Date(finishedAt).getTime() - new Date(startedAt).getTime()) / 1000;
  return timeLimitSeconds === null ? seconds : Math.min(seconds, timeLimitSeconds);
};
