"use client";

import { Zap } from "lucide-react";
import { useTranslations } from "next-intl";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { UsageSummary } from "@/components/usage-summary";
import { UpgradePlanLink } from "@/components/upgrade-plan-link";
import { useUsage } from "@/app/[locale]/subscription/hooks/useSubscription";
import { type CreditState, getCreditState, remainingCredits } from "@/app/[locale]/subscription/lib/usage";
import { cn } from "@/lib/utils";

const STATE_STYLES: Record<CreditState, string> = {
  ok: "text-muted-foreground hover:bg-accent hover:text-foreground",
  low: "bg-warning text-warning-foreground",
  empty: "bg-danger text-danger-foreground",
};

// Credits left, where AI features are used; turns amber when running low and red when spent.
export const CreditIndicator = () => {
  const t = useTranslations("common.credits");
  const { data: usage, refetch } = useUsage();
  if (!usage) return null;

  const remaining = remainingCredits(usage.credits);
  const label = remaining === null ? t("unlimited") : t("remaining", { count: remaining });

  return (
    <Popover onOpenChange={(open) => open && refetch()}>
      <PopoverTrigger asChild>
        <button
          aria-label={label}
          title={label}
          className={cn(
            "press-feedback flex h-8 items-center gap-1 rounded-full px-2.5 text-xs font-medium tabular-nums transition-colors duration-150",
            STATE_STYLES[getCreditState(usage.credits)]
          )}
        >
          <Zap className="h-3.5 w-3.5" />
          {remaining ?? "∞"}
        </button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-64 p-1.5">
        <UsageSummary usage={usage} />
        <div className="border-t border-border px-2 pb-1 pt-2 text-xs">
          <UpgradePlanLink />
        </div>
      </PopoverContent>
    </Popover>
  );
};
