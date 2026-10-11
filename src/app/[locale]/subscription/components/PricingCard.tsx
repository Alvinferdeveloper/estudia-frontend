"use client";

import { Check, Minus } from "lucide-react";
import { useFormatter, useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { SubscriptionPlan } from "../hooks/useSubscription";
import { PlanFeatureItem } from "../lib/plan-features";
import { formatBytes } from "@/lib/format";
import { cn } from "@/lib/utils";

interface PricingCardProps {
  plan: SubscriptionPlan;
  name: string;
  price: number;
  currency: string;
  description: string;
  features: PlanFeatureItem[];
  isPopular?: boolean;
  currentPlan: boolean;
  onSelect: (plan: SubscriptionPlan) => void;
}

// Name, price and action, then one row per feature.
const HEADER_ROWS = 3;

// Spans its rows of the parent grid through subgrid, so each feature lines up with the same row in the other plans.
export function PricingCard({
  plan,
  name,
  price,
  currency,
  description,
  features,
  isPopular,
  currentPlan,
  onSelect,
}: PricingCardProps) {
  const t = useTranslations("subscription.card");
  const tFeatures = useTranslations("subscription.features");
  const format = useFormatter();
  const isFree = price === 0;

  const featureLabel = ({ key, count, storageBytes }: PlanFeatureItem): string => {
    if (storageBytes !== undefined) return tFeatures(key, { size: formatBytes(format, storageBytes) });
    return count === undefined ? tFeatures(key) : tFeatures(key, { count });
  };

  return (
    <section
      aria-label={name}
      style={{ gridRow: `span ${HEADER_ROWS + features.length}` }}
      className={cn(
        "mb-4 grid grid-rows-subgrid rounded-2xl border bg-card p-6 lg:mb-0",
        isPopular ? "border-primary" : "border-border"
      )}
    >
      <div>
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-base font-semibold">{name}</h2>
          {isPopular && <span className="text-xs font-medium text-primary">{t("mostPopular")}</span>}
        </div>
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      </div>

      <p className="mt-5 flex items-baseline gap-1">
        <span className="font-mono text-3xl font-semibold tabular-nums tracking-tight">
          {isFree ? t("free") : format.number(price, { style: "currency", currency })}
        </span>
        {!isFree && <span className="text-sm text-muted-foreground">{t("perMonth")}</span>}
      </p>

      <Button
        variant={currentPlan ? "secondary" : isPopular ? "default" : "outline"}
        onClick={() => onSelect(plan)}
        disabled={currentPlan}
        className="mb-5 mt-5 w-full"
      >
        {currentPlan ? t("currentPlan") : plan === "free" ? t("getStarted") : t("subscribe")}
      </Button>

      <ul role="list" className="contents">
        {features.map((feature) => (
          <li
            key={feature.key}
            className={cn(
              "flex items-start gap-2.5 py-1.5 text-sm first:border-t first:border-border first:pt-5",
              feature.included ? "text-foreground/85" : "text-muted-foreground/70"
            )}
          >
            {feature.included ? (
              <Check aria-hidden className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
            ) : (
              <Minus aria-hidden className="mt-0.5 size-4 shrink-0" />
            )}
            <span className="leading-snug">
              {!feature.included && <span className="sr-only">{t("notIncluded")} </span>}
              {featureLabel(feature)}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
