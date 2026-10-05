"use client";

import { Check, Languages } from "lucide-react";
import { useTranslations } from "next-intl";
import {
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from "@/components/ui/dropdown-menu";
import { LOCALE_LABELS } from "@/i18n/routing";
import { useLocaleSwitch } from "@/i18n/useLocaleSwitch";

// Language picker as a nested entry inside an existing dropdown menu (e.g. the user menu).
export const LocaleSubmenu: React.FC = () => {
  const t = useTranslations("common.localeSwitcher");
  const { locale, locales, switchLocale } = useLocaleSwitch();

  return (
    <DropdownMenuSub>
      <DropdownMenuSubTrigger>
        <Languages className="mr-2 h-4 w-4" />
        <span>{t("label")}</span>
      </DropdownMenuSubTrigger>
      <DropdownMenuPortal>
        <DropdownMenuSubContent>
          {locales.map((option) => (
            <DropdownMenuItem key={option} onSelect={() => switchLocale(option)}>
              {LOCALE_LABELS[option]}
              {option === locale && <Check className="ml-auto size-4" />}
            </DropdownMenuItem>
          ))}
        </DropdownMenuSubContent>
      </DropdownMenuPortal>
    </DropdownMenuSub>
  );
};
