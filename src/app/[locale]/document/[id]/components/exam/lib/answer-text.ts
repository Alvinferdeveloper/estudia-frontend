import { QUESTION_TYPES, type Question } from "@/app/[locale]/document/[id]/components/exam/hooks/useExam";

// The model may write the ideal true/false answer in the exam's language; the API accepts the same set.
const TRUE_VALUES = ["true", "verdadero", "v", "1"];

const isTrue = (value: string) => TRUE_VALUES.includes(value.toLowerCase().trim());

// Readable text for a stored answer: option letters become the option, true/false a translated label.
export const answerText = (
  question: Question,
  value: string,
  labels: { true: string; false: string }
): string => {
  if (question.type === QUESTION_TYPES.MULTIPLE_CHOICE && question.options) {
    const index = value.trim().toUpperCase().charCodeAt(0) - 65;
    return question.options[index] ?? value;
  }
  if (question.type === QUESTION_TYPES.TRUE_FALSE) {
    return isTrue(value) ? labels.true : labels.false;
  }
  return value;
};
