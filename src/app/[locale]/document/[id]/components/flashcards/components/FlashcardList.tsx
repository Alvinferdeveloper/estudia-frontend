"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import {
  type Flashcard,
  useDeleteFlashcard,
  useUpdateFlashcard,
} from "@/app/[locale]/document/[id]/components/flashcards/hooks/useFlashcards";
import { FlashcardForm } from "@/app/[locale]/document/[id]/components/flashcards/components/FlashcardForm";
import { FlashcardItem } from "@/app/[locale]/document/[id]/components/flashcards/components/FlashcardItem";

interface FlashcardListProps {
  cards: Flashcard[];
}

// The cards of a document; editing swaps a row for the inline form.
export const FlashcardList: React.FC<FlashcardListProps> = ({ cards }) => {
  const t = useTranslations("flashcards.form");
  const updateCard = useUpdateFlashcard();
  const deleteCard = useDeleteFlashcard();
  const [editingId, setEditingId] = useState<string | null>(null);

  const startEditing = (id: string) => {
    updateCard.reset();
    setEditingId(id);
  };

  return (
    <ul className="mt-6 flex flex-col gap-3">
      {cards.map((card) =>
        card.id === editingId ? (
          <li key={card.id}>
            <FlashcardForm
              initial={card}
              submitLabel={t("save")}
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
  );
};
