import { env } from "@/config/env";

// Language-independent identity. Anything users read (tagline, descriptions) lives in the "metadata" messages.
export const siteConfig = {
  name: "Zocratis",
  url: env.appUrl,
  // Hex mirrors of the globals.css tokens, for places CSS variables can't reach (manifest, share image, theme-color).
  colors: {
    ink: "#2A3E57",
    ivory: "#FCFAF6",
    backgroundLight: "#F9FAFB",
    backgroundDark: "#090A0D",
  },
} as const;
