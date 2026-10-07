import React from "react";
import { Check, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { type Question, QUESTION_TYPES } from "@/app/[locale]/document/[id]/components/exam/hooks/useExam";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

interface AnswerInputProps {
  question: Question;
  value: string;
  isSubmitting: boolean;
  onChange: (answer: string) => void;
}

const MultipleChoiceInput: React.FC<{
  options: string[];
  currentAnswer: string;
  isSubmitting: boolean;
  onAnswerChange: (answer: string) => void;
}> = ({ options, currentAnswer, isSubmitting, onAnswerChange }) => (
  <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
    {options.map((option, idx) => {
      const optionLetter = String.fromCharCode(65 + idx);
      const isSelected = currentAnswer === optionLetter;
      return (
        <button
          key={idx}
          style={{ animationDelay: `${idx * 40}ms` }}
          onClick={() => onAnswerChange(optionLetter)}
          disabled={isSubmitting}
          className={cn(
            "press-feedback group relative flex w-full items-center gap-3 rounded-xl border p-4 text-left text-sm transition-all duration-200 ease-[var(--ease-out)] animate-in fade-in slide-in-from-bottom-1",
            isSelected
              ? "border-primary bg-primary/[0.08] ring-1 ring-primary/20"
              : "border-border bg-transparent hover:border-primary/30 hover:bg-muted/20"
          )}
        >
          <span
            className={cn(
              "flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-[11px] font-bold transition-all duration-200",
              isSelected
                ? "border-primary bg-primary text-primary-foreground"
                : "border-muted-foreground/30 text-muted-foreground/60 group-hover:border-primary/40"
            )}
          >
            {optionLetter}
          </span>
          <span
            className={cn(
              "flex-1 leading-snug",
              isSelected ? "font-medium text-foreground" : "text-muted-foreground group-hover:text-foreground/80"
            )}
          >
            {option}
          </span>
          {isSelected && (
            <Check className="h-4 w-4 shrink-0 text-primary animate-in zoom-in-50 duration-200" strokeWidth={3} />
          )}
        </button>
      );
    })}
  </div>
);

const TrueFalseInput: React.FC<{
  currentAnswer: string;
  isSubmitting: boolean;
  onAnswerChange: (answer: string) => void;
}> = ({ currentAnswer, isSubmitting, onAnswerChange }) => {
  const t = useTranslations("exam.session");
  return (
    <div className="grid grid-cols-2 gap-3">
      {(['true', 'false'] as const).map((val, idx) => {
        const isSelected = currentAnswer === val;
        return (
          <button
            key={val}
            style={{ animationDelay: `${idx * 40}ms` }}
            onClick={() => onAnswerChange(val)}
            disabled={isSubmitting}
            className={cn(
              "press-feedback group flex h-20 flex-col items-center justify-center gap-2 rounded-xl border transition-all duration-200 ease-[var(--ease-out)] animate-in fade-in slide-in-from-bottom-1",
              isSelected
                ? "border-primary bg-primary/[0.08] ring-1 ring-primary/20"
                : "border-border bg-transparent hover:border-primary/30 hover:bg-muted/20"
            )}
          >
            <div
              className={cn(
                "flex h-9 w-9 items-center justify-center rounded-full transition-all duration-200",
                isSelected ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground/50 group-hover:text-foreground/70"
              )}
            >
              {val === 'true' ? <Check className="h-4 w-4" strokeWidth={3} /> : <X className="h-4 w-4" strokeWidth={3} />}
            </div>
            <span
              className={cn(
                "text-xs font-semibold uppercase tracking-widest",
                isSelected ? "text-primary" : "text-muted-foreground/60"
              )}
            >
              {t(val)}
            </span>
          </button>
        );
      })}
    </div>
  );
};

const FillBlankInput: React.FC<{
  currentAnswer: string;
  isSubmitting: boolean;
  onAnswerChange: (answer: string) => void;
}> = ({ currentAnswer, isSubmitting, onAnswerChange }) => {
  const t = useTranslations("exam.session");
  return (
    <div className="pt-2 animate-in fade-in duration-200">
      <input
        type="text"
        value={currentAnswer}
        onChange={(e) => onAnswerChange(e.target.value)}
        placeholder={t("fillBlankPlaceholder")}
        className="w-full border-0 border-b-2 border-border bg-transparent px-1 pb-3 text-base text-foreground outline-none transition-colors duration-200 ease-[var(--ease-out)] placeholder:text-muted-foreground/40 focus:border-primary"
        disabled={isSubmitting}
        autoFocus
      />
    </div>
  );
};

const OpenAnswerInput: React.FC<{
  currentAnswer: string;
  isSubmitting: boolean;
  onAnswerChange: (answer: string) => void;
}> = ({ currentAnswer, isSubmitting, onAnswerChange }) => {
  const t = useTranslations("exam.session");
  return (
    <div className="animate-in fade-in duration-200">
      <Textarea
        placeholder={t("openPlaceholder")}
        value={currentAnswer}
        onChange={(e) => onAnswerChange(e.target.value)}
        className="min-h-[140px] resize-none rounded-xl border-border bg-transparent px-4 py-3 text-sm leading-relaxed transition-colors duration-200 ease-[var(--ease-out)] placeholder:text-muted-foreground/40 focus-visible:border-primary/60 focus-visible:ring-2 focus-visible:ring-primary/10"
        disabled={isSubmitting}
      />
      <div className="mt-1.5 flex justify-end">
        <span className="text-xs tabular-nums text-muted-foreground/50">
          {t("characterCount", { count: currentAnswer.length })}
        </span>
      </div>
    </div>
  );
};

export const AnswerInput: React.FC<AnswerInputProps> = ({ question, value, isSubmitting, onChange }) => {
  const props = { currentAnswer: value, isSubmitting, onAnswerChange: onChange };
  switch (question.type) {
    case QUESTION_TYPES.MULTIPLE_CHOICE:
      return <MultipleChoiceInput options={question.options ?? []} {...props} />;
    case QUESTION_TYPES.TRUE_FALSE:
      return <TrueFalseInput {...props} />;
    case QUESTION_TYPES.FILL_BLANK:
      return <FillBlankInput {...props} />;
    default:
      return <OpenAnswerInput {...props} />;
  }
};
