import React, { useEffect, useCallback } from "react";
import { Question, Answer, QuestionType, QUESTION_TYPES } from "@/app/document/[id]/components/exam/hooks/useExam";
import { ExamHeader } from "@/app/document/[id]/components/exam/components/ExamHeader";
import { AnswerInput } from "@/app/document/[id]/components/exam/components/AnswerInput";
import { AnswerFeedback } from "@/app/document/[id]/components/exam/components/AnswerFeedback";
import { ExamFooter } from "@/app/document/[id]/components/exam/components/ExamFooter";
import { MascotCompanion } from "@/app/document/[id]/components/exam/components/MascotCompanion";
import { cn } from "@/lib/utils";

interface ExamUIProps {
  questions: Question[];
  answers: Answer[];
  currentIndex: number;
  currentAnswer: string;
  onAnswerChange: (answer: string) => void;
  onNext: () => void;
  isSubmitting: boolean;
  onFinish: () => void;
  currentQuestionType: QuestionType;
}

// Badge del tipo de pregunta
const QuestionTypeBadge: React.FC<{ type: QuestionType }> = ({ type }) => {
  const labels: Record<QuestionType, string> = {
    [QUESTION_TYPES.MULTIPLE_CHOICE]: "Opción múltiple",
    [QUESTION_TYPES.TRUE_FALSE]: "Verdadero / Falso",
    [QUESTION_TYPES.FILL_BLANK]: "Completar espacio",
    [QUESTION_TYPES.OPEN]: "Respuesta abierta",
    [QUESTION_TYPES.MIXED]: "Mixto",
  };
  return (
    <span className="inline-flex items-center text-[10px] font-bold uppercase tracking-[0.2em] text-primary/60 bg-primary/[0.06] px-5 py-1 rounded-full border border-primary/10">
      {labels[type] ?? type}
    </span>
  );
};

// Mascota con frases motivacionales

export const ExamUI: React.FC<ExamUIProps> = ({
  questions,
  answers,
  currentIndex,
  currentAnswer,
  onAnswerChange,
  onNext,
  isSubmitting,
  onFinish,
  currentQuestionType: defaultQuestionType,
}) => {
  const currentQuestion = questions[currentIndex];
  const currentAnswerData = answers.find((a) => a.questionId === currentQuestion?.id);
  const isLastQuestion = currentIndex === questions.length - 1;
  const hasAnswered = !!currentAnswerData;
  const currentQuestionType = currentQuestion?.type || defaultQuestionType;
  const isCorrect = currentAnswerData?.score === 10;

  // Atajo de teclado: Enter para avanzar/enviar
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey) {
        const isTextArea =
          currentQuestionType === QUESTION_TYPES.OPEN ||
          currentQuestionType === QUESTION_TYPES.FILL_BLANK;

        // En textarea solo avanzar si ya respondió, o si no es textarea
        if (!isTextArea || hasAnswered) {
          if ((!currentAnswer.trim() && !hasAnswered) || isSubmitting) return;
          e.preventDefault();
          if (hasAnswered) {
            isLastQuestion ? onFinish() : onNext();
          } else {
            onNext();
          }
        }
      }
    },
    [currentAnswer, currentQuestionType, hasAnswered, isLastQuestion, isSubmitting, onFinish, onNext]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  if (!currentQuestion) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-background text-foreground overflow-hidden selection:bg-primary/15">
      <ExamHeader
        currentIndex={currentIndex}
        totalQuestions={questions.length}
        onFinish={onFinish}
      />

      <main className="flex-1 overflow-y-auto">
        <div className="max-w-2xl mx-auto px-6 py-8 pb-24">

          {/* Mascota */}
          <MascotCompanion
            state={isSubmitting ? 'submitting' : hasAnswered ? 'answered' : 'idle'}
            isCorrect={isCorrect}
          />

          {/* Número + tipo de pregunta */}
          <div className="flex items-center gap-3 mb-5 animate-in fade-in duration-500">
            <span className="text-md font-bold text-muted-foreground/50 tabular-nums">
              {String(currentIndex + 1).padStart(2, "0")}
            </span>
            <div className="h-1 flex-1 bg-border/30" />
            <QuestionTypeBadge type={currentQuestionType} />
          </div>

          {/* Pregunta */}
          <article
            key={currentIndex}
            className="animate-in fade-in slide-in-from-bottom-2 duration-500"
          >
            <h1 className={cn(
              "text-xl font-semibold leading-relaxed tracking-tight text-balance",
              hasAnswered ? "text-foreground/70" : "text-foreground"
            )}>
              {currentQuestion.text}
            </h1>

            {/* Input de respuesta o feedback */}
            <div className="transition-all duration-400">
              {hasAnswered ? (
                currentAnswerData && (
                  <AnswerFeedback
                    currentAnswerData={currentAnswerData}
                    currentQuestion={currentQuestion}
                    currentQuestionType={currentQuestionType}
                    isCorrect={isCorrect}
                  />
                )
              ) : (
                <AnswerInput
                  currentQuestion={currentQuestion}
                  currentAnswer={currentAnswer}
                  currentQuestionType={currentQuestionType}
                  isSubmitting={isSubmitting}
                  onAnswerChange={onAnswerChange}
                />
              )}
            </div>
          </article>
        </div>
      </main>

      <ExamFooter
        hasAnswered={hasAnswered}
        isCorrect={isCorrect}
        isLastQuestion={isLastQuestion}
        isSubmitting={isSubmitting}
        currentAnswer={currentAnswer}
        onNext={onNext}
        onFinish={onFinish}
      />
    </div>
  );
};