export interface DiffChunk {
  type: 'add' | 'remove' | 'unchanged';
  text: string;
  accepted: boolean | null;
}

/**
 * Core LCS (Longest Common Subsequence) algorithm for diffing
 * This ensures the correct order of changes and preserves position.
 */
function computeLCS(originalArr: string[], newArr: string[]): DiffChunk[] {
  const n = originalArr.length;
  const m = newArr.length;
  
  // Create DP matrix
  const dp: number[][] = Array.from({ length: n + 1 }, () => Array(m + 1).fill(0));

  for (let i = 1; i <= n; i++) {
    for (let j = 1; j <= m; j++) {
      // Compare trimmed versions to ignore accidental whitespace diffs
      if (originalArr[i - 1].trim() === newArr[j - 1].trim()) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }

  const result: DiffChunk[] = [];
  let i = n, j = m;

  // Backtrack to find the diff
  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && originalArr[i - 1].trim() === newArr[j - 1].trim()) {
      // Matching line (using the version from newArr to keep any formatting/spaces)
      result.unshift({ type: 'unchanged', text: newArr[j - 1], accepted: true });
      i--;
      j--;
    } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
      // Added in newArr
      result.unshift({ type: 'add', text: newArr[j - 1], accepted: null });
      j--;
    } else if (i > 0 && (j === 0 || dp[i][j - 1] < dp[i - 1][j])) {
      // Removed from originalArr
      result.unshift({ type: 'remove', text: originalArr[i - 1], accepted: null });
      i--;
    }
  }

  return result;
}

export function computeDiff(original: string, newText: string, mode: 'words' | 'lines' = 'lines'): DiffChunk[] {
  // Edge cases
  if (!original && !newText) return [];
  if (!original && newText) return [{ type: 'add', text: newText, accepted: null }];
  if (!newText && original) return [{ type: 'remove', text: original, accepted: null }];
  if (original === newText) return [{ type: 'unchanged', text: original, accepted: true }];

  if (mode === 'words') {
    const originalWords = original.split(/(\s+)/).filter(w => w);
    const newWords = newText.split(/(\s+)/).filter(w => w);
    return computeLCS(originalWords, newWords);
  }

  // Split by lines, including empty lines which are important for layout
  const originalLines = original.split('\n');
  const newLines = newText.split('\n');
  
  return computeLCS(originalLines, newLines);
}

export function mergeAcceptedChunks(chunks: DiffChunk[]): string {
  const resultLines: string[] = [];

  chunks.forEach(chunk => {
    if (chunk.type === 'unchanged') {
      resultLines.push(chunk.text);
    } else if (chunk.type === 'add' && chunk.accepted === true) {
      resultLines.push(chunk.text);
    } else if (chunk.type === 'remove' && chunk.accepted === false) {
      // If we REJECTED the removal, we keep the original text
      resultLines.push(chunk.text);
    }
  });

  return resultLines.join('\n');
}

export function acceptAll(chunks: DiffChunk[]): DiffChunk[] {
  return chunks.map(chunk => ({
    ...chunk,
    accepted: chunk.type === 'add' ? true : chunk.type === 'remove' ? false : true,
  }));
}

export function rejectAll(chunks: DiffChunk[]): DiffChunk[] {
  return chunks.map(chunk => ({
    ...chunk,
    accepted: chunk.type === 'add' ? false : chunk.type === 'remove' ? true : true,
  }));
}
