import { useMutation, useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api-client";

export const QUESTION_TYPES = {
  OPEN: 'open',
  MULTIPLE_CHOICE: 'multiple_choice',
  TRUE_FALSE: 'true_false',
  FILL_BLANK: 'fill_blank',
  MIXED: 'mixed',
} as const;

export type QuestionType = typeof QUESTION_TYPES[keyof typeof QUESTION_TYPES];

export const EXAM_PHASES = {
  INACTIVE: 'inactive',
  SETUP: 'setup',
  GENERATING: 'generating',
  EXAM: 'exam',
  RESULTS: 'results',
} as const;

export type ExamPhase = typeof EXAM_PHASES[keyof typeof EXAM_PHASES];

export const DIFFICULTY_LEVELS = {
  EASY: 'easy',
  MEDIUM: 'medium',
  HARD: 'hard',
} as const;

export type DifficultyLevel = typeof DIFFICULTY_LEVELS[keyof typeof DIFFICULTY_LEVELS];

export const isDifficultyLevel = (value: string): value is DifficultyLevel =>
  (Object.values(DIFFICULTY_LEVELS) as string[]).includes(value);

export const EXAM_MODES = {
  QUICK_REVIEW: 'quick_review',
  EXAM_SIMULATION: 'exam_simulation',
  CUSTOM: 'custom',
} as const;

export type ExamModeType = typeof EXAM_MODES[keyof typeof EXAM_MODES];

export interface Exam {
  id: string;
  documentId: string;
  pages: number[];
  mode: string;
  totalQuestions: number;
  title: string;
  difficulty: string;
  questionType?: QuestionType;
  createdAt: string;
}

export interface ExamResult {
  id: string;
  examId: string;
  score: number | null;
  correctAnswers: number;
  totalQuestions: number;
  createdAt: string;
}

export interface Question {
  id: string;
  examId?: string;
  text: string;
  type?: QuestionType;
  options?: string[];
  order?: number;
  idealAnswer: string | null;
}

export interface Answer {
  id?: string;
  questionId: string;
  userAnswer: string;
  score: number | null;
  feedback: string | null;
}

export interface ExamResults {
  exam: Exam;
  questions: Question[];
  answers: Answer[];
  averageScore: number;
}

export interface GenerateExamRequest {
  documentId: string;
  pages: number[];
  // Text of the selected pages, extracted from the PDF in the browser.
  content: string;
  mode: string;
  difficulty: string;
  questionType: QuestionType;
  title: string;
}

export const useGenerateExam = () => {
  return useMutation({
    mutationFn: async (request: GenerateExamRequest) => {
      const { data } = await api.post<{ exam: Exam; questions: RawExamQuestion[] }>("/exam/generate", request);
      return { exam: data.exam, questions: data.questions.map(toQuestion) };
    },
    meta: { inlineError: true },
  });
};

export const useEvaluateAnswer = () => {
  return useMutation({
    mutationFn: async ({ examId, questionId, userAnswer }: { examId: string; questionId: string; userAnswer: string }) => {
      const { data } = await api.post<{ score: number; feedback: string }>(
        `/exam/${examId}/questions/${questionId}/evaluate`,
        { userAnswer }
      );
      return data;
    },
    meta: { inlineError: true },
  });
};

export const useSaveExamResult = () => {
  return useMutation({
    mutationFn: async (data: {
      examId: string;
      score: number;
      correctAnswers: number;
      totalQuestions: number;
    }) => {
      const { data: result } = await api.post<ExamResult>("/exam/result", data);
      return result;
    },
  });
};

export const useExamResults = (examId: string) => {
  return useQuery({
    queryKey: ['examResults', examId],
    queryFn: async () => {
      const { data } = await api.get<ExamResult[]>(`/exam/${examId}/results`);
      return data;
    },
    enabled: !!examId,
  });
};

export interface ExamStats {
  attemptCount: number;
  highestScore: number | null;
  lowestScore: number | null;
  lastScore: number | null;
  lastAttemptAt: string | null;
}

export function computeExamStats(results: ExamResult[]): ExamStats {
  if (results.length === 0) {
    return {
      attemptCount: 0,
      highestScore: null,
      lowestScore: null,
      lastScore: null,
      lastAttemptAt: null,
    };
  }

  const scored = results.filter((r) => r.score !== null) as (ExamResult & { score: number })[];
  const sortedByDate = [...results].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return {
    attemptCount: results.length,
    highestScore: scored.length ? Math.max(...scored.map((r) => r.score)) : null,
    lowestScore: scored.length ? Math.min(...scored.map((r) => r.score)) : null,
    lastScore: sortedByDate[0].score,
    lastAttemptAt: sortedByDate[0].createdAt,
  };
}

interface RawExamQuestion {
  id: string;
  examId: string;
  order: number;
  text: string;
  type?: QuestionType | null;
  options?: string | null;
  idealAnswer: string | null;
}

const toQuestion = (q: RawExamQuestion): Question => ({
  id: q.id,
  examId: q.examId,
  text: q.text,
  type: q.type ?? undefined,
  options: q.options ? JSON.parse(q.options) : undefined,
  order: q.order,
  idealAnswer: q.idealAnswer,
});

export const fetchExamQuestions = async (examId: string): Promise<Question[]> => {
  const { data } = await api.get<RawExamQuestion[]>(`/exam/${examId}/questions`);
  return data.map(toQuestion);
};

export const useUserExams = (documentId?: string) => {
  return useQuery({
    queryKey: ['exams', documentId],
    queryFn: async () => {
      const url = documentId
        ? `/exam?documentId=${documentId}`
        : "/exam";
      const { data } = await api.get<Exam[]>(url);
      return data;
    },
  });
};
