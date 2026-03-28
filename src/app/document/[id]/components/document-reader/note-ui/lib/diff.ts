export interface DiffChunk {
  type: 'add' | 'remove' | 'unchanged';
  text: string;
  accepted: boolean | null;
}

function computeLineDiff(original: string, newText: string): DiffChunk[] {
  const originalLines = original.split('\n').filter(l => l.trim());
  const newLines = newText.split('\n').filter(l => l.trim());

  const result: DiffChunk[] = [];

  const originalSet = new Set(originalLines);
  const newSet = new Set(newLines);

  newLines.forEach(line => {
    if (originalSet.has(line)) {
      result.push({ type: 'unchanged', text: line, accepted: true });
    } else {
      result.push({ type: 'add', text: line, accepted: null });
    }
  });

  originalLines.forEach(line => {
    if (!newSet.has(line)) {
      result.push({ type: 'remove', text: line, accepted: null });
    }
  });

  return result;
}

function computeWordDiff(original: string, newText: string): DiffChunk[] {
  const originalWords = original.split(/(\s+)/).filter(w => w);
  const newWords = newText.split(/(\s+)/).filter(w => w);

  const result: DiffChunk[] = [];

  const originalSet = new Set(originalWords);
  const newSet = new Set(newWords);

  newWords.forEach(word => {
    if (originalSet.has(word)) {
      result.push({ type: 'unchanged', text: word, accepted: true });
    } else {
      result.push({ type: 'add', text: word, accepted: null });
    }
  });

  originalWords.forEach(word => {
    if (!newSet.has(word)) {
      result.push({ type: 'remove', text: word, accepted: null });
    }
  });

  return result;
}

export function computeDiff(original: string, newText: string, mode: 'words' | 'lines' = 'lines'): DiffChunk[] {
  if (!original && newText) {
    return [{ type: 'add', text: newText, accepted: null }];
  }
  if (!newText && original) {
    return [{ type: 'remove', text: original, accepted: null }];
  }
  if (original === newText) {
    return [{ type: 'unchanged', text: original, accepted: true }];
  }

  if (mode === 'words') {
    return computeWordDiff(original, newText);
  }

  return computeLineDiff(original, newText);
}

export function mergeAcceptedChunks(chunks: DiffChunk[]): string {
  const lines: string[] = [];

  chunks.forEach(chunk => {
    if (chunk.type === 'unchanged') {
      lines.push(chunk.text);
    } else if (chunk.type === 'add' && chunk.accepted === true) {
      lines.push(chunk.text);
    } else if (chunk.type === 'remove' && chunk.accepted === false) {
      lines.push(chunk.text);
    }
  });

  return lines.join('\n');
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
