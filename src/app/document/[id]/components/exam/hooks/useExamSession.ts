import { useState, useCallback } from "react";
import {
  useGenerateQuestions,
  useEvaluateAnswer,
  useCreateExam,
  useSaveExamResult,
  QuestionType,
  ExamPhase,
  EXAM_PHASES,
  QUESTION_TYPES,
  Question,
  Answer
} from "@/app/document/[id]/components/exam/hooks/useExam";

interface UseExamSessionProps {
  documentName: string;
  documentId: string;
  selectedPages: number[];
  pdfDoc?: any;
  onDisableExamMode: () => void;
}

export const useExamSession = ({ documentName, documentId, selectedPages, pdfDoc, onDisableExamMode }: UseExamSessionProps) => {
  const [examPhase, setExamPhase] = useState<ExamPhase>(EXAM_PHASES.INACTIVE);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [questionType, setQuestionType] = useState<QuestionType>(QUESTION_TYPES.OPEN);
  const [examId, setExamId] = useState<string | null>(null);

  const generateQuestionsMutation = useGenerateQuestions();
  const evaluateAnswerMutation = useEvaluateAnswer();
  const createExamMutation = useCreateExam();
  const saveResultMutation = useSaveExamResult();

  const disableExamMode = useCallback(() => {
    setExamPhase(EXAM_PHASES.INACTIVE);
    setQuestions([]);
    setAnswers([]);
    setCurrentIndex(0);
    setCurrentAnswer('');
    setExamId(null);
    onDisableExamMode();
  }, [onDisableExamMode]);

  const handleStartExam = useCallback(async (config: { mode: string; difficulty: string; questionType: QuestionType; title: string }) => {
    try {
      setExamPhase(EXAM_PHASES.GENERATING);
      setQuestionType(config.questionType);

      let content = `Content from pages ${selectedPages.join(', ')} of ${documentName}`;

      if (pdfDoc) {
        let extracted = '';
        for (const pageNum of selectedPages) {
          try {
            const page = await pdfDoc.getPage(pageNum);
            const textContent = await page.getTextContent();
            const text = textContent.items.map((item: any) => item.str).join(' ');
            extracted += `\n--- Page ${pageNum} ---\n${text}\n`;
          } catch (e) {
            console.error(`Failed to extract text from page ${pageNum}`, e);
          }
        }
        content = extracted || content;
      }

      const generatedQuestions = await generateQuestionsMutation.mutateAsync({
        content,
        pages: selectedPages,
        difficulty: config.difficulty,
        questionType: config.questionType,
      });

      const questionsWithOrder = generatedQuestions.map((q: any, i: number) => ({ 
        ...q, 
        id: i.toString(),
        order: i + 1,
      }));
      setQuestions(questionsWithOrder);

      const exam = await createExamMutation.mutateAsync({
        documentId,
        pages: selectedPages,
        mode: config.mode,
        difficulty: config.difficulty,
        title: config.title,
        questionType: config.questionType,
        totalQuestions: generatedQuestions.length,
      });

      setExamId(exam.id);
      setExamPhase(EXAM_PHASES.EXAM);
    } catch (error) {
      console.error('Failed to generate questions:', error);
      disableExamMode();
    }
  }, [selectedPages, documentName, documentId, pdfDoc, generateQuestionsMutation, createExamMutation, disableExamMode]);

  const handleSubmitAnswer = useCallback(async () => {
    const currentQuestion = questions[currentIndex];
    if (!currentQuestion) return;

    try {
      const evaluation = await evaluateAnswerMutation.mutateAsync({
        userAnswer: currentAnswer,
        idealAnswer: currentQuestion.idealAnswer || '',
        question: currentQuestion.text,
        questionType: currentQuestion.type || questionType,
      });

      setAnswers(prev => [...prev, {
        questionId: currentIndex.toString(),
        userAnswer: currentAnswer,
        score: evaluation.score,
        feedback: evaluation.feedback,
      }]);
      setCurrentAnswer('');
    } catch (error) {
      console.error('Failed to evaluate answer:', error);
    }
  }, [questions, currentIndex, currentAnswer, evaluateAnswerMutation, questionType]);

  const handleNextQuestion = useCallback(() => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
    }
  }, [currentIndex, questions.length]);

  const handleFinish = useCallback(async () => {
    const totalScore = answers.reduce((sum, a) => sum + (a.score || 0), 0);
    const averageScore = answers.length > 0 ? totalScore / answers.length : 0;
    const correctAnswers = answers.filter(a => (a.score || 0) >= 5).length;

    if (examId) {
      try {
        await saveResultMutation.mutateAsync({
          examId,
          score: Math.round(averageScore * 10),
          correctAnswers,
          totalQuestions: answers.length,
        });
      } catch (error) {
        console.error('Failed to save exam result:', error);
      }
    }

    setExamPhase(EXAM_PHASES.RESULTS);
  }, [answers, examId, saveResultMutation]);

  const handleRetry = useCallback(() => {
    setCurrentIndex(0);
    setAnswers([]);
    setCurrentAnswer('');
    setExamPhase(EXAM_PHASES.EXAM);
  }, []);

  const handleContinueFromSelection = useCallback(() => {
    if (selectedPages.length > 0) {
      setExamPhase(EXAM_PHASES.SETUP);
    }
  }, [selectedPages]);

  return {
    examPhase,
    questions,
    answers,
    currentIndex,
    currentAnswer,
    questionType,
    setCurrentAnswer,
    handleStartExam,
    handleSubmitAnswer,
    handleNextQuestion,
    handleFinish,
    handleRetry,
    handleContinueFromSelection,
    disableExamMode,
    isSubmitting: evaluateAnswerMutation.isPending
  };
};
