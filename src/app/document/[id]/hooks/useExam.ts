import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";

export interface Exam {
  id: string;
  documentId: string;
  pages: number[];
  mode: string;
  score: number | null;
  totalQuestions: number;
  title: string;
  difficulty: string;
  createdAt: string;
}

export interface Question {
  id: string;
  examId?: string;
  text: string;
  type?: string;
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
    mutationFn: async (data: { content: string; pages: number[]; difficulty: string }) => {
      const { data: result } = await axios.post<{ questions: { text: string; idealAnswer: string }[] }>(
        '/api/exam',
        { action: 'generate_questions', data },
      );
      return result.questions;
    },
  });
};

export const useEvaluateAnswer = () => {
  return useMutation({
    mutationFn: async (data: { userAnswer: string; idealAnswer: string; question: string }) => {
      const { data: result } = await axios.post<{ score: number; feedback: string }>(
        '/api/exam',
        { action: 'evaluate_answer', data },
      );
      return result;
    },
  });
};
