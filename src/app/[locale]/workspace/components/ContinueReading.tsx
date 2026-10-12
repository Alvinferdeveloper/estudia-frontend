import { useTranslations } from "next-intl";
import { ArrowRight, BookOpen } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/config/routes";
import type { Document } from "@/app/types";
import { getReadingProgress } from "@/app/[locale]/workspace/lib/reading-progress";
import { ReadingProgressBar } from "@/app/[locale]/workspace/components/ReadingProgressBar";

// One click from the workspace back to the page the user was reading.
export const ContinueReading: React.FC<{ document: Document }> = ({ document }) => {
  const t = useTranslations("workspace.progress");
  const progress = getReadingProgress(document);
  if (!progress) return null;

  return (
    <section
      aria-label={t("continueLabel")}
      className="mb-6 flex flex-col gap-4 rounded-2xl border border-border bg-card p-5 sm:flex-row sm:items-center"
    >
      <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
        <BookOpen className="size-5" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs font-medium text-muted-foreground">{t("continueLabel")}</p>
        <p className="truncate text-sm font-semibold">{document.fileName}</p>
        <div className="mt-2 flex items-center gap-3">
          <ReadingProgressBar ratio={progress.ratio} className="w-full max-w-48" />
          <span className="shrink-0 text-xs tabular-nums text-muted-foreground">
            {t("pageOf", { page: progress.lastPage, total: progress.pageCount, ratio: progress.ratio })}
          </span>
        </div>
      </div>
      <Button asChild className="shrink-0">
        <Link href={ROUTES.document(document.id)}>
          {t("continueAction")}
          <ArrowRight />
        </Link>
      </Button>
    </section>
  );
};
