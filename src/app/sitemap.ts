import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";
import { ROUTES } from "@/config/routes";
import { routing } from "@/i18n/routing";
import { localizedUrls } from "@/i18n/paths";

const PUBLIC_PAGES = [
  { path: ROUTES.home, changeFrequency: "weekly", priority: 1 },
  { path: ROUTES.register, changeFrequency: "monthly", priority: 0.6 },
  { path: ROUTES.login, changeFrequency: "monthly", priority: 0.4 },
] as const;

// Public pages only, one entry per language, each listing its translations (hreflang).
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return PUBLIC_PAGES.flatMap(({ path, changeFrequency, priority }) => {
    const urls = localizedUrls(siteConfig.url, path);
    return routing.locales.map((locale) => ({
      url: urls[locale],
      lastModified,
      changeFrequency,
      priority,
      alternates: { languages: urls },
    }));
  });
}
