import { useCallback, useEffect, useMemo, useState } from "react";
import { useStudyShortcuts } from "@/app/[locale]/document/[id]/components/flashcards/hooks/useStudyShortcuts";
import {
  type DueFlashcard,
  FLASHCARD_RATINGS,
  type FlashcardRating,
  useReviewFlashcard,
} from "@/app/[locale]/review/hooks/useReview";

// Cards coming back within this window (learning steps) stay in the session and wait for their time.
const SESSION_WAIT_LIMIT_MS = 20 * 60_000;

const dueTime = (card: DueFlashcard): number => new Date(card.due).getTime();

// Works through the due cards. A card is only shown once it is due, never early.
export const useReviewSession = (dueCards: DueFlashcard[]) => {
  const [queue, setQueue] = useState(dueCards);
  const [now, setNow] = useState(() => Date.now());
  const [isRevealed, setIsRevealed] = useState(false);
  const [reviewedCount, setReviewedCount] = useState(0);
  // Ratings still being saved: their card may come back into the queue.
  const [savingCount, setSavingCount] = useState(0);
  const { mutateAsync: submitReview } = useReviewFlashcard();

  const current = queue.find((card) => dueTime(card) <= now) ?? null;
  // Only learning cards remain and none is due yet.
  const waitingUntil = !current && queue.length > 0 ? Math.min(...queue.map(dueTime)) : null;

  useEffect(() => {
    if (waitingUntil === null) return;
    const timeout = setTimeout(() => setNow(Date.now()), Math.max(waitingUntil - Date.now(), 0));
    return () => clearTimeout(timeout);
  }, [waitingUntil]);

  const reveal = useCallback(() => setIsRevealed(true), []);

  const rate = useCallback(
    (rating: FlashcardRating) => {
      if (!current || !isRevealed) return;
      setQueue((cards) => cards.filter((card) => card.id !== current.id));
      setNow(Date.now());
      setIsRevealed(false);
      setReviewedCount((count) => count + 1);
      setSavingCount((count) => count + 1);
      // A promise per rating: mutate() callbacks only fire for the latest of overlapping calls.
      submitReview({ id: current.id, rating })
        .then((updated) => {
          if (dueTime(updated) - Date.now() <= SESSION_WAIT_LIMIT_MS) {
            setQueue((cards) => [...cards, updated]);
          }
        })
        // Put the card back so the rating can be given again; the toast explains the failure.
        .catch(() => {
          setQueue((cards) => [current, ...cards]);
          setReviewedCount((count) => count - 1);
        })
        .finally(() => setSavingCount((count) => count - 1));
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
    waitingUntil,
    isRevealed,
    reviewedCount,
    remainingCount: queue.length,
    isFinished: queue.length === 0 && savingCount === 0,
    reveal,
    rate,
  };
};
