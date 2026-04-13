import React from "react";
import { Check, Sparkles, Info } from "lucide-react";
import { Answer, Question, QuestionType, QUESTION_TYPES } from "@/app/document/[id]/components/exam/hooks/useExam";
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
      return currentQuestion.idealAnswer === 'true' ? 'Verdadero' : 'Falso';
    }
    return currentQuestion.idealAnswer;
  })();

  return (
    <div className="mt-6 space-y-3 animate-in fade-in slide-in-from-bottom-3 duration-500">
      {/* Feedback principal */}
      <div className={cn(
        "relative px-4 py-3.5 rounded-xl border overflow-hidden",
        isCorrect
          ? "border-emerald-500/20 bg-emerald-50/40 dark:bg-emerald-950/20"
          : "border-amber-500/20 bg-amber-50/40 dark:bg-amber-950/20"
      )}>
        {/* Acento lateral */}
        <div className={cn(
          "absolute top-0 left-0 w-0.5 h-full rounded-l-xl",
          isCorrect ? "bg-emerald-500" : "bg-amber-500"
        )} />

        <div className="flex items-start gap-3 pl-2">
          <div className={cn(
            "mt-0.5 shrink-0",
            isCorrect ? "text-emerald-600 dark:text-emerald-400" : "text-amber-600 dark:text-amber-400"
          )}>
            {isCorrect ? <Sparkles size={14} /> : <Info size={14} />}
          </div>
          <div className="flex-1 min-w-0">
            <p className={cn(
              "text-[11px] font-bold uppercase tracking-widest mb-1",
              isCorrect ? "text-emerald-600/70 dark:text-emerald-400/70" : "text-amber-600/70 dark:text-amber-400/70"
            )}>
              {isCorrect ? "Correcto" : "Incorrecto"}
            </p>
            <p className={cn(
              "text-sm leading-relaxed",
              isCorrect ? "text-emerald-800 dark:text-emerald-200" : "text-amber-800 dark:text-amber-200"
            )}>
              {currentAnswerData.feedback}
            </p>
          </div>
        </div>
      </div>

      {/* Respuesta correcta */}
      {!isCorrect && showCorrectAnswer && (
        <div className="px-4 py-3 rounded-xl border border-primary/15 bg-primary/[0.03] flex items-center gap-3">
          <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
            <Check size={12} />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/50 mb-0.5">Respuesta correcta</p>
            <p className="text-sm font-medium text-foreground truncate">{correctAnswerLabel}</p>
          </div>
        </div>
      )}
    </div>
  );
};
