"use client";

import { useState, useCallback } from "react";
import { useGenerateQuestions, useEvaluateAnswer, QuestionType } from "../../hooks/useExam";
import { ExamModeButton } from "./ExamModeButton";
import { ExamSetupDialog } from "./ExamSetupDialog";
import { ExamUI } from "./ExamUI";
import { ExamResultsScreen } from "./ExamResultsScreen";
import { DocumentFile } from "../../page";

interface Question {
  id: string;
  text: string;
  idealAnswer: string;
  examId?: string;
  type?: QuestionType;
  options?: string[];
  order?: number;
}

interface Answer {
  questionId: string;
  userAnswer: string;
  score: number;
  feedback: string;
}

type ExamPhase = 'inactive' | 'setup' | 'generating' | 'exam' | 'results';

interface ExamModeProps {
  document: DocumentFile;
  numPages: number;
  examMode: boolean;
  selectedPages: number[];
  onEnableExamMode: () => void;
  onDisableExamMode: () => void;
}

export const ExamMode: React.FC<ExamModeProps> = ({ 
  document, 
  numPages,
  examMode,
  selectedPages,
  onEnableExamMode,
  onDisableExamMode,
}) => {
  const [examPhase, setExamPhase] = useState<ExamPhase>('inactive');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [questionType, setQuestionType] = useState<QuestionType>('open');

  const generateQuestionsMutation = useGenerateQuestions();
  const evaluateAnswerMutation = useEvaluateAnswer();

  const disableExamMode = useCallback(() => {
    setExamPhase('inactive');
    setQuestions([]);
    setAnswers([]);
    setCurrentIndex(0);
    setCurrentAnswer('');
    onDisableExamMode();
  }, [onDisableExamMode]);

  const handleStartExam = useCallback(async (config: { mode: string; difficulty: string; questionType: QuestionType; title: string }) => {
    try {
      setExamPhase('generating');
      setQuestionType(config.questionType);
      
      const content = `Content from pages ${selectedPages.join(', ')} of ${document.fileName}`;
      
      const generatedQuestions = await generateQuestionsMutation.mutateAsync({
        content,
        pages: selectedPages,
        difficulty: config.difficulty,
        questionType: config.questionType,
      });
      
      setQuestions(generatedQuestions.map((q, i) => ({ ...q, id: i.toString() })));
      setExamPhase('exam');
    } catch (error) {
      console.error('Failed to generate questions:', error);
      disableExamMode();
    }
  }, [selectedPages, document.fileName, generateQuestionsMutation, disableExamMode]);

  const handleSubmitAnswer = useCallback(async () => {
    const currentQuestion = questions[currentIndex];
    if (!currentQuestion) return;
    
    try {
      const evaluation = await evaluateAnswerMutation.mutateAsync({
        userAnswer: currentAnswer,
        idealAnswer: currentQuestion.idealAnswer,
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
    setExamPhase('results');
  }, []);

  const handleRetry = useCallback(() => {
    setCurrentIndex(0);
    setAnswers([]);
    setCurrentAnswer('');
    setExamPhase('exam');
  }, []);

  const renderContent = () => {
    switch (examPhase) {
      case 'setup':
        return (
          <ExamSetupDialog
            selectedPages={selectedPages}
            onStartExam={handleStartExam}
            onCancel={disableExamMode}
          />
        );

      case 'generating':
        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-background">
            <div className="text-center space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
              <p>Generating questions with AI...</p>
            </div>
          </div>
        );

      case 'exam':
        return (
          <ExamUI
            questions={questions.map((q, i) => ({ ...q, id: i.toString() }))}
            answers={answers}
            currentIndex={currentIndex}
            currentAnswer={currentAnswer}
            onAnswerChange={setCurrentAnswer}
            onNext={answers.find(a => a.questionId === currentIndex.toString())
              ? handleNextQuestion 
              : handleSubmitAnswer}
            isSubmitting={evaluateAnswerMutation.isPending}
            onFinish={handleFinish}
            currentQuestionType={questionType}
          />
        );

      case 'results':
        const totalScore = answers.reduce((sum, a) => sum + a.score, 0);
        const averageScore = answers.length > 0 ? totalScore / answers.length : 0;
        
        return (
          <ExamResultsScreen
            results={{
              exam: {
                id: 'local',
                documentId: document.id,
                pages: selectedPages,
                mode: 'custom',
                score: averageScore,
                totalQuestions: questions.length,
                title: `Exam - ${selectedPages.length} pages`,
                difficulty: 'medium',
                questionType,
                createdAt: new Date().toISOString(),
              },
              questions: questions.map((q, i) => ({
                id: i.toString(),
                examId: 'local',
                text: q.text,
                type: q.type || questionType,
                options: q.options,
                order: i + 1,
                idealAnswer: q.idealAnswer
              })),
              answers: answers.map((a, i) => ({
                id: i.toString(),
                questionId: i.toString(),
                userAnswer: a.userAnswer,
                score: a.score,
                feedback: a.feedback,
              })),
              averageScore,
            }}
            onRetry={handleRetry}
            onClose={disableExamMode}
          />
        );

      default:
        return null;
    }
  };

  const handleContinueFromSelection = useCallback(() => {
    if (selectedPages.length > 0) {
      setExamPhase('setup');
    }
  }, [selectedPages]);

  return (
    <>
      <ExamModeButton
        onClick={onEnableExamMode}
        isActive={examMode || examPhase !== 'inactive'}
      />
      {examMode && selectedPages.length > 0 && examPhase === 'inactive' && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[500]">
          <div className="bg-card border border-border rounded-lg shadow-lg px-4 py-3 flex items-center gap-4">
            <span className="text-sm font-medium">
              {selectedPages.length} page{selectedPages.length !== 1 ? 's' : ''} selected
            </span>
            <button
              onClick={handleContinueFromSelection}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90"
            >
              Continue
            </button>
            <button
              onClick={disableExamMode}
              className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground"
            >
              Clear
            </button>
          </div>
        </div>
      )}
      {renderContent()}
    </>
  );
};
