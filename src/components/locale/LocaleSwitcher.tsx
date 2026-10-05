"use client";

import { Check, Languages } from "lucide-react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LOCALE_LABELS } from "@/i18n/routing";
import { useLocaleSwitch } from "@/i18n/useLocaleSwitch";

// Standalone language picker for public screens (auth, landing).
export const LocaleSwitcher: React.FC<{ className?: string }> = ({ className }) => {
  const t = useTranslations("common.localeSwitcher");
  const { locale, locales, switchLocale, isPending } = useLocaleSwitch();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label={t("label")}
        disabled={isPending}
        className={cn(
          "inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-sm text-muted-foreground transition-colors duration-150 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-60",
          className
        )}
      >
        <Languages className="size-4" />
        {LOCALE_LABELS[locale]}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-36">
        {locales.map((option) => (
          <DropdownMenuItem key={option} onSelect={() => switchLocale(option)}>
            {LOCALE_LABELS[option]}
            {option === locale && <Check className="ml-auto size-4" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
