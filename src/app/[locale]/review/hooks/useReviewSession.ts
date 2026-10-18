import { useCallback, useMemo, useState } from "react";
import { useStudyShortcuts } from "@/app/[locale]/document/[id]/components/flashcards/hooks/useStudyShortcuts";
import {
  type DueFlashcard,
  FLASHCARD_RATINGS,
  type FlashcardRating,
  useReviewFlashcard,
} from "@/app/[locale]/review/hooks/useReview";

// Cards due again within this window come back in the same session (Anki's default learn-ahead limit).
const LEARN_AHEAD_MS = 20 * 60_000;

// Works through the due cards. A rating moves on at once; the card returns later if it is due again soon.
export const useReviewSession = (dueCards: DueFlashcard[]) => {
  const [queue, setQueue] = useState(dueCards);
  const [isRevealed, setIsRevealed] = useState(false);
  const [reviewedCount, setReviewedCount] = useState(0);
  const { mutate: submitReview } = useReviewFlashcard();
  const current = queue[0] ?? null;

  const reveal = useCallback(() => setIsRevealed(true), []);

  const rate = useCallback(
    (rating: FlashcardRating) => {
      if (!current || !isRevealed) return;
      setQueue((cards) => cards.slice(1));
      setIsRevealed(false);
      setReviewedCount((count) => count + 1);
      submitReview(
        { id: current.id, rating },
        {
          onSuccess: (updated) => {
            if (new Date(updated.due).getTime() - Date.now() <= LEARN_AHEAD_MS) {
              setQueue((cards) => [...cards, updated]);
            }
          },
          // Put the card back so the rating can be given again; the toast explains the failure.
          onError: () => {
            setQueue((cards) => [current, ...cards]);
            setReviewedCount((count) => count - 1);
          },
        }
      );
    },
    [current, isRevealed, submitReview]
  );

  // Space or Enter shows the answer; 1 to 4 rate it.
  const shortcuts = useMemo(
    () =>
      isRevealed
        ? Object.fromEntries(FLASHCARD_RATINGS.map((rating, index) => [String(index + 1), () => rate(rating)]))
        : { " ": reveal, Enter: reveal },
    [isRevealed, rate, reveal]
  );
  useStudyShortcuts(shortcuts, current !== null);

  return {
    current,
    isRevealed,
    reviewedCount,
    remainingCount: queue.length,
    reveal,
    rate,
  };
};
