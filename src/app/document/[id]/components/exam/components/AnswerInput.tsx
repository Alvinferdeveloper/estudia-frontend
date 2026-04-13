import React from "react";
import { Check, X } from "lucide-react";
import { Question, Answer, QuestionType, QUESTION_TYPES } from "@/app/document/[id]/components/exam/hooks/useExam";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

interface AnswerInputProps {
  currentQuestion: Question;
  currentAnswer: string;
  currentQuestionType: QuestionType;
  isSubmitting: boolean;
  onAnswerChange: (answer: string) => void;
}

const MultipleChoiceInput: React.FC<{
  options: string[];
  currentAnswer: string;
  isSubmitting: boolean;
  onAnswerChange: (answer: string) => void;
}> = ({ options, currentAnswer, isSubmitting, onAnswerChange }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-5">
    {options.map((option, idx) => {
      const optionLetter = String.fromCharCode(65 + idx);
      const isSelected = currentAnswer === optionLetter;
      return (
        <button
          key={idx}
          onClick={() => onAnswerChange(optionLetter)}
          disabled={isSubmitting}
          className={cn(
            "group relative w-full px-3 py-5 rounded-lg border text-left transition-all duration-200 text-sm flex items-center gap-2.5",
            isSelected
              ? "border-primary/60 bg-primary/[0.04] ring-1 ring-primary/20"
              : "border-border bg-transparent hover:border-primary/30 hover:bg-muted/20"
          )}
        >
          <span className={cn(
            "flex items-center justify-center w-5 h-5 rounded border text-[10px] font-bold transition-colors shrink-0",
            isSelected
              ? "bg-primary border-primary text-primary-foreground"
              : "border-muted-foreground/30 text-muted-foreground/60 group-hover:border-primary/30"
          )}>
            {optionLetter}
          </span>
          <span className={cn(
            "flex-1 leading-snug text-sm",
            isSelected ? "text-foreground font-medium" : "text-muted-foreground group-hover:text-foreground/80"
          )}>
            {option}
          </span>
        </button>
      );
    })}
  </div>
);

const TrueFalseInput: React.FC<{
  currentAnswer: string;
  isSubmitting: boolean;
  onAnswerChange: (answer: string) => void;
}> = ({ currentAnswer, isSubmitting, onAnswerChange }) => (
  <div className="flex gap-3 mt-5">
    {(['true', 'false'] as const).map((val) => (
      <button
        key={val}
        onClick={() => onAnswerChange(val)}
        disabled={isSubmitting}
        className={cn(
          "flex-1 h-16 flex flex-col items-center justify-center gap-1.5 rounded-xl border transition-all duration-200",
          currentAnswer === val
            ? "border-primary/60 bg-primary/[0.04] ring-1 ring-primary/20"
            : "border-border bg-transparent hover:border-primary/30 hover:bg-muted/20"
        )}
      >
        {val === 'true'
          ? <Check className={cn("h-4 w-4", currentAnswer === 'true' ? "text-primary" : "text-muted-foreground/50")} />
          : <X className={cn("h-4 w-4", currentAnswer === 'false' ? "text-primary" : "text-muted-foreground/50")} />
        }
        <span className={cn(
          "text-xs font-semibold uppercase tracking-widest",
          currentAnswer === val ? "text-primary" : "text-muted-foreground/60"
        )}>
          {val === 'true' ? 'Verdadero' : 'Falso'}
        </span>
      </button>
    ))}
  </div>
);

const FillBlankInput: React.FC<{
  currentAnswer: string;
  isSubmitting: boolean;
  onAnswerChange: (answer: string) => void;
}> = ({ currentAnswer, isSubmitting, onAnswerChange }) => (
  <div className="mt-5">
    <input
      type="text"
      value={currentAnswer}
      onChange={(e) => onAnswerChange(e.target.value)}
      placeholder="Escribe tu respuesta..."
      className="w-full px-4 py-3 text-sm rounded-xl border border-border bg-transparent focus:border-primary/60 focus:ring-2 focus:ring-primary/10 transition-all outline-none placeholder:text-muted-foreground/40"
      disabled={isSubmitting}
      autoFocus
    />
  </div>
);

const OpenAnswerInput: React.FC<{
  currentAnswer: string;
  isSubmitting: boolean;
  onAnswerChange: (answer: string) => void;
}> = ({ currentAnswer, isSubmitting, onAnswerChange }) => (
  <div className="mt-5">
    <Textarea
      placeholder="Desarrolla tu respuesta..."
      value={currentAnswer}
      onChange={(e) => onAnswerChange(e.target.value)}
      className="min-h-[140px] px-4 py-3 text-sm leading-relaxed rounded-xl border border-border bg-transparent focus:border-primary/60 focus:ring-2 focus:ring-primary/10 transition-all resize-none placeholder:text-muted-foreground/40"
      disabled={isSubmitting}
    />
  </div>
);

export const AnswerInput: React.FC<AnswerInputProps> = ({
  currentQuestion,
  currentAnswer,
  currentQuestionType,
  isSubmitting,
  onAnswerChange,
}) => {
  switch (currentQuestionType) {
    case QUESTION_TYPES.MULTIPLE_CHOICE:
      return (
        <MultipleChoiceInput
          options={currentQuestion.options ?? []}
          currentAnswer={currentAnswer}
          isSubmitting={isSubmitting}
          onAnswerChange={onAnswerChange}
        />
      );
    case QUESTION_TYPES.TRUE_FALSE:
      return (
        <TrueFalseInput
          currentAnswer={currentAnswer}
          isSubmitting={isSubmitting}
          onAnswerChange={onAnswerChange}
        />
      );
    case QUESTION_TYPES.FILL_BLANK:
      return (
        <FillBlankInput
          currentAnswer={currentAnswer}
          isSubmitting={isSubmitting}
          onAnswerChange={onAnswerChange}
        />
      );
    default:
      return (
        <OpenAnswerInput
          currentAnswer={currentAnswer}
          isSubmitting={isSubmitting}
          onAnswerChange={onAnswerChange}
        />
      );
  }
};
