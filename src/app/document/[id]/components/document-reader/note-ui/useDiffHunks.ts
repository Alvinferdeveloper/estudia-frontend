import { useMemo } from 'react';
import { DiffChunk } from './lib/diff';

export interface Hunk {
  type: 'unchanged' | 'change';
  items: (DiffChunk & { originalIndex: number })[];
}

export function useDiffHunks(chunks: DiffChunk[]) {
  return useMemo(() => {
    const result: Hunk[] = [];
    let currentHunk: (DiffChunk & { originalIndex: number })[] = [];
    let isBuildingChange = false;
    const MAX_GAP = 2;

    // Crucial function: Decides if a text should survive in the normal view
    // after being accepted or rejected.
    const survives = (c: DiffChunk) => {
      if (c.type === 'unchanged') return true;
      if (c.type === 'add' && c.accepted === true) return true;
      if (c.type === 'remove' && c.accepted === false) return true;
      return false; // Accepted deletions or rejected additions disappear.
    };

    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i];
      const item = { ...chunk, originalIndex: i };

      // A block is "pending" if it is a modification that has not been accepted/rejected
      const isPending = chunk.type !== 'unchanged' && chunk.accepted === null;

      if (isPending) {
        if (!isBuildingChange) {
          if (currentHunk.length > 0) {
            result.push({ type: 'unchanged', items: currentHunk });
            currentHunk = [];
          }
          isBuildingChange = true;
        }
        currentHunk.push(item);
      } else {
        if (isBuildingChange) {
          // We should NEVER absorb a block that has already been accepted/rejected.
          let canAbsorb = chunk.type === 'unchanged';
          let foundPendingSoon = false;

          if (canAbsorb) {
            let gapSize = 0;
            for (let j = i; j < chunks.length; j++) {
              const future = chunks[j];
              const futurePending = future.type !== 'unchanged' && future.accepted === null;
              if (futurePending) {
                foundPendingSoon = true;
                break;
              }
              if (future.type !== 'unchanged') {
                break; // We hit an already resolved change. We can't absorb.
              }
              gapSize++;
              if (gapSize > MAX_GAP) break;
            }
          }

          if (canAbsorb && foundPendingSoon) {
            currentHunk.push(item);
          } else {
            // We close the change block safely
            result.push({ type: 'change', items: currentHunk });
            currentHunk = [];
            isBuildingChange = false;

            // We start the normal text only if the current block survives
            if (survives(chunk)) currentHunk.push(item);
          }
        } else {
          if (survives(chunk)) {
            currentHunk.push(item);
          }
        }
      }
    }

    if (currentHunk.length > 0) {
      result.push({ type: isBuildingChange ? 'change' : 'unchanged', items: currentHunk });
    }
    return result;
  }, [chunks]);
}
