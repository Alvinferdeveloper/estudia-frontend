import { defineRouting } from "next-intl/routing";

// Single source of supported languages: adding one is a new entry here plus its messages folder.
export const routing = defineRouting({
  locales: ["es", "en"],
  defaultLocale: "es",
  // The default language keeps unprefixed URLs (/login); others get a prefix (/en/login).
  localePrefix: "as-needed",
});

export type Locale = (typeof routing.locales)[number];

export type LocaleParams = { params: Promise<{ locale: string }> };

// Shown in the language switcher, each in its own language.
export const LOCALE_LABELS: Record<Locale, string> = {
  es: "Español",
  en: "English",
};

export const OPEN_GRAPH_LOCALES: Record<Locale, string> = {
  es: "es_ES",
  en: "en_US",
};
