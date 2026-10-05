import React from "react";
import { Check, Info } from "lucide-react";
import { Answer, Question, QuestionType, QUESTION_TYPES } from "@/app/[locale]/document/[id]/components/exam/hooks/useExam";
import { cn } from "@/lib/utils";

interface AnswerFeedbackProps {
  currentAnswerData: Answer;
  currentQuestion: Question;
  currentQuestionType: QuestionType;
  isCorrect: boolean;
}

export const AnswerFeedback: React.FC<AnswerFeedbackProps> = ({
  currentAnswerData,
  currentQuestion,
  currentQuestionType,
  isCorrect,
}) => {
  const showCorrectAnswer = (
    [QUESTION_TYPES.MULTIPLE_CHOICE, QUESTION_TYPES.TRUE_FALSE, QUESTION_TYPES.FILL_BLANK] as QuestionType[]
  ).includes(currentQuestionType);

  const correctAnswerLabel = (() => {
    if (currentQuestionType === QUESTION_TYPES.MULTIPLE_CHOICE && currentQuestion.options && currentQuestion.idealAnswer) {
      return currentQuestion.options[currentQuestion.idealAnswer.charCodeAt(0) - 65];
    }
    if (currentQuestionType === QUESTION_TYPES.TRUE_FALSE) {
      const isTrue = ['true', 'verdadero', 'v', '1'].includes(String(currentQuestion.idealAnswer).toLowerCase().trim());
      return isTrue ? 'Verdadero' : 'Falso';
    }
    return currentQuestion.idealAnswer;
  })();

  return (
    <div
      className={cn(
        "mt-6 overflow-hidden rounded-xl border animate-in fade-in slide-in-from-bottom-1 duration-300",
        isCorrect
          ? "border-emerald-500/20 bg-emerald-50/40 dark:bg-emerald-950/20"
          : "border-amber-500/20 bg-amber-50/40 dark:bg-amber-950/20"
      )}
    >
      <div className="flex items-start gap-3 px-4 py-3.5">
        <div
          className={cn(
            "flex h-6 w-6 shrink-0 items-center justify-center rounded-full animate-in zoom-in-50 duration-300",
            isCorrect
              ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
              : "bg-amber-500/15 text-amber-600 dark:text-amber-400"
          )}
        >
          {isCorrect ? <Check size={12} strokeWidth={3} /> : <Info size={12} />}
        </div>
        <div className="min-w-0 flex-1">
          <p
            className={cn(
              "mb-1 text-[11px] font-bold uppercase tracking-widest",
              isCorrect ? "text-emerald-600/70 dark:text-emerald-400/70" : "text-amber-600/70 dark:text-amber-400/70"
            )}
          >
            {isCorrect ? "Correcto" : "Incorrecto"}
          </p>
          <p
            className={cn(
              "text-sm leading-relaxed",
              isCorrect ? "text-emerald-800 dark:text-emerald-200" : "text-amber-800 dark:text-amber-200"
            )}
          >
            {currentAnswerData.feedback}
          </p>
        </div>
      </div>

      {/* Respuesta correcta */}
      {!isCorrect && showCorrectAnswer && (
        <div
          className={cn(
            "flex items-center gap-3 border-t px-4 py-3",
            "border-amber-500/15 bg-background/40"
          )}
        >
          <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Check size={12} />
          </div>
          <div className="min-w-0">
            <p className="mb-0.5 text-[10px] font-black uppercase tracking-[0.2em] text-primary/50">Respuesta correcta</p>
            <p className="truncate text-sm font-medium text-foreground">{correctAnswerLabel}</p>
          </div>
        </div>
      )}
    </div>
  );
};
