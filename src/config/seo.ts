import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import type referenceMessages from "@/messages/es";
import { Locale, routing } from "@/i18n/routing";
import { localizePath, localizedUrls } from "@/i18n/paths";
import { siteConfig } from "./site";

export type PageTitleKey = keyof typeof referenceMessages.metadata.pages;

const pageTitle = async (locale: Locale, page: PageTitleKey) => {
  const t = await getTranslations({ locale, namespace: "metadata.pages" });
  return t(page);
};

// Indexable page: canonical to itself plus hreflang links to every language version.
export const publicPageMetadata = async (locale: Locale, path: string, page?: PageTitleKey): Promise<Metadata> => ({
  ...(page && { title: await pageTitle(locale, page) }),
  alternates: {
    canonical: localizePath(path, locale),
    languages: { ...localizedUrls("", path), "x-default": localizePath(path, routing.defaultLocale) },
  },
});

// For pages that only make sense signed in: keeps them out of search results.
export const privatePageMetadata = async (locale: Locale, page: PageTitleKey): Promise<Metadata> => ({
  title: await pageTitle(locale, page),
  robots: { index: false, follow: false },
});

// Organization + WebSite + WebApplication graph, so search engines know what the product is and who makes it.
export const siteStructuredData = async (locale: Locale) => {
  const t = await getTranslations({ locale, namespace: "metadata" });
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
        inLanguage: routing.locales,
        publisher: { "@id": organizationId },
      },
      {
        "@type": "WebApplication",
        name: siteConfig.name,
        url: `${siteConfig.url}${localizePath("/", locale)}`,
        description: t("description", { brand: siteConfig.name }),
        applicationCategory: "EducationalApplication",
        operatingSystem: "Web",
        inLanguage: locale,
        publisher: { "@id": organizationId },
      },
    ],
  };
};
