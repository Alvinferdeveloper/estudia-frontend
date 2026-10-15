"use client";

import { ArrowLeft, ArrowRight, ArrowUpRight, RotateCcw } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { ROUTES } from "@/config/routes";
import { Button } from "@/components/ui/button";
import { IconButton } from "@/components/ui/icon-button";
import { MarkdownRenderer } from "@/app/[locale]/document/[id]/components/document-reader/note-ui";
import type { Flashcard } from "@/app/[locale]/document/[id]/components/flashcards/hooks/useFlashcards";
import { usePracticeDeck } from "@/app/[locale]/document/[id]/components/flashcards/hooks/usePracticeDeck";

const Kbd: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <kbd className="font-sans text-[10px] opacity-60">{children}</kbd>
);

const sectionLabelClass = "text-[11px] font-medium uppercase tracking-[0.08em] text-muted-foreground";

interface PracticeDeckProps {
  cards: Flashcard[];
  onExit: () => void;
}

// Free practice: flip through the cards without grading them.
export const PracticeDeck: React.FC<PracticeDeckProps> = ({ cards, onExit }) => {
  const t = useTranslations("flashcards.practice");
  const tItem = useTranslations("flashcards.item");
  const deck = usePracticeDeck(cards);

  if (deck.isFinished) {
    return (
      <div className="py-16">
        <p className="text-base font-medium text-foreground">{t("doneTitle", { count: deck.total })}</p>
        <p className="mt-2 max-w-sm text-sm text-muted-foreground">{t("doneHint")}</p>
        <div className="mt-6 flex flex-wrap items-center gap-2">
          <Button onClick={deck.restart}>
            <RotateCcw className="size-4" />
            {t("restart")}
          </Button>
          <Button variant="ghost" onClick={onExit}>
            {t("backToList")}
          </Button>
        </div>
      </div>
    );
  }

  const card = deck.current!;
  const isLast = deck.index === deck.total - 1;

  return (
    <div className="mt-6">
      <div className="flex items-center justify-between gap-3">
        <p className="font-mono text-xs font-semibold tabular-nums text-muted-foreground">
          {t("progress", { current: deck.index + 1, total: deck.total })}
        </p>
        <div className="-mr-1.5 flex items-center gap-0.5">
          <IconButton label={t("previous")} size="icon-sm" onClick={deck.previous} disabled={deck.index === 0}>
            <ArrowLeft />
          </IconButton>
          <IconButton label={t("next")} size="icon-sm" onClick={deck.next}>
            <ArrowRight />
          </IconButton>
        </div>
      </div>

      <div aria-hidden className="mt-2 h-0.5 overflow-hidden rounded-full bg-muted">
        <div
          className="h-full origin-left bg-primary transition-transform duration-200 ease-[var(--ease-out)]"
          style={{ transform: `scaleX(${(deck.index + 1) / deck.total})` }}
        />
      </div>

      <article aria-live="polite" className="mt-6 flex min-h-72 flex-col rounded-xl border border-border bg-card px-6 py-8 sm:px-10">
        <h2 className={sectionLabelClass}>{t("question")}</h2>
        <p className="mt-3 text-xl font-medium leading-snug text-balance text-foreground">{card.front}</p>

        {deck.isRevealed && (
          <section className="mt-8 border-t border-border pt-6">
            <h3 className={sectionLabelClass}>{t("answer")}</h3>
            <MarkdownRenderer content={card.back} className="mt-3 px-0" />
          </section>
        )}

        <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-10">
          {deck.isRevealed && card.pageNumber ? (
            <Link
              href={ROUTES.documentPage(card.documentId, card.pageNumber)}
              className="inline-flex items-center gap-0.5 rounded-sm text-xs text-muted-foreground underline-offset-2 transition-colors duration-150 hover:text-foreground hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {tItem("page", { page: card.pageNumber })}
              <ArrowUpRight aria-hidden className="size-3" />
            </Link>
          ) : (
            <span />
          )}
          {deck.isRevealed ? (
            <Button onClick={deck.next}>
              {isLast ? t("finish") : t("next")}
              <Kbd>{t("spaceKey")}</Kbd>
            </Button>
          ) : (
            <Button onClick={deck.reveal}>
              {t("show")}
              <Kbd>{t("spaceKey")}</Kbd>
            </Button>
          )}
        </div>
      </article>
    </div>
  );
};
