"use client";

import { useTransition } from "react";
import { useLocale } from "next-intl";
import { usePathname, useRouter } from "./navigation";
import { Locale, routing } from "./routing";

// Switches language in place: same page, other locale prefix (next-intl remembers the choice in a cookie).
export const useLocaleSwitch = () => {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const switchLocale = (nextLocale: Locale) => {
    if (nextLocale === locale) return;
    startTransition(() => router.replace(pathname, { locale: nextLocale }));
  };

  return { locale, locales: routing.locales, switchLocale, isPending };
};
