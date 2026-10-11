// Hex because they are stored on each topic and folder and fed to <input type="color">; tuned in OKLCH for ivory and night surfaces.
export const COLLECTION_COLORS = [
  { id: "ink", value: "#3d6ba1" },
  { id: "teal", value: "#2b9191" },
  { id: "sage", value: "#579766" },
  { id: "ochre", value: "#ca9d33" },
  { id: "terracotta", value: "#c56a3e" },
  { id: "oxblood", value: "#ab4046" },
  { id: "plum", value: "#8c5087" },
  { id: "slate", value: "#6d7580" },
] as const;

export const DEFAULT_COLLECTION_COLOR: string = COLLECTION_COLORS[0].value;

export const isPresetCollectionColor = (color: string): boolean =>
  COLLECTION_COLORS.some(({ value }) => value === color.toLowerCase());
