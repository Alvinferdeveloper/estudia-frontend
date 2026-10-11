"use client";

import { Zap } from "lucide-react";
import { useTranslations } from "next-intl";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { UsageSummary } from "@/components/usage-summary";
import { UpgradePlanLink } from "@/components/upgrade-plan-link";
import { useUsage } from "@/app/[locale]/subscription/hooks/useSubscription";
import { type CreditState, getCreditState, remainingCredits } from "@/app/[locale]/subscription/lib/usage";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const STATE_STYLES: Record<CreditState, string> = {
  ok: "",
  low: "bg-warning text-warning-foreground hover:bg-warning/90 hover:text-warning-foreground",
  empty: "bg-danger text-danger-foreground hover:bg-danger/90 hover:text-danger-foreground",
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
        <Button
          variant="ghost"
          size="sm"
          aria-label={label}
          title={label}
          className={cn("gap-1 px-2.5 text-xs tabular-nums", STATE_STYLES[getCreditState(usage.credits)])}
        >
          <Zap className="size-3.5" />
          {remaining ?? "∞"}
        </Button>
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
