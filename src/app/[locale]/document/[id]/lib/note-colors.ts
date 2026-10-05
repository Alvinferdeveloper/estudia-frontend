// Stored as-is on each annotation, so the values must stay stable.
export const NOTE_COLORS = [
  { name: "Amarillo", value: "#FFEB3B" },
  { name: "Verde", value: "#A5D6A7" },
  { name: "Azul", value: "#90CAF9" },
  { name: "Rosa", value: "#F48FB1" },
  { name: "Naranja", value: "#FFCC80" },
  { name: "Morado", value: "#CE93D8" },
] as const;

export const DEFAULT_NOTE_COLOR = NOTE_COLORS[0].value;
