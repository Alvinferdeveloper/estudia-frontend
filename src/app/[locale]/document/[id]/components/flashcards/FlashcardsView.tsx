"use client";

import { useState } from "react";
import { ArrowLeft, Plus, StickyNote } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { ROUTES } from "@/config/routes";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ApiErrorMessage } from "@/components/api-error-message";
import { getApiErrorKey } from "@/lib/api-errors";
import {
  useCreateFlashcard,
  useDeleteFlashcard,
  useFlashcards,
  useUpdateFlashcard,
} from "@/app/[locale]/document/[id]/components/flashcards/hooks/useFlashcards";
import { FlashcardForm } from "@/app/[locale]/document/[id]/components/flashcards/components/FlashcardForm";
import { FlashcardItem } from "@/app/[locale]/document/[id]/components/flashcards/components/FlashcardItem";
import { AddWordsToDeckButton } from "@/app/[locale]/document/[id]/components/flashcards/components/AddWordsToDeckButton";
import { NoteSourcePicker } from "@/app/[locale]/document/[id]/components/flashcards/components/NoteSourcePicker";
import { useFetchAnnotations } from "@/app/[locale]/document/[id]/hooks/useAnnotations";

interface FlashcardsViewProps {
  documentId: string;
  documentName: string;
}

const ListSkeleton = ({ label }: { label: string }) => (
  <div role="status" aria-label={label} className="divide-y divide-border">
    {[0, 1, 2].map((row) => (
      <div key={row} className="space-y-2.5 py-5">
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-3.5 w-11/12" />
        <Skeleton className="h-3 w-24" />
      </div>
    ))}
  </div>
);

// Every card made from a document: write, edit and delete them in place.
export const FlashcardsView = ({ documentId, documentName }: FlashcardsViewProps) => {
  const t = useTranslations("flashcards");
  const { data: cards, isLoading, error } = useFlashcards(documentId);
  const createCard = useCreateFlashcard(documentId);
  const updateCard = useUpdateFlashcard(documentId);
  const deleteCard = useDeleteFlashcard(documentId);
  const [isComposing, setIsComposing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isPickingNote, setIsPickingNote] = useState(false);
  const { data: notes } = useFetchAnnotations(documentId);

  const openComposer = () => {
    createCard.reset();
    setIsComposing(true);
  };

  const startEditing = (id: string) => {
    updateCard.reset();
    setEditingId(id);
  };

  const hasCards = Boolean(cards?.length);

  const sourceActions = (
    <>
      {Boolean(notes?.length) && !isPickingNote && (
        <Button variant="ghost" size="sm" onClick={() => setIsPickingNote(true)}>
          <StickyNote className="size-4" />
          {t("note.fromNote")}
        </Button>
      )}
      <AddWordsToDeckButton documentId={documentId} />
    </>
  );

  return (
    <div className="min-h-dvh bg-background text-foreground">
      <div className="mx-auto w-full max-w-2xl px-4 pb-16 pt-6">
        <Button asChild variant="ghost" size="sm" className="-ml-3">
          <Link href={ROUTES.document(documentId)}>
            <ArrowLeft className="size-4" />
            {t("backToDocument")}
          </Link>
        </Button>

        <header className="mt-10 border-b border-border pb-6">
          <p className="truncate text-xs font-medium uppercase tracking-[0.08em] text-muted-foreground">{documentName}</p>
          <h1 className="mt-2 font-serif text-4xl italic leading-tight">{t("title")}</h1>
          {hasCards && <p className="mt-1 text-sm text-muted-foreground">{t("count", { count: cards!.length })}</p>}
        </header>

        {hasCards && (
          <div className="mt-4 flex flex-wrap items-center justify-end gap-2">
            {sourceActions}
            {!isComposing && (
              <Button onClick={openComposer}>
                <Plus className="size-4" />
                {t("newCard")}
              </Button>
            )}
          </div>
        )}

        {isComposing && (
          <FlashcardForm
            className="mt-6"
            submitLabel={t("form.add")}
            onSubmit={(card) => createCard.mutateAsync(card)}
            onCancel={() => setIsComposing(false)}
            isPending={createCard.isPending}
            error={createCard.error}
            resetOnSubmit
          />
        )}

        {isPickingNote && <NoteSourcePicker documentId={documentId} onClose={() => setIsPickingNote(false)} />}

        {isLoading && <ListSkeleton label={t("loading")} />}

        {error && <ApiErrorMessage errorKey={getApiErrorKey(error)} className="py-10" />}

        {cards?.length === 0 && !isComposing && !isPickingNote && (
          <div className="py-16">
            <p className="text-base font-medium text-foreground">{t("empty.title")}</p>
            <p className="mt-2 max-w-sm text-sm text-muted-foreground">{t("empty.hint")}</p>
            <div className="mt-6 flex flex-wrap items-center gap-2">
              <Button onClick={openComposer}>
                <Plus className="size-4" />
                {t("newCard")}
              </Button>
              {sourceActions}
            </div>
          </div>
        )}

        {hasCards && (
          <ul className="divide-y divide-border">
            {cards!.map((card) =>
              card.id === editingId ? (
                <li key={card.id} className="py-4">
                  <FlashcardForm
                    initial={card}
                    submitLabel={t("form.save")}
                    onSubmit={async (content) => {
                      await updateCard.mutateAsync({ id: card.id, ...content });
                      setEditingId(null);
                    }}
                    onCancel={() => setEditingId(null)}
                    isPending={updateCard.isPending}
                    error={updateCard.error}
                  />
                </li>
              ) : (
                <FlashcardItem
                  key={card.id}
                  card={card}
                  onEdit={() => startEditing(card.id)}
                  onDelete={() => deleteCard.mutateAsync(card.id)}
                />
              )
            )}
          </ul>
        )}
      </div>
    </div>
  );
};
