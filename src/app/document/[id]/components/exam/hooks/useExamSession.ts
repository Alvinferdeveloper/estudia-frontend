import { useState, useCallback } from "react";
import {
  useGenerateQuestions,
  useEvaluateAnswer,
  QuestionType,
  ExamPhase,
  EXAM_PHASES,
  QUESTION_TYPES,
  Question,
  Answer
} from "@/app/document/[id]/components/exam/hooks/useExam";

interface UseExamSessionProps {
  documentName: string;
  selectedPages: number[];
  onDisableExamMode: () => void;
}

export const useExamSession = ({ documentName, selectedPages, onDisableExamMode }: UseExamSessionProps) => {
  const [examPhase, setExamPhase] = useState<ExamPhase>(EXAM_PHASES.INACTIVE);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [questionType, setQuestionType] = useState<QuestionType>(QUESTION_TYPES.OPEN);

  const generateQuestionsMutation = useGenerateQuestions();
  const evaluateAnswerMutation = useEvaluateAnswer();

  const disableExamMode = useCallback(() => {
    setExamPhase(EXAM_PHASES.INACTIVE);
    setQuestions([]);
    setAnswers([]);
    setCurrentIndex(0);
    setCurrentAnswer('');
    onDisableExamMode();
  }, [onDisableExamMode]);

  const handleStartExam = useCallback(async (config: { mode: string; difficulty: string; questionType: QuestionType; title: string }) => {
    try {
      setExamPhase(EXAM_PHASES.GENERATING);
      setQuestionType(config.questionType);

      const content = `Content from pages ${selectedPages.join(', ')} of ${documentName}`;

      const generatedQuestions = await generateQuestionsMutation.mutateAsync({
        content,
        pages: selectedPages,
        difficulty: config.difficulty,
        questionType: config.questionType,
      });

      setQuestions(generatedQuestions.map((q: any, i: number) => ({ ...q, id: i.toString() })));
      setExamPhase(EXAM_PHASES.EXAM);
    } catch (error) {
      console.error('Failed to generate questions:', error);
      disableExamMode();
    }
  }, [selectedPages, documentName, generateQuestionsMutation, disableExamMode]);

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

  const handleFinish = useCallback(() => {
    setExamPhase(EXAM_PHASES.RESULTS);
  }, []);

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
