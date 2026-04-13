import React from "react";
import { ArrowRight, CornerDownLeft, Loader2, CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ExamFooterProps {
  hasAnswered: boolean;
  isCorrect: boolean;
  isLastQuestion: boolean;
  isSubmitting: boolean;
  currentAnswer: string;
  onNext: () => void;
  onFinish: () => void;
}

export const ExamFooter: React.FC<ExamFooterProps> = ({
  hasAnswered,
  isCorrect,
  isLastQuestion,
  isSubmitting,
  currentAnswer,
  onNext,
  onFinish,
}) => {
  const isDisabled = (!currentAnswer.trim() && !hasAnswered) || isSubmitting;

  return (
    <footer className="fixed bottom-0 left-0 right-0 px-4 py-4 bg-gradient-to-t from-background via-background/95 to-transparent pointer-events-none">
      <div className="max-w-2xl gap-3 mx-auto flex items-center justify-between pointer-events-auto">
        {/* Hint de teclado */}
        <div className="hidden md:flex items-center gap-1.5 text-[0.8rem] font-medium uppercase tracking-widest text-muted-foreground/30">
          <kbd className="px-1 py-0.5 rounded border border-border/50 bg-muted/20 font-sans text-[9px]">Enter</kbd>
          <span>para continuar</span>
        </div>

        {/* Indicador de resultado (cuando ya respondió) */}
        {hasAnswered && (
          <div className={cn(
            "flex items-center gap-1.5 text-[0.8rem] font-medium animate-in fade-in duration-300",
            isCorrect ? "text-emerald-600 dark:text-emerald-400" : "text-amber-600 dark:text-amber-400"
          )}>
            {isCorrect
              ? <CheckCircle2 size={13} />
              : <XCircle size={13} />
            }
            <span>{isCorrect ? "Correcto" : "Incorrecto"}</span>
          </div>
        )}

        <Button
          size="sm"
          className={cn(
            "h-10 px-12 text-xs font-semibold cursor-pointer rounded-md text-foreground transition-all duration-300 shadow-md group ml-auto",
            hasAnswered
              ? isCorrect
                ? "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/10"
                : "bg-amber-600 hover:bg-amber-700  shadow-amber-500/10"
              : "bg-primary hover:bg-primary/80 shadow-primary/20"
          )}
          disabled={isDisabled}
          onClick={hasAnswered ? (isLastQuestion ? onFinish : onNext) : onNext}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="animate-spin mr-1.5" size={13} />
              <span>Procesando...</span>
            </>
          ) : hasAnswered ? (
            <>
              <span>{isLastQuestion ? "Ver resultados" : "Siguiente"}</span>
            </>
          ) : (
            <>
              <span>Evaluar</span>
            </>
          )}
        </Button>
      </div>
    </footer>
  );
};
