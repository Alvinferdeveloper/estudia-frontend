import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";
import { ROUTES } from "@/config/routes";

// Public pages only; signed-in areas are excluded through robots and noindex.
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return [
    { url: `${siteConfig.url}${ROUTES.home}`, lastModified, changeFrequency: "weekly", priority: 1 },
    { url: `${siteConfig.url}${ROUTES.register}`, lastModified, changeFrequency: "monthly", priority: 0.6 },
    { url: `${siteConfig.url}${ROUTES.login}`, lastModified, changeFrequency: "monthly", priority: 0.4 },
  ];
}
