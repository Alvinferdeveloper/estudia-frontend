import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";

// Private routes are not disallowed on purpose: crawlers must reach them to see their noindex (and the login redirect).
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/" }],
    sitemap: `${siteConfig.url}/sitemap.xml`,
    host: siteConfig.url,
  };
}
