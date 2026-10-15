"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Pencil, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { IconButton } from "@/components/ui/icon-button";
import { ApiErrorText } from "@/components/api-error-message";
import { getApiErrorKey } from "@/lib/api-errors";
import { MarkdownRenderer } from "@/app/[locale]/document/[id]/components/document-reader/note-ui";
import { NoteStatus } from "@/app/[locale]/document/[id]/components/document-reader/note-ui/NoteLayout";
import {
  type FlashcardContent,
  useGenerateNoteFlashcards,
  useSaveNoteFlashcards,
} from "@/app/[locale]/document/[id]/components/flashcards/hooks/useFlashcards";
import { FlashcardForm } from "@/app/[locale]/document/[id]/components/flashcards/components/FlashcardForm";

interface Proposal {
  card: FlashcardContent;
  discarded: boolean;
}

interface NoteFlashcardProposalsProps {
  annotationId: string;
  documentId: string;
  // Leaves the proposals, after saving or without saving.
  onBack: () => void;
  className?: string;
}

// The AI's cards for a note, each kept, edited or discarded before anything is saved.
export const NoteFlashcardProposals: React.FC<NoteFlashcardProposalsProps> = ({
  annotationId,
  documentId,
  onBack,
  className,
}) => {
  const t = useTranslations("flashcards.note");
  const generate = useGenerateNoteFlashcards();
  const save = useSaveNoteFlashcards(documentId);
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const requestProposals = useCallback(() => {
    generate.mutate(annotationId, {
      onSuccess: (cards) => setProposals(cards.map((card) => ({ card, discarded: false }))),
    });
  }, [generate, annotationId]);

  // Each request spends a credit, so it runs once per opening (StrictMode re-runs effects in development).
  const hasRequested = useRef(false);
  useEffect(() => {
    if (hasRequested.current) return;
    hasRequested.current = true;
    requestProposals();
  }, [requestProposals]);

  const updateProposal = (index: number, change: Partial<Proposal>) =>
    setProposals((current) => current.map((proposal, i) => (i === index ? { ...proposal, ...change } : proposal)));

  const kept = proposals.filter((proposal) => !proposal.discarded).map((proposal) => proposal.card);

  const handleSave = () => {
    save.mutate(
      { annotationId, cards: kept },
      {
        onSuccess: (saved) => {
          toast.success(t("saved", { count: saved.length }));
          onBack();
        },
      }
    );
  };

  const error = generate.error ?? save.error;

  return (
    <div className={cn("flex min-h-0 flex-1 flex-col", className)}>
      <div className="min-h-0 flex-1 overflow-y-auto scrollbar-thin px-6 py-5">
        {generate.isPending && <NoteStatus label={t("generating")} />}

        {proposals.length > 0 && (
          <>
            <p className="text-sm text-muted-foreground">{t("intro")}</p>
            <ol className="mt-2 divide-y divide-border">
              {proposals.map((proposal, index) =>
                index === editingIndex ? (
                  <li key={index} className="py-4">
                    <FlashcardForm
                      initial={proposal.card}
                      submitLabel={t("done")}
                      onSubmit={async (card) => {
                        updateProposal(index, { card });
                        setEditingIndex(null);
                      }}
                      onCancel={() => setEditingIndex(null)}
                      isPending={false}
                      error={null}
                    />
                  </li>
                ) : (
                  <li
                    key={index}
                    className={cn(
                      "flex items-start gap-3 py-4 transition-opacity duration-150 ease-[var(--ease-out)]",
                      proposal.discarded && "opacity-50"
                    )}
                  >
                    <div className="min-w-0 flex-1">
                      <p
                        className={cn(
                          "text-[15px] font-medium leading-snug text-foreground",
                          proposal.discarded && "line-through decoration-muted-foreground/60"
                        )}
                      >
                        {proposal.card.front}
                      </p>
                      <MarkdownRenderer
                        content={proposal.card.back}
                        compact
                        className="mt-1.5 px-0 text-sm text-muted-foreground"
                      />
                    </div>
                    <div className="-mr-1.5 flex shrink-0 items-center gap-0.5">
                      {proposal.discarded ? (
                        <Button variant="ghost" size="sm" onClick={() => updateProposal(index, { discarded: false })}>
                          {t("restore")}
                        </Button>
                      ) : (
                        <>
                          <IconButton label={t("edit")} size="icon-sm" onClick={() => setEditingIndex(index)}>
                            <Pencil />
                          </IconButton>
                          <IconButton
                            label={t("discard")}
                            size="icon-sm"
                            variant="ghost-destructive"
                            onClick={() => updateProposal(index, { discarded: true })}
                          >
                            <X />
                          </IconButton>
                        </>
                      )}
                    </div>
                  </li>
                )
              )}
            </ol>
          </>
        )}
      </div>

      <div className="flex shrink-0 flex-wrap items-center justify-end gap-2 border-t border-border bg-card px-4 py-3">
        {error && (
          <p role="alert" className="mr-auto text-sm text-destructive">
            <ApiErrorText errorKey={getApiErrorKey(error)} fallback={t("error")} />
          </p>
        )}
        <Button variant="ghost" size="sm" onClick={onBack}>
          {t("back")}
        </Button>
        {generate.isError ? (
          <Button size="sm" onClick={requestProposals}>
            {t("retry")}
          </Button>
        ) : (
          <Button
            size="sm"
            onClick={handleSave}
            disabled={kept.length === 0 || editingIndex !== null || save.isPending || generate.isPending}
          >
            {t("save", { count: kept.length })}
          </Button>
        )}
      </div>
    </div>
  );
};
