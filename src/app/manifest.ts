import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";
import { ROUTES } from "@/config/routes";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${siteConfig.name} · ${siteConfig.tagline}`,
    short_name: siteConfig.name,
    description: siteConfig.description,
    lang: siteConfig.locale,
    start_url: ROUTES.workspace,
    display: "standalone",
    background_color: siteConfig.colors.backgroundLight,
    theme_color: siteConfig.colors.ink,
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
      { src: "/icons/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
