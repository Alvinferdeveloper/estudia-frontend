// Stored as-is on each annotation, so the values must stay stable.
export const NOTE_COLORS = [
  { id: "yellow", value: "#FFEB3B" },
  { id: "green", value: "#A5D6A7" },
  { id: "blue", value: "#90CAF9" },
  { id: "pink", value: "#F48FB1" },
  { id: "orange", value: "#FFCC80" },
  { id: "purple", value: "#CE93D8" },
] as const;

export const DEFAULT_NOTE_COLOR = NOTE_COLORS[0].value;
export const DEFAULT_VOCABULARY_COLOR: string = NOTE_COLORS[2].value;
