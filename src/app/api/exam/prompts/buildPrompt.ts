export type QuestionType = 'open' | 'multiple_choice' | 'true_false' | 'fill_blank' | 'mixed';

export const EXAM_ACTIONS = {
  GENERATE_QUESTIONS: 'generate_questions',
  EVALUATE_ANSWER: 'evaluate_answer',
} as const;

const DIFFICULTY_INSTRUCTIONS = {
  easy: 'Generate simple questions that test basic understanding and recall.',
  medium: 'Generate questions that require analysis and explanation.',
  hard: 'Generate complex questions that require synthesis, evaluation, and deep understanding.',
};

const TYPE_PROMPTS: Record<Exclude<QuestionType, 'mixed'>, string> = {
  open: 'Generate open-ended questions where the student must provide a detailed written answer.',
  multiple_choice: 'Generate multiple choice questions with 4 options (A, B, C, D). One option should be correct, others plausible but wrong. Include the correctAnswer field.',
  true_false: 'Generate true/false questions where students answer with "true" or "false". Include the correctAnswer field.',
  fill_blank: 'Generate fill-in-the-blank questions where students complete a sentence or answer with a short phrase. Include the correctAnswer field.',
};

export function buildGenerateQuestionsPrompt({
  content,
  pages,
  difficulty,
  type,
  count,
}: {
  content: string;
  pages: number[];
  difficulty: "easy" | "medium" | "hard" | string;
  type: Exclude<QuestionType, 'mixed'>;
  count: number;
}): string {
  const diffInst = DIFFICULTY_INSTRUCTIONS[difficulty as keyof typeof DIFFICULTY_INSTRUCTIONS] || DIFFICULTY_INSTRUCTIONS.medium;
  const typeInst = TYPE_PROMPTS[type] || TYPE_PROMPTS.open;

  let formatInstruction = '';
  if (type === 'multiple_choice') {
    formatInstruction = `Format as JSON:\n[\n  {"text": "Question text?", "options": ["A) Option 1", "B) Option 2", "C) Option 3", "D) Option 4"], "correctAnswer": "A", "type": "${type}"}\n]`;
  } else if (type === 'true_false') {
    formatInstruction = `Format as JSON:\n[\n  {"text": "Statement to evaluate as true or false", "correctAnswer": "true", "type": "${type}"}\n]`;
  } else if (type === 'fill_blank') {
    formatInstruction = `Format as JSON:\n[\n  {"text": "The capital of France is ___.", "correctAnswer": "Paris", "type": "${type}"}\n]`;
  } else {
    formatInstruction = `Format as JSON:\n[\n  {"text": "Question 1", "idealAnswer": "Answer 1", "type": "${type}"}\n]`;
  }

  return `Based on the following content from pages ${pages.join(', ')} of a document:

${content}

${diffInst}

${typeInst}

Generate exactly ${count} questions.

${formatInstruction}

Respond ONLY with valid JSON, no additional text.`;
}

export function buildEvaluateAnswerPrompt({
  question,
  userAnswer,
  idealAnswer,
}: {
  question: string;
  userAnswer: string;
  idealAnswer: string;
}): string {
  return `You are an AI tutor evaluating a student's answer.

Question: ${question}

Student's Answer: ${userAnswer}

Ideal Answer: ${idealAnswer}

Evaluate the student's answer and provide:
1. A score from 0-10
2. Constructive feedback

Respond as JSON:
{"score": 7, "feedback": "Your answer covers the main points but could be more detailed..."}`;
}
