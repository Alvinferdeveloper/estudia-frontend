import type { Metadata } from "next";
import { siteConfig } from "./site";

// For pages that only make sense signed in: keeps them out of search results.
export const privatePageMetadata = (title: string): Metadata => ({
  title,
  robots: { index: false, follow: false },
});

// Organization + WebSite + WebApplication graph, so search engines know what the product is and who makes it.
export const siteStructuredData = () => {
  const organizationId = `${siteConfig.url}/#organization`;

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": organizationId,
        name: siteConfig.name,
        url: siteConfig.url,
        logo: `${siteConfig.url}/icons/icon-512.png`,
      },
      {
        "@type": "WebSite",
        name: siteConfig.name,
        url: siteConfig.url,
        inLanguage: siteConfig.locale,
        publisher: { "@id": organizationId },
      },
      {
        "@type": "WebApplication",
        name: siteConfig.name,
        url: siteConfig.url,
        description: siteConfig.description,
        applicationCategory: "EducationalApplication",
        operatingSystem: "Web",
        inLanguage: siteConfig.locale,
        publisher: { "@id": organizationId },
      },
    ],
  };
};
