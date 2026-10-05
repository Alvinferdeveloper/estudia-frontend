"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ClipboardList, MousePointerClick } from "lucide-react";
import { cn } from "@/lib/utils";
import { useExamSession } from "@/app/[locale]/document/[id]/components/exam/hooks/useExamSession";
import { EXAM_PHASES, useUserExams } from "@/app/[locale]/document/[id]/components/exam/hooks/useExam";
import { ExamModeButton } from "@/app/[locale]/document/[id]/components/exam/ExamModeButton";
import { ExamSetupDialog } from "@/app/[locale]/document/[id]/components/exam/ExamSetupDialog";
import { ExamUI } from "@/app/[locale]/document/[id]/components/exam/ExamUI";
import { ExamResultsScreen } from "@/app/[locale]/document/[id]/components/exam/ExamResultsScreen";
import { SavedExamsDialog } from "@/app/[locale]/document/[id]/components/exam/SavedExamsDialog";
import { DocumentFile } from "@/app/[locale]/document/[id]/page";

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
  const [showSavedExams, setShowSavedExams] = useState(false);
  const { data: userExams } = useUserExams(document.id);

  const {
    examPhase,
    questions,
    answers,
    currentIndex,
    currentAnswer,
    questionType,
    examMeta,
    setCurrentAnswer,
    handleStartExam,
    handleSubmitAnswer,
    handleNextQuestion,
    handleFinish,
    handleRetry,
    handleContinueFromSelection,
    handleLoadExam,
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
            <div className="space-y-4 text-center">
              <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-primary/20 border-t-primary" />
              <p className="text-sm text-muted-foreground">Generating questions with AI...</p>
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

        const resultsExamMeta = examMeta ?? {
          id: 'local',
          documentId: document.id,
          pages: selectedPages,
          mode: 'custom' as const,
          totalQuestions: questions.length,
          title: `Exam - ${selectedPages.length} pages`,
          difficulty: 'medium',
          questionType,
          createdAt: new Date().toISOString(),
        };

        return (
          <ExamResultsScreen
            results={{
              exam: resultsExamMeta,
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

  const isSelectingPages = examMode && examPhase === EXAM_PHASES.INACTIVE;

  return (
    <>
      <div className="flex items-center gap-1">
        <ExamModeButton
          onClick={onEnableExamMode}
          isActive={examMode || examPhase !== EXAM_PHASES.INACTIVE}
        />
        <button
          onClick={() => setShowSavedExams(true)}
          title="My exams"
          className="press-feedback relative flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground transition-colors duration-150 hover:bg-accent hover:text-foreground"
        >
          <ClipboardList className="h-4 w-4" />
          {userExams && userExams.length > 0 && (
            <span className="absolute -right-0.5 -top-0.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-primary text-[9px] font-semibold text-primary-foreground">
              {userExams.length > 9 ? "9+" : userExams.length}
            </span>
          )}
        </button>
      </div>

      {isSelectingPages && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 380, damping: 40 }}
          className="fixed bottom-6 left-1/2 z-[500] -translate-x-1/2"
        >
          <div
            className={cn(
              "flex items-center gap-4 rounded-full border border-border/60 bg-card/95 py-2.5 shadow-lg shadow-black/10 backdrop-blur-md transition-[padding] duration-150",
              selectedPages.length > 0 ? "pl-4 pr-2.5" : "px-4"
            )}
          >
            {selectedPages.length > 0 ? (
              <span className="text-sm font-medium tabular-nums">
                {selectedPages.length} page{selectedPages.length !== 1 ? 's' : ''} selected
              </span>
            ) : (
              <span className="flex items-center gap-2 text-sm text-muted-foreground">
                <MousePointerClick className="h-4 w-4 animate-pulse text-primary" />
                Click on the pages you want to include in your exam
              </span>
            )}
            {selectedPages.length > 0 && (
              <button
                onClick={handleContinueFromSelection}
                className="press-feedback rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors duration-150 hover:bg-primary/90"
              >
                Start Exam
              </button>
            )}
            <button
              onClick={disableExamMode}
              className="press-feedback px-2 py-2 text-sm text-muted-foreground transition-colors duration-150 hover:text-foreground"
            >
              Cancel
            </button>
          </div>
        </motion.div>
      )}
      {showSavedExams && (
        <SavedExamsDialog
          documentId={document.id}
          onSelect={(examId) => {
            const exam = userExams?.find((e) => e.id === examId);
            if (exam) {
              handleLoadExam(exam);
              setShowSavedExams(false);
            }
          }}
          onClose={() => setShowSavedExams(false)}
        />
      )}
      <AnimatePresence mode="wait">
        <motion.div
          key={examPhase}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
        >
          {renderContent()}
        </motion.div>
      </AnimatePresence>
    </>
  );
};
