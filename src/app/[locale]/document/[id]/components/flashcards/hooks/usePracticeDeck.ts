import { useCallback, useEffect, useState } from "react";
import type { Flashcard } from "@/app/[locale]/document/[id]/components/flashcards/hooks/useFlashcards";

const shuffle = <T>(items: T[]): T[] => {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
};

// One pass through the cards in random order: question first, answer on demand.
export const usePracticeDeck = (cards: Flashcard[]) => {
  const [order, setOrder] = useState(() => shuffle(cards));
  const [index, setIndex] = useState(0);
  const [isRevealed, setIsRevealed] = useState(false);

  const isFinished = index >= order.length;
  const current = isFinished ? null : order[index];

  const reveal = useCallback(() => setIsRevealed(true), []);

  const next = useCallback(() => {
    setIndex((value) => Math.min(value + 1, order.length));
    setIsRevealed(false);
  }, [order.length]);

  const previous = useCallback(() => {
    setIndex((value) => Math.max(value - 1, 0));
    setIsRevealed(false);
  }, []);

  const restart = useCallback(() => {
    setOrder(shuffle(cards));
    setIndex(0);
    setIsRevealed(false);
  }, [cards]);

  // Space or Enter shows the answer (or moves on once shown); arrows move between cards.
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const target = event.target instanceof HTMLElement ? event.target : null;
      // Text fields and the tab list keep their own keys.
      if (target?.closest("input, textarea, [contenteditable='true'], [role='tablist']") || isFinished) return;
      if (event.key === " " || event.key === "Enter") {
        // A focused button or link already acts on these keys.
        if (target?.closest("button, a")) return;
        event.preventDefault();
        if (isRevealed) next();
        else reveal();
      } else if (event.key === "ArrowRight") {
        next();
      } else if (event.key === "ArrowLeft") {
        previous();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isFinished, isRevealed, next, previous, reveal]);

  return { current, index, total: order.length, isRevealed, isFinished, reveal, next, previous, restart };
};
