import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

interface QuestionNavigatorProps {
  total: number;
  currentIndex: number;
  isAnswered: (index: number) => boolean;
  onSelect: (index: number) => void;
}

// Numbered jump list of a simulation: answered questions read as filled in, the current one in ink.
export const QuestionNavigator: React.FC<QuestionNavigatorProps> = ({ total, currentIndex, isAnswered, onSelect }) => {
  const t = useTranslations("exam.simulation");

  return (
    <nav aria-label={t("navigator")} className="mx-auto w-full max-w-2xl px-4 pt-6">
      <ol className="flex flex-wrap gap-1.5">
        {Array.from({ length: total }, (_, index) => {
          const answered = isAnswered(index);
          const current = index === currentIndex;
          return (
            <li key={index}>
              <button
                onClick={() => onSelect(index)}
                aria-current={current ? "step" : undefined}
                aria-label={t(answered ? "questionAnswered" : "questionPending", { number: index + 1 })}
                className={cn(
                  "press-feedback flex h-8 w-8 items-center justify-center rounded-lg font-mono text-xs font-semibold tabular-nums transition-colors duration-150",
                  answered ? "bg-secondary text-foreground" : "border border-dashed border-border text-muted-foreground",
                  current ? "ring-2 ring-primary" : "hover:bg-accent hover:text-foreground"
                )}
              >
                {index + 1}
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
};
