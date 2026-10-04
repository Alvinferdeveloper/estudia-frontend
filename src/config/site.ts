const name = "Zocratis";

// Everything that identifies the product: change it here and every screen, title and share card follows.
export const siteConfig = {
  name,
  tagline: "Tu compañero de estudio con inteligencia artificial",
  description: `Potencia tu aprendizaje con ${name}. Sube documentos, genera notas automáticas con IA y organiza tu estudio de forma inteligente.`,
  shareDescription: "Transforma tus documentos en conocimiento. Notas, resúmenes y organización con IA.",
  url: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  locale: "es",
  openGraphLocale: "es_ES",
  keywords: ["IA", "estudio", "estudiantes", "notas automáticas", "resumen de documentos", name],
  // Hex mirrors of the globals.css tokens, for places CSS variables can't reach (manifest, share image, theme-color).
  colors: {
    ink: "#2A3E57",
    ivory: "#FCFAF6",
    backgroundLight: "#F9FAFB",
    backgroundDark: "#090A0D",
  },
} as const;
