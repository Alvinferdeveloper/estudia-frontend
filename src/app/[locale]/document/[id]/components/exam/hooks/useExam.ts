import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";

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

export const useGenerateQuestions = () => {
  return useMutation({
    mutationFn: async (data: {
      content: string;
      pages: number[];
      difficulty: string;
      questionType?: QuestionType;
      numQuestions?: number;
    }) => {
      const { data: result } = await axios.post<{ questions: any[] }>(
        `${process.env.NEXT_PUBLIC_API_URL}/ai/exam/generate`,
        data,
        { withCredentials: true }
      );
      return result.questions;
    },
  });
};

export const useEvaluateAnswer = () => {
  return useMutation({
    mutationFn: async (data: {
      userAnswer: string;
      idealAnswer: string;
      question: string;
      questionType?: QuestionType;
    }) => {
      const { data: result } = await axios.post<{ score: number; feedback: string }>(
        `${process.env.NEXT_PUBLIC_API_URL}/ai/exam/evaluate`,
        data,
        { withCredentials: true }
      );
      return result;
    },
  });
};

export const useCreateExam = () => {
  return useMutation({
    mutationFn: async (data: {
      documentId: string;
      pages: number[];
      mode: string;
      difficulty: string;
      title: string;
      questionType: QuestionType;
      totalQuestions: number;
    }) => {
      const { data: result } = await axios.post<{ id: string }>(
        `${process.env.NEXT_PUBLIC_API_URL}/exam`,
        data,
        { withCredentials: true }
      );
      return result;
    },
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
      const { data: result } = await axios.post<ExamResult>(
        `${process.env.NEXT_PUBLIC_API_URL}/exam/result`,
        data,
        { withCredentials: true }
      );
      return result;
    },
  });
};

export const useExamResults = (examId: string) => {
  return useQuery({
    queryKey: ['examResults', examId],
    queryFn: async () => {
      const { data } = await axios.get<ExamResult[]>(
        `${process.env.NEXT_PUBLIC_API_URL}/exam/${examId}/results`,
        { withCredentials: true }
      );
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

export const useSaveExamQuestions = () => {
  return useMutation({
    mutationFn: async (data: {
      examId: string;
      questions: { text: string; type: string; options?: string; idealAnswer: string; order: number }[];
    }) => {
      const { data: result } = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/exam/questions`,
        data,
        { withCredentials: true }
      );
      return result;
    },
  });
};

interface RawExamQuestion {
  id: string;
  examId: string;
  order: number;
  text: string;
  type?: QuestionType | null;
  options?: string | null;
  idealAnswer: string | null;
}

export const fetchExamQuestions = async (examId: string): Promise<Question[]> => {
  const { data } = await axios.get<RawExamQuestion[]>(
    `${process.env.NEXT_PUBLIC_API_URL}/exam/${examId}/questions`,
    { withCredentials: true }
  );

  return data.map((q) => ({
    id: q.id,
    examId: q.examId,
    text: q.text,
    type: q.type ?? undefined,
    options: q.options ? JSON.parse(q.options) : undefined,
    order: q.order,
    idealAnswer: q.idealAnswer,
  }));
};

export const useUserExams = (documentId?: string) => {
  return useQuery({
    queryKey: ['exams', documentId],
    queryFn: async () => {
      const url = documentId
        ? `${process.env.NEXT_PUBLIC_API_URL}/exam?documentId=${documentId}`
        : `${process.env.NEXT_PUBLIC_API_URL}/exam`;
      const { data } = await axios.get<Exam[]>(url, { withCredentials: true });
      return data;
    },
  });
};
