import { useTranslations } from "next-intl";
import { ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { ROUTES } from "@/config/routes";
import type { Document } from "@/app/types";
import { getReadingProgress } from "@/app/[locale]/workspace/lib/reading-progress";
import { ReadingProgressBar } from "@/app/[locale]/workspace/components/ReadingProgressBar";

const PAGE_LINES = ["w-full", "w-4/5", "w-full", "w-3/5", "w-11/12", "w-2/3"];

// A sheet of paper open at the page the user left, with a bookmark ribbon: the book as they left it.
const OpenPage: React.FC<{ page: number }> = ({ page }) => (
  <div
    aria-hidden
    className="relative aspect-[3/4] w-16 shrink-0 rounded-[3px] bg-ivory-sheet px-2.5 pb-5 pt-3 shadow-lift transition-transform duration-200 ease-[var(--ease-out)] group-hover:-translate-y-0.5 motion-reduce:transform-none"
  >
    <div className="flex flex-col gap-1.5">
      {PAGE_LINES.map((width, index) => (
        <span key={index} className={`h-[2px] rounded-full bg-muted-foreground/30 dark:bg-background/25 ${width}`} />
      ))}
    </div>
    <span className="absolute bottom-1.5 right-2 font-serif text-[10px] italic tabular-nums text-muted-foreground dark:text-background/70">{page}</span>
    <span className="absolute -top-1 right-3 h-6 w-2.5 bg-ochre [clip-path:polygon(0_0,100%_0,100%_100%,50%_75%,0_100%)]" />
  </div>
);

// One click from the workspace back to the page the user was reading.
export const ContinueReading: React.FC<{ document: Document }> = ({ document }) => {
  const t = useTranslations("workspace.progress");
  const progress = getReadingProgress(document);
  if (!progress) return null;

  return (
    <Link
      href={ROUTES.document(document.id)}
      className="group -mx-3 mb-6 flex items-center gap-5 rounded-2xl p-3 outline-none transition-colors duration-150 hover:bg-accent/50 focus-visible:ring-2 focus-visible:ring-ring"
    >
      <OpenPage page={progress.lastPage} />

      <div className="min-w-0 flex-1">
        <p className="text-sm text-muted-foreground">{t("leftOff", { page: progress.lastPage })}</p>
        <p className="truncate font-serif text-2xl italic leading-tight">{document.fileName}</p>
        <div className="mt-2.5 flex items-center gap-3">
          <ReadingProgressBar ratio={progress.ratio} className="h-0.5 max-w-sm flex-1" />
          <span className="shrink-0 text-xs tabular-nums text-muted-foreground">
            {t("remaining", { ratio: progress.ratio, count: progress.pageCount - progress.furthestPage })}
          </span>
        </div>
      </div>

      <span className="hidden shrink-0 items-center gap-1.5 text-sm font-medium text-primary sm:flex">
        {t("continueAction")}
        <ArrowRight className="size-4 transition-transform duration-200 ease-[var(--ease-out)] group-hover:translate-x-0.5 motion-reduce:transform-none" />
      </span>
    </Link>
  );
};
