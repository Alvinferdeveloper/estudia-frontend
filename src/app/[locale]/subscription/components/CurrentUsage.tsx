"use client";

import { useTranslations } from "next-intl";
import { useUsage } from "../hooks/useSubscription";
import { UNLIMITED } from "../lib/entitlements";

// What the user has used of their plan, so they can judge whether they need more before choosing.
export const CurrentUsage = () => {
  const t = useTranslations("subscription.usage");
  const tPlans = useTranslations("common.plans");
  const { data: usage } = useUsage();
  if (!usage) return null;

  const { credits, quotas } = usage;
  const items = [
    t("plan", { plan: tPlans(usage.plan) }),
    credits.limit === UNLIMITED
      ? t("creditsUnlimited")
      : t("credits", { used: credits.used, limit: credits.limit, period: credits.period }),
    quotas.documents.limit === UNLIMITED
      ? t("documentsUnlimited", { used: quotas.documents.used })
      : t("documents", { used: quotas.documents.used, limit: quotas.documents.limit }),
  ];

  return (
    <ul className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-sm tabular-nums text-muted-foreground">
      {items.map((item, index) => (
        <li key={item} className="flex items-center gap-2">
          {index > 0 && <span aria-hidden>·</span>}
          {item}
        </li>
      ))}
    </ul>
  );
};
