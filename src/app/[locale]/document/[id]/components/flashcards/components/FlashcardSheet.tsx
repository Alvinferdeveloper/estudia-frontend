import { ArrowUpRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { ROUTES } from "@/config/routes";
import { cn } from "@/lib/utils";
import { MarkdownRenderer } from "@/app/[locale]/document/[id]/components/document-reader/note-ui";
import type { Flashcard } from "@/app/[locale]/document/[id]/components/flashcards/hooks/useFlashcards";

const sectionLabelClass = "text-[11px] font-medium uppercase tracking-[0.08em] text-muted-foreground";

interface FlashcardSheetProps {
  card: Flashcard;
  isRevealed: boolean;
  // The actions under the card: show the answer, move on, rate it.
  children: React.ReactNode;
  className?: string;
}

// One card being studied: the question, and its answer once revealed.
export const FlashcardSheet: React.FC<FlashcardSheetProps> = ({ card, isRevealed, children, className }) => {
  const t = useTranslations("flashcards");

  return (
    <article
      aria-live="polite"
      className={cn("flex min-h-72 flex-col rounded-xl border border-border bg-card px-6 py-8 sm:px-10", className)}
    >
      <h2 className={sectionLabelClass}>{t("practice.question")}</h2>
      <p className="mt-3 text-xl font-medium leading-snug text-balance text-foreground">{card.front}</p>

      {isRevealed && (
        <section className="mt-8 border-t border-border pt-6">
          <h3 className={sectionLabelClass}>{t("practice.answer")}</h3>
          <MarkdownRenderer content={card.back} className="mt-3 px-0" />
          {card.pageNumber && (
            <Link
              href={ROUTES.documentPage(card.documentId, card.pageNumber)}
              className="mt-4 inline-flex items-center gap-0.5 rounded-sm text-xs text-muted-foreground underline-offset-2 transition-colors duration-150 hover:text-foreground hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {t("item.page", { page: card.pageNumber })}
              <ArrowUpRight aria-hidden className="size-3" />
            </Link>
          )}
        </section>
      )}

      <div className="mt-auto pt-10">{children}</div>
    </article>
  );
};
