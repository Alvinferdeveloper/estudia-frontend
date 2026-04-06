"use client";

import { useExamSession } from "@/app/document/[id]/components/exam/hooks/useExamSession";
import { EXAM_PHASES } from "@/app/document/[id]/components/exam/hooks/useExam";
import { ExamModeButton } from "@/app/document/[id]/components/exam/ExamModeButton";
import { ExamSetupDialog } from "@/app/document/[id]/components/exam/ExamSetupDialog";
import { ExamUI } from "@/app/document/[id]/components/exam/ExamUI";
import { ExamResultsScreen } from "@/app/document/[id]/components/exam/ExamResultsScreen";
import { DocumentFile } from "@/app/document/[id]/page";

interface ExamModeProps {
  document: DocumentFile;
  numPages: number;
  examMode: boolean;
  selectedPages: number[];
  pdfDoc?: any;
  onEnableExamMode: () => void;
  onDisableExamMode: () => void;
}

export const ExamMode: React.FC<ExamModeProps> = ({
  document,
  numPages,
  examMode,
  selectedPages,
  pdfDoc,
  onEnableExamMode,
  onDisableExamMode,
}) => {
  const {
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
    isSubmitting
  } = useExamSession({
    documentName: document.fileName,
    documentId: document.id,
    selectedPages,
    pdfDoc,
    onDisableExamMode,
  });

  const renderContent = () => {
    switch (examPhase) {
      case EXAM_PHASES.SETUP:
        return (
          <ExamSetupDialog
            selectedPages={selectedPages}
            onStartExam={handleStartExam}
            onCancel={disableExamMode}
          />
        );

      case EXAM_PHASES.GENERATING:
        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-background">
            <div className="text-center space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
              <p>Generating questions with AI...</p>
            </div>
          </div>
        );

      case EXAM_PHASES.EXAM:
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
            isSubmitting={isSubmitting}
            onFinish={handleFinish}
            currentQuestionType={questionType}
          />
        );

      case EXAM_PHASES.RESULTS:
        const totalScore = answers.reduce((sum, a) => sum + (a.score || 0), 0);
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

  return (
    <>
      <ExamModeButton
        onClick={onEnableExamMode}
        isActive={examMode || examPhase !== EXAM_PHASES.INACTIVE}
      />
      {examMode && selectedPages.length > 0 && examPhase === EXAM_PHASES.INACTIVE && (
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
