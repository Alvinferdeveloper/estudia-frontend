import { ArrowLeft, RotateCcw, ListX } from "lucide-react";
import { useFormatter, useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Exam,
  isDifficultyLevel,
  useExamResults,
  computeExamStats,
} from "@/app/[locale]/document/[id]/components/exam/hooks/useExam";

const difficultyStyles: Record<string, string> = {
  easy: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  medium: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  hard: "bg-rose-500/10 text-rose-600 dark:text-rose-400",
};

const getScoreColor = (score: number | null) => {
  if (score === null) return "text-muted-foreground";
  if (score >= 7) return "text-emerald-600 dark:text-emerald-400";
  if (score >= 5) return "text-amber-600 dark:text-amber-400";
  return "text-rose-600 dark:text-rose-400";
};

interface ExamHistoryPanelProps {
  exam: Exam;
  onBack: () => void;
  onRetake: () => void;
}

export const ExamHistoryPanel: React.FC<ExamHistoryPanelProps> = ({
  exam,
  onBack,
  onRetake,
}) => {
  const t = useTranslations("exam");
  const format = useFormatter();
  const { data: results, isLoading } = useExamResults(exam.id);
  const stats = computeExamStats(results ?? []);

  return (
    <div className="flex flex-col">
      <div className="flex items-center gap-2 p-4 pb-3">
        <button
          onClick={onBack}
          title={t("history.back")}
          className="press-feedback flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors duration-150 hover:bg-accent hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-foreground">{exam.title}</p>
          <div className="mt-0.5 flex items-center gap-2 text-xs text-muted-foreground">
            <span
              className={cn(
                "rounded-full px-1.5 py-0.5 font-medium",
                difficultyStyles[exam.difficulty] ?? "bg-secondary text-secondary-foreground"
              )}
            >
              {isDifficultyLevel(exam.difficulty) ? t(`difficulty.${exam.difficulty}`) : exam.difficulty}
            </span>
            <span>{t("questionCount", { count: exam.totalQuestions })}</span>
            <span>·</span>
            <span>
              {t("history.createdAt", {
                date: format.dateTime(new Date(exam.createdAt), { day: "numeric", month: "numeric", year: "numeric" }),
              })}
            </span>
          </div>
        </div>
      </div>

      <div className="max-h-[50vh] overflow-y-auto px-4 pb-4">
        {isLoading ? (
          <div className="flex items-center justify-center py-10">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary/20 border-t-primary" />
          </div>
        ) : stats.attemptCount === 0 ? (
          <div className="flex flex-col items-center gap-2 py-8 text-center">
            <ListX className="h-8 w-8 text-muted-foreground/40" />
            <p className="text-sm text-muted-foreground">{t("history.empty")}</p>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-4 rounded-lg bg-muted/40 px-4 py-3 text-sm animate-in fade-in duration-300">
              <div>
                <span className="font-mono font-semibold tabular-nums text-foreground">{stats.attemptCount}</span>{" "}
                <span className="text-muted-foreground">{t("history.attempts", { count: stats.attemptCount })}</span>
              </div>
              <span className="h-3 w-px bg-border" />
              <div>
                <span className={cn("font-mono font-semibold tabular-nums", getScoreColor(stats.highestScore))}>
                  {stats.highestScore !== null ? `${stats.highestScore}/10` : "—"}
                </span>{" "}
                <span className="text-muted-foreground">{t("history.best")}</span>
              </div>
              <span className="h-3 w-px bg-border" />
              <div>
                <span className={cn("font-mono font-semibold tabular-nums", getScoreColor(stats.lowestScore))}>
                  {stats.lowestScore !== null ? `${stats.lowestScore}/10` : "—"}
                </span>{" "}
                <span className="text-muted-foreground">{t("history.lowest")}</span>
              </div>
              <span className="h-3 w-px bg-border" />
              <div>
                <span className={cn("font-mono font-semibold tabular-nums", getScoreColor(stats.lastScore))}>
                  {stats.lastScore !== null ? `${stats.lastScore}/10` : "—"}
                </span>{" "}
                <span className="text-muted-foreground">{t("history.last")}</span>
              </div>
            </div>

            <p className="mb-2 mt-5 text-xs font-medium uppercase tracking-widest text-muted-foreground">
              {t("history.title")}
            </p>
            <div className="divide-y divide-border/60">
              {results?.map((result, index) => (
                <div
                  key={result.id}
                  style={{ animationDelay: `${Math.min(index, 10) * 30}ms` }}
                  className="flex animate-in fade-in slide-in-from-bottom-1 items-center justify-between py-2.5 text-sm duration-300"
                >
                  <span className="text-muted-foreground">
                    {format.dateTime(new Date(result.createdAt), {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                  <span className={cn("font-mono font-semibold tabular-nums", getScoreColor(result.score))}>
                    {result.score !== null ? `${result.score}/10` : "—"}
                  </span>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      <div className="flex justify-end gap-2 border-t border-border p-4">
        <Button variant="outline" className="press-feedback" onClick={onBack}>
          {t("history.back")}
        </Button>
        <Button className="press-feedback gap-2" onClick={onRetake}>
          <RotateCcw className="h-4 w-4" />
          {t("history.retake")}
        </Button>
      </div>
    </div>
  );
};
