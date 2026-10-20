import { ArrowUpRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { ROUTES } from "@/config/routes";
import { cn } from "@/lib/utils";
import { MarkdownRenderer } from "@/app/[locale]/document/[id]/components/document-reader/note-ui";
import type { Flashcard } from "@/app/[locale]/document/[id]/components/flashcards/hooks/useFlashcards";

const sectionLabelClass = "text-[11px] font-medium uppercase tracking-[0.08em] text-muted-foreground";

// Edges of the cards still to come, peeking out under the current one (nearest first).
const STACK_LAYERS = ["inset-x-3 -bottom-1.5", "inset-x-6 -bottom-3"] as const;

interface FlashcardSheetProps {
  card: Flashcard;
  isRevealed: boolean;
  // Cards left after this one; up to two show as a stack behind it.
  cardsBehind?: number;
  // The actions under the card: show the answer, move on, rate it.
  children: React.ReactNode;
  className?: string;
}

// One card being studied, as an index card: the question on the sheet, the answer on its shaded side once revealed.
export const FlashcardSheet: React.FC<FlashcardSheetProps> = ({
  card,
  isRevealed,
  cardsBehind = 0,
  children,
  className,
}) => {
  const t = useTranslations("flashcards");
  const layers = STACK_LAYERS.slice(0, Math.max(cardsBehind, 0));

  return (
    <div className={className}>
      <div className="relative">
        {[...layers].reverse().map((position) => (
          <div
            key={position}
            aria-hidden
            className={cn("absolute top-0 rounded-xl border border-border bg-card", position)}
          />
        ))}

        <article
          aria-live="polite"
          className="relative overflow-hidden rounded-xl border border-border bg-card"
        >
          <div className="flex min-h-48 flex-col px-6 py-8 sm:px-10">
            <h2 className={sectionLabelClass}>{t("practice.question")}</h2>
            <p className="my-auto pt-4 text-xl font-medium leading-snug text-balance text-foreground">{card.front}</p>
          </div>

          {isRevealed && (
            <section className="border-t border-border bg-muted/50 px-6 py-6 sm:px-10">
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
        </article>
      </div>

      <div className={cn(layers.length ? "mt-8" : "mt-5")}>{children}</div>
    </div>
  );
};
