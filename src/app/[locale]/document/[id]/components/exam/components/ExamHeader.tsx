import { X } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { ROUTES } from "@/config/routes";
import { Progress } from "@/components/ui/progress";

interface ExamHeaderProps {
  documentId: string;
  answeredCount: number;
  total: number;
  onFinish: () => void;
  isFinishing: boolean;
}

// Leaving keeps the attempt in progress: every answer is already saved.
export const ExamHeader: React.FC<ExamHeaderProps> = ({ documentId, answeredCount, total, onFinish, isFinishing }) => {
  const t = useTranslations("exam.session");

  return (
    <header className="sticky top-0 z-10 border-b border-border bg-background">
      <div className="mx-auto flex h-14 w-full max-w-2xl items-center gap-4 px-4">
        <Link
          href={ROUTES.document(documentId)}
          title={t("leave")}
          aria-label={t("leave")}
          className="press-feedback flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors duration-150 hover:bg-accent hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </Link>

        <Progress
          value={(answeredCount / total) * 100}
          aria-label={t("progress", { answered: answeredCount, total })}
          className="h-1.5 flex-1 rounded-full bg-secondary"
        />

        <span className="font-mono text-xs font-semibold tabular-nums text-muted-foreground">
          {answeredCount}/{total}
        </span>

        {answeredCount > 0 && answeredCount < total && (
          <button
            onClick={onFinish}
            disabled={isFinishing}
            className="press-feedback rounded-full px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors duration-150 hover:bg-accent hover:text-foreground disabled:opacity-50"
          >
            {t("finishNow")}
          </button>
        )}
      </div>
    </header>
  );
};
