import { useCallback, useMemo, useState } from "react";
import {
  HunkDecision,
  buildHunks,
  getChangeIds,
  mergeHunks,
} from "@/app/[locale]/document/[id]/lib/note-diff";

// Decisions stay local while reviewing; the merged text is handed back once every change is decided.
export const useDiffReview = (original: string, proposal: string, onResolve: (merged: string) => void) => {
  const hunks = useMemo(() => buildHunks(original, proposal), [original, proposal]);
  const changeIds = useMemo(() => getChangeIds(hunks), [hunks]);
  const [decisions, setDecisions] = useState<Record<number, HunkDecision>>({});

  const apply = useCallback(
    (next: Record<number, HunkDecision>) => {
      setDecisions(next);
      if (changeIds.every((id) => next[id])) onResolve(mergeHunks(hunks, next));
    },
    [changeIds, hunks, onResolve]
  );

  const decide = useCallback(
    (id: number, decision: HunkDecision) => apply({ ...decisions, [id]: decision }),
    [apply, decisions]
  );

  const decideRemaining = useCallback(
    (decision: HunkDecision) => apply(Object.fromEntries(changeIds.map((id) => [id, decisions[id] ?? decision]))),
    [apply, changeIds, decisions]
  );

  const pendingIds = changeIds.filter((id) => !decisions[id]);

  return {
    hunks,
    decisions,
    pendingCount: pendingIds.length,
    // The change keyboard shortcuts act on: the first one still pending.
    currentId: pendingIds[0] as number | undefined,
    decide,
    decideRemaining,
  };
};
