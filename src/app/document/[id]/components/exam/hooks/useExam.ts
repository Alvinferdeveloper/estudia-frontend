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
  score: number | null;
  totalQuestions: number;
  title: string;
  difficulty: string;
  questionType?: QuestionType;
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
        '/api/exam',
        { action: 'generate_questions', data },
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
        '/api/exam',
        { action: 'evaluate_answer', data },
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
      const { data: result } = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/exam/result`,
        data,
        { withCredentials: true }
      );
      return result;
    },
  });
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
