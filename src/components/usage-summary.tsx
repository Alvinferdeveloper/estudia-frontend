"use client";

import { Zap } from "lucide-react";
import { useFormatter, useNow, useTranslations } from "next-intl";
import type { SubscriptionPlan, UsageStats } from "@/app/[locale]/subscription/hooks/useSubscription";
import { UNLIMITED } from "@/app/[locale]/subscription/lib/entitlements";
import { type CreditState, getCreditState } from "@/app/[locale]/subscription/lib/usage";
import { cn } from "@/lib/utils";

const PLAN_BADGE_STYLES: Record<SubscriptionPlan, string> = {
  free: "bg-muted text-muted-foreground",
  basic: "bg-info text-info-foreground",
  pro: "bg-primary text-primary-foreground",
  enterprise: "bg-warning text-warning-foreground",
};

const BAR_STYLES: Record<CreditState, string> = {
  ok: "bg-primary",
  low: "bg-warning",
  empty: "bg-danger",
};

// Plan in force and remaining AI credits, as shown in the user menu.
export const UsageSummary = ({ usage }: { usage: UsageStats }) => {
  const t = useTranslations("common");
  const format = useFormatter();
  // An explicit, ticking "now" keeps "renews in…" consistent across renders and current while open.
  const now = useNow({ updateInterval: 60_000 });
  const { used, limit, resetsAt } = usage.credits;
  const isUnlimited = limit === UNLIMITED;
  const usedPercent = limit > 0 ? Math.min(100, (used / limit) * 100) : 100;

  return (
    <div className="px-2 py-1.5">
      <div className="mb-2 flex items-center justify-between">
        <span className="flex items-center gap-1 text-xs font-medium">
          <Zap className="h-3 w-3" />
          {t("userMenu.currentPlan")}
        </span>
        <span className={cn("rounded-full px-2 py-0.5 text-xs", PLAN_BADGE_STYLES[usage.plan])}>
          {t(`plans.${usage.plan}`)}
        </span>
      </div>
      <div className="space-y-1.5">
        <div className="flex justify-between text-xs">
          <span className="text-muted-foreground">{t("userMenu.aiCredits")}</span>
          <span className="tabular-nums">{isUnlimited ? t("userMenu.creditsUnlimited") : `${used}/${limit}`}</span>
        </div>
        {!isUnlimited && (
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-secondary">
            <div
              className={cn("h-full rounded-full", BAR_STYLES[getCreditState(usage.credits)])}
              style={{ width: `${usedPercent}%` }}
            />
          </div>
        )}
        <p className="text-[11px] text-muted-foreground">
          {t("userMenu.creditsRenew", { when: format.relativeTime(new Date(resetsAt), now) })}
        </p>
      </div>
    </div>
  );
};
