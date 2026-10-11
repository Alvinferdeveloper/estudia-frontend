// Pages as compact ranges: [3, 4, 5, 9] → "3–5, 9".
export const formatPageRanges = (pages: number[]): string => {
  const sorted = [...new Set(pages)].sort((a, b) => a - b);
  const ranges: string[] = [];
  for (let i = 0; i < sorted.length; i++) {
    const start = sorted[i];
    while (sorted[i + 1] === sorted[i] + 1) i++;
    ranges.push(start === sorted[i] ? `${start}` : `${start}–${sorted[i]}`);
  }
  return ranges.join(", ");
};
