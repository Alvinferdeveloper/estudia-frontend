// Pure helpers, safe in middleware, route handlers and metadata (no React or navigation hooks).
import { Locale, routing } from "./routing";

export const isLocale = (value: string): value is Locale => (routing.locales as readonly string[]).includes(value);

// Route params arrive as plain strings; this narrows them (the [locale] layout already 404s unknown ones).
export const resolveLocale = (value: string): Locale => (isLocale(value) ? value : routing.defaultLocale);

export const localizePath = (path: string, locale: Locale): string => {
  if (locale === routing.defaultLocale) return path;
  return path === "/" ? `/${locale}` : `/${locale}${path}`;
};

export const splitLocalePath = (pathname: string): { locale: Locale; path: string } => {
  const [, firstSegment = "", ...rest] = pathname.split("/");
  if (!isLocale(firstSegment)) return { locale: routing.defaultLocale, path: pathname };
  return { locale: firstSegment, path: `/${rest.join("/")}` };
};

export const localizedUrls = (baseUrl: string, path: string): Record<Locale, string> =>
  Object.fromEntries(routing.locales.map((locale) => [locale, `${baseUrl}${localizePath(path, locale)}`])) as Record<
    Locale,
    string
  >;
