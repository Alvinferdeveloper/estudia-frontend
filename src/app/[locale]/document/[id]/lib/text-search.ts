// Accent-, case- and spacing-insensitive text search, keeping a map back to the original characters
// so a match can be cut into a snippet or highlighted on the page.

export interface NormalizedText {
  text: string;
  // Original index of each character of `text`.
  sourceIndex: number[];
}

// NFKD also unfolds the ligatures PDFs are full of ("ﬁ" → "fi").
const normalizeChar = (char: string): string => char.normalize("NFKD").replace(/\p{Diacritic}/gu, "").toLowerCase();

export const normalizeWithMap = (source: string): NormalizedText => {
  let text = "";
  const sourceIndex: number[] = [];
  for (let index = 0; index < source.length; index++) {
    const char = source[index];
    if (/\s/.test(char)) {
      // Runs of whitespace (line breaks included) collapse to one space.
      if (text.length > 0 && !text.endsWith(" ")) {
        text += " ";
        sourceIndex.push(index);
      }
      continue;
    }
    for (const piece of normalizeChar(char)) {
      text += piece;
      sourceIndex.push(index);
    }
  }
  return { text, sourceIndex };
};

export const normalizeQuery = (query: string): string => normalizeWithMap(query.trim()).text;

export interface TextMatch {
  // Range in the original text.
  start: number;
  end: number;
}

export const findMatches = (normalized: NormalizedText, query: string): TextMatch[] => {
  if (!query) return [];
  const matches: TextMatch[] = [];
  let from = normalized.text.indexOf(query);
  while (from !== -1) {
    const last = from + query.length - 1;
    matches.push({ start: normalized.sourceIndex[from], end: normalized.sourceIndex[last] + 1 });
    from = normalized.text.indexOf(query, from + query.length);
  }
  return matches;
};

export interface Snippet {
  before: string;
  match: string;
  after: string;
}

const SNIPPET_CONTEXT = 48;

// The match with some words around it, cut at word boundaries.
export const buildSnippet = (source: string, { start, end }: TextMatch): Snippet => {
  const clean = (text: string) => text.replace(/\s+/g, " ");
  let from = Math.max(0, start - SNIPPET_CONTEXT);
  let to = Math.min(source.length, end + SNIPPET_CONTEXT);
  const spaceAfterFrom = source.indexOf(" ", from);
  if (from > 0 && spaceAfterFrom !== -1 && spaceAfterFrom < start) from = spaceAfterFrom + 1;
  const spaceBeforeTo = source.lastIndexOf(" ", to);
  if (to < source.length && spaceBeforeTo > end) to = spaceBeforeTo;
  return {
    before: `${from > 0 ? "…" : ""}${clean(source.slice(from, start)).trimStart()}`,
    match: clean(source.slice(start, end)),
    after: `${clean(source.slice(end, to)).trimEnd()}${to < source.length ? "…" : ""}`,
  };
};
