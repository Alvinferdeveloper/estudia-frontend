"use client";

import { useMemo, useState } from "react";
import { X } from "lucide-react";
import { useTranslations } from "next-intl";
import { IconButton } from "@/components/ui/icon-button";
import { useFetchAnnotations } from "@/app/[locale]/document/[id]/hooks/useAnnotations";
import { useFlashcards } from "@/app/[locale]/document/[id]/components/flashcards/hooks/useFlashcards";
import { NoteFlashcardProposals } from "@/app/[locale]/document/[id]/components/flashcards/components/NoteFlashcardProposals";

interface NoteSourcePickerProps {
  documentId: string;
  onClose: () => void;
}

// Picks one of the document's notes, then reviews the cards the AI proposes for it.
export const NoteSourcePicker: React.FC<NoteSourcePickerProps> = ({ documentId, onClose }) => {
  const t = useTranslations("flashcards.note");
  const tFlashcards = useTranslations("flashcards");
  const { data: notes } = useFetchAnnotations(documentId);
  const { data: cards } = useFlashcards(documentId);
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);

  const cardsPerNote = useMemo(() => {
    const counts = new Map<string, number>();
    for (const card of cards ?? []) {
      if (card.annotationId) counts.set(card.annotationId, (counts.get(card.annotationId) ?? 0) + 1);
    }
    return counts;
  }, [cards]);

  return (
    <section className="mt-6 flex max-h-[32rem] flex-col overflow-hidden rounded-xl border border-border bg-card">
      {selectedNoteId ? (
        <NoteFlashcardProposals
          annotationId={selectedNoteId}
          onBack={() => setSelectedNoteId(null)}
        />
      ) : (
        <>
          <header className="flex shrink-0 items-start justify-between gap-3 px-5 pb-2 pt-4">
            <div>
              <h2 className="text-base font-semibold text-foreground">{t("pickTitle")}</h2>
              <p className="mt-0.5 text-sm text-muted-foreground">{t("pickHint")}</p>
            </div>
            <IconButton label={t("close")} size="icon-sm" onClick={onClose} className="-mr-1.5">
              <X />
            </IconButton>
          </header>
          <ol className="min-h-0 flex-1 overflow-y-auto scrollbar-thin px-2 pb-2">
            {notes?.map((note) => {
              const existing = cardsPerNote.get(note.id) ?? 0;
              return (
                <li key={note.id}>
                  <button
                    type="button"
                    onClick={() => setSelectedNoteId(note.id)}
                    className="w-full rounded-lg px-3 py-3 text-left outline-none transition-colors duration-150 hover:bg-accent/60 focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <span className="line-clamp-2 text-sm text-foreground">{note.selectedText}</span>
                    <span className="mt-1 block text-xs text-muted-foreground">
                      {tFlashcards("item.page", { page: note.pageNumber })}
                      {existing > 0 && ` · ${t("existing", { count: existing })}`}
                    </span>
                  </button>
                </li>
              );
            })}
          </ol>
        </>
      )}
    </section>
  );
};
