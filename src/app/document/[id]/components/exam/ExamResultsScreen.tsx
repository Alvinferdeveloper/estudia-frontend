import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, RotateCcw, FileText } from "lucide-react";
import { ExamResults } from "@/app/document/[id]/components/exam/hooks/useExam";
import { cn } from "@/lib/utils";

interface ExamResultsScreenProps {
  results: ExamResults;
  onRetry: () => void;
  onClose: () => void;
}

export const ExamResultsScreen: React.FC<ExamResultsScreenProps> = ({
  results,
  onRetry,
  onClose,
}) => {
  const { exam, questions, answers, averageScore } = results;

  const getScoreColor = (score: number | null) => {
    if (score === null) return 'text-muted-foreground';
    if (score >= 7) return 'text-emerald-600 dark:text-emerald-400';
    if (score >= 5) return 'text-amber-600 dark:text-amber-400';
    return 'text-rose-600 dark:text-rose-400';
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-background">
      <div className="mx-auto w-full max-w-xl px-6 py-16">
        {/* Encabezado editorial: título + score en la misma línea */}
        <div className="flex animate-in fade-in slide-in-from-bottom-2 items-end justify-between gap-6 border-b border-border pb-6 duration-500">
          <div className="min-w-0">
            <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
              Examen finalizado
            </p>
            <h1 className="mt-1 truncate text-2xl font-bold tracking-tight text-foreground">
              {exam.title}
            </h1>
          </div>
          <p
            className={cn(
              "shrink-0 animate-in zoom-in-95 font-mono text-5xl font-bold tabular-nums duration-500",
              getScoreColor(averageScore)
            )}
          >
            {averageScore.toFixed(1)}
            <span className="text-xl text-muted-foreground">/10</span>
          </p>
        </div>

        {/* Stats en línea, sin cards repetidas */}
        <div
          className="mt-5 flex animate-in fade-in slide-in-from-bottom-1 items-center gap-6 text-sm duration-500"
          style={{ animationDelay: "100ms" }}
        >
          <span className="text-foreground">
            <span className="font-mono font-semibold tabular-nums">{questions.length}</span>{" "}
            <span className="text-muted-foreground">preguntas</span>
          </span>
          <span className="h-3 w-px bg-border" />
          <span className="text-foreground">
            <span className="font-mono font-semibold tabular-nums">{exam.pages.length}</span>{" "}
            <span className="text-muted-foreground">páginas</span>
          </span>
          <span className="h-3 w-px bg-border" />
          <span className="text-foreground capitalize">{exam.difficulty}</span>
        </div>

        {/* Desglose por pregunta */}
        <div className="mt-10">
          <p className="mb-3 text-xs font-medium uppercase tracking-widest text-muted-foreground">
            Desglose
          </p>
          <div className="divide-y divide-border/60">
            {questions.map((question, index) => {
              const answer = answers.find(a => a.questionId === question.id);
              const score = answer?.score ?? null;
              const isGood = score !== null && score >= 5;

              return (
                <div
                  key={question.id}
                  style={{ animationDelay: `${150 + Math.min(index, 10) * 40}ms` }}
                  className="flex animate-in fade-in slide-in-from-bottom-1 items-center justify-between gap-4 py-3 duration-500"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    {isGood ? (
                      <CheckCircle className="h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
                    ) : (
                      <XCircle className="h-4 w-4 shrink-0 text-rose-600 dark:text-rose-400" />
                    )}
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-foreground">Pregunta {index + 1}</p>
                      <p className="truncate text-xs text-muted-foreground">
                        {question.text}
                      </p>
                    </div>
                  </div>
                  <span className={cn("shrink-0 font-mono text-sm font-semibold tabular-nums", getScoreColor(score))}>
                    {score !== null ? `${score}/10` : '—'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-10 flex justify-end gap-2">
          <Button variant="outline" className="press-feedback" onClick={onClose}>
            <FileText className="mr-2 h-4 w-4" />
            Cerrar
          </Button>
          <Button className="press-feedback" onClick={onRetry}>
            <RotateCcw className="mr-2 h-4 w-4" />
            Reintentar
          </Button>
        </div>
      </div>
    </div>
  );
};
