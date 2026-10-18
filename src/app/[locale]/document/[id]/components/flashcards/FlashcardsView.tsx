"use client";

import { useState } from "react";
import { Plus, StickyNote } from "lucide-react";
import { useTranslations } from "next-intl";
import { ROUTES } from "@/config/routes";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ApiErrorMessage } from "@/components/api-error-message";
import { getApiErrorKey } from "@/lib/api-errors";
import { useFetchAnnotations } from "@/app/[locale]/document/[id]/hooks/useAnnotations";
import {
  useCreateFlashcard,
  useFlashcards,
} from "@/app/[locale]/document/[id]/components/flashcards/hooks/useFlashcards";
import { FlashcardForm } from "@/app/[locale]/document/[id]/components/flashcards/components/FlashcardForm";
import { FlashcardList } from "@/app/[locale]/document/[id]/components/flashcards/components/FlashcardList";
import { AddWordsToDeckButton } from "@/app/[locale]/document/[id]/components/flashcards/components/AddWordsToDeckButton";
import { NoteSourcePicker } from "@/app/[locale]/document/[id]/components/flashcards/components/NoteSourcePicker";
import { PracticeDeck } from "@/app/[locale]/document/[id]/components/flashcards/components/PracticeDeck";
import { StudyPageLayout } from "@/app/[locale]/document/[id]/components/flashcards/components/StudyPageLayout";

type FlashcardsTab = "list" | "practice";

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

// Every card made from a document: create them, edit them in place and practice them.
export const FlashcardsView = ({ documentId, documentName }: FlashcardsViewProps) => {
  const t = useTranslations("flashcards");
  const { data: cards, isLoading, error } = useFlashcards(documentId);
  const { data: notes } = useFetchAnnotations(documentId);
  const createCard = useCreateFlashcard(documentId);
  const [tab, setTab] = useState<FlashcardsTab>("list");
  const [isComposing, setIsComposing] = useState(false);
  const [isPickingNote, setIsPickingNote] = useState(false);

  const openComposer = () => {
    createCard.reset();
    setIsComposing(true);
  };

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

  const creation = (
    <>
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
    </>
  );

  return (
    <StudyPageLayout
      back={{ href: ROUTES.document(documentId), label: t("backToDocument") }}
      eyebrow={documentName}
      title={t("title")}
      subtitle={cards?.length ? t("count", { count: cards.length }) : undefined}
    >
      {isLoading && <ListSkeleton label={t("loading")} />}

      {error && <ApiErrorMessage errorKey={getApiErrorKey(error)} className="py-10" />}

      {cards?.length === 0 && (
        <>
          {creation}
          {!isComposing && !isPickingNote && (
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
        </>
      )}

      {cards?.length ? (
        <Tabs value={tab} onValueChange={(value) => setTab(value as FlashcardsTab)} className="mt-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <TabsList className="w-56">
              <TabsTrigger value="list">{t("practice.listTab")}</TabsTrigger>
              <TabsTrigger value="practice">{t("practice.tab")}</TabsTrigger>
            </TabsList>
            {tab === "list" && (
              <div className="flex flex-wrap items-center justify-end gap-2">
                {sourceActions}
                {!isComposing && (
                  <Button onClick={openComposer}>
                    <Plus className="size-4" />
                    {t("newCard")}
                  </Button>
                )}
              </div>
            )}
          </div>

          <TabsContent value="list">
            {creation}
            <FlashcardList cards={cards} />
          </TabsContent>
          <TabsContent value="practice">
            <PracticeDeck cards={cards} onExit={() => setTab("list")} />
          </TabsContent>
        </Tabs>
      ) : null}
    </StudyPageLayout>
  );
};
