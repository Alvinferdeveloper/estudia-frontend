import type { MetadataRoute } from "next";
import { getTranslations } from "next-intl/server";
import { siteConfig } from "@/config/site";
import { ROUTES } from "@/config/routes";
import { routing } from "@/i18n/routing";

// A manifest has a single language, so it uses the default one.
export default async function manifest(): Promise<MetadataRoute.Manifest> {
  const locale = routing.defaultLocale;
  const t = await getTranslations({ locale, namespace: "metadata" });

  return {
    name: `${siteConfig.name} · ${t("tagline")}`,
    short_name: siteConfig.name,
    description: t("description", { brand: siteConfig.name }),
    lang: locale,
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
