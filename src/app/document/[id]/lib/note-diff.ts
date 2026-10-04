type LineOp = { type: "same" | "add" | "remove"; text: string };

export type NoteHunk =
  | { kind: "same"; lines: string[] }
  | { kind: "change"; id: number; removed: string[]; added: string[] };

export type ChangeHunk = Extract<NoteHunk, { kind: "change" }>;

export type HunkDecision = "accept" | "reject";

// Line-level LCS; lines are compared trimmed so stray whitespace from the model isn't reported as a change.
const diffLines = (before: string[], after: string[]): LineOp[] => {
  const n = before.length;
  const m = after.length;
  const dp: number[][] = Array.from({ length: n + 1 }, () => Array(m + 1).fill(0));

  for (let i = 1; i <= n; i++) {
    for (let j = 1; j <= m; j++) {
      dp[i][j] =
        before[i - 1].trim() === after[j - 1].trim()
          ? dp[i - 1][j - 1] + 1
          : Math.max(dp[i - 1][j], dp[i][j - 1]);
    }
  }

  const ops: LineOp[] = [];
  let i = n;
  let j = m;
  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && before[i - 1].trim() === after[j - 1].trim()) {
      ops.push({ type: "same", text: after[j - 1] });
      i--;
      j--;
    } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
      ops.push({ type: "add", text: after[j - 1] });
      j--;
    } else {
      ops.push({ type: "remove", text: before[i - 1] });
      i--;
    }
  }
  return ops.reverse();
};

const hasText = (lines: string[]) => lines.some((line) => line.trim().length > 0);

// Groups consecutive changed lines into reviewable hunks; whitespace-only changes are folded into unchanged text.
export const buildHunks = (before: string, after: string): NoteHunk[] => {
  const hunks: NoteHunk[] = [];
  let nextId = 0;

  const pushSame = (lines: string[]) => {
    const last = hunks.at(-1);
    if (last?.kind === "same") last.lines.push(...lines);
    else hunks.push({ kind: "same", lines: [...lines] });
  };

  for (const op of diffLines(before.split("\n"), after.split("\n"))) {
    if (op.type === "same") {
      pushSame([op.text]);
      continue;
    }
    const last = hunks.at(-1);
    let hunk: ChangeHunk;
    if (last?.kind === "change") {
      hunk = last;
    } else {
      hunk = { kind: "change", id: nextId++, removed: [], added: [] };
      hunks.push(hunk);
    }
    (op.type === "add" ? hunk.added : hunk.removed).push(op.text);
  }

  return hunks.reduce<NoteHunk[]>((result, hunk) => {
    if (hunk.kind === "change" && !hasText(hunk.removed) && !hasText(hunk.added)) {
      const last = result.at(-1);
      if (last?.kind === "same") last.lines.push(...hunk.added);
      else result.push({ kind: "same", lines: hunk.added });
      return result;
    }
    result.push(hunk);
    return result;
  }, []);
};

export const getChangeIds = (hunks: NoteHunk[]): number[] =>
  hunks.flatMap((hunk) => (hunk.kind === "change" ? [hunk.id] : []));

export const resolveHunk = (hunk: ChangeHunk, decision: HunkDecision): string[] =>
  decision === "accept" ? hunk.added : hunk.removed;

export const mergeHunks = (hunks: NoteHunk[], decisions: Record<number, HunkDecision>): string =>
  hunks
    .flatMap((hunk) => (hunk.kind === "same" ? hunk.lines : resolveHunk(hunk, decisions[hunk.id] ?? "reject")))
    .join("\n");
