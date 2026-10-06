"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { ROUTES } from "@/config/routes";
import { cn } from "@/lib/utils";

// The way out of any plan limit, wherever one is reached.
export const UpgradePlanLink = ({ className }: { className?: string }) => {
  const t = useTranslations("common.actions");

  return (
    <Link
      href={ROUTES.subscription}
      className={cn("font-medium text-primary underline-offset-4 hover:underline", className)}
    >
      {t("upgradePlan")}
    </Link>
  );
};
