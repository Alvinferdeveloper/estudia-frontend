import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api-client";

export const QUESTION_TYPES = {
  OPEN: 'open',
  MULTIPLE_CHOICE: 'multiple_choice',
  TRUE_FALSE: 'true_false',
  FILL_BLANK: 'fill_blank',
  MIXED: 'mixed',
} as const;

export type QuestionType = typeof QUESTION_TYPES[keyof typeof QUESTION_TYPES];

export const DIFFICULTY_LEVELS = {
  EASY: 'easy',
  MEDIUM: 'medium',
  HARD: 'hard',
} as const;

export type DifficultyLevel = typeof DIFFICULTY_LEVELS[keyof typeof DIFFICULTY_LEVELS];

export const isDifficultyLevel = (value: string): value is DifficultyLevel =>
  (Object.values(DIFFICULTY_LEVELS) as string[]).includes(value);

export const ATTEMPT_MODES = {
  PRACTICE: 'practice',
  SIMULATION: 'simulation',
} as const;

export type AttemptMode = typeof ATTEMPT_MODES[keyof typeof ATTEMPT_MODES];

export const ATTEMPT_STATUS = {
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
} as const;

export type AttemptStatus = typeof ATTEMPT_STATUS[keyof typeof ATTEMPT_STATUS];

export const EXAM_SIZES = [5, 10, 15, 20] as const;

// Mirrors the API's exam views (estudia-api `exam-views.ts`).
export interface Exam {
  id: string;
  documentId: string;
  title: string;
  difficulty: string;
  questionType: QuestionType | null;
  pages: number[];
  totalQuestions: number;
  createdAt: string;
}

export interface AttemptSummary {
  id: string;
  mode: AttemptMode;
  status: AttemptStatus;
  startedAt: string;
  finishedAt: string | null;
  // 0-100, set once the attempt is finished.
  score: number | null;
  correctAnswers: number;
  totalQuestions: number;
  // Simulations only.
  timeLimitSeconds: number | null;
  deadline: string | null;
}

export interface ExamWithAttempts extends Exam {
  attempts: AttemptSummary[];
}

export interface Question {
  id: string;
  order: number;
  text: string;
  type: QuestionType | null;
  options: string[] | null;
}

export interface Answer {
  questionId: string;
  userAnswer: string;
  // 0-10; null while a simulation is in progress (grades come at the end).
  score: number | null;
  feedback: string | null;
  idealAnswer: string | null;
}

export type GradedAnswer = Answer & { score: number };

export const isGraded = (answer: Answer): answer is GradedAnswer => answer.score !== null;

export interface AttemptView {
  attempt: AttemptSummary;
  exam: Exam;
  questions: Question[];
  answers: Answer[];
  // The server's clock when the view was built, for the simulation countdown.
  serverNow: string;
}

export interface GenerateExamRequest {
  documentId: string;
  pages: number[];
  // Text of the selected pages, extracted from the PDF in the browser.
  content: string;
  mode: AttemptMode;
  difficulty: DifficultyLevel;
  questionType: QuestionType;
  questionCount: number;
  title: string;
}

// What the setup panel decides; the document, its pages and their text are added on generation.
export type ExamConfig = Omit<GenerateExamRequest, "documentId" | "pages" | "content">;

export interface AttemptRef {
  examId: string;
  attemptId: string;
}

export const examKeys = {
  all: ['exams'] as const,
  list: (documentId: string) => ['exams', 'list', documentId] as const,
  attempt: (attemptId: string) => ['exams', 'attempt', attemptId] as const,
};

export const useUserExams = (documentId: string) =>
  useQuery({
    queryKey: examKeys.list(documentId),
    queryFn: async () => {
      const { data } = await api.get<ExamWithAttempts[]>("/exam", { params: { documentId } });
      return data;
    },
  });

// Creates the exam and its first attempt in one step.
export const useGenerateExam = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (request: GenerateExamRequest) => {
      const { data } = await api.post<AttemptRef>("/exam/generate", request);
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: examKeys.all }),
    meta: { inlineError: true, refreshesUsage: true },
  });
};

export const useStartAttempt = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ examId, mode }: { examId: string; mode: AttemptMode }) => {
      const { data } = await api.post<{ attemptId: string }>(`/exam/${examId}/attempts`, { mode });
      return { examId, attemptId: data.attemptId };
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: examKeys.all }),
  });
};

export const useAttempt = ({ examId, attemptId }: AttemptRef) =>
  useQuery({
    queryKey: examKeys.attempt(attemptId),
    queryFn: async () => {
      const { data } = await api.get<AttemptView>(`/exam/${examId}/attempts/${attemptId}`);
      return data;
    },
  });

export const useAnswerQuestion = ({ examId, attemptId }: AttemptRef) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (body: { questionId: string; userAnswer: string }) => {
      const { data } = await api.post<Answer>(`/exam/${examId}/attempts/${attemptId}/answers`, body);
      return data;
    },
    onSuccess: (answer) =>
      queryClient.setQueryData<AttemptView>(examKeys.attempt(attemptId), (view) =>
        view && {
          ...view,
          answers: [...view.answers.filter((a) => a.questionId !== answer.questionId), answer],
        }
      ),
    meta: { inlineError: true },
  });
};

export const useFinishAttempt = ({ examId, attemptId }: AttemptRef) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const { data } = await api.post<AttemptView>(`/exam/${examId}/attempts/${attemptId}/finish`);
      return data;
    },
    onSuccess: (view) => {
      queryClient.setQueryData(examKeys.attempt(attemptId), view);
      queryClient.invalidateQueries({ queryKey: examKeys.list(view.exam.documentId) });
    },
  });
};
