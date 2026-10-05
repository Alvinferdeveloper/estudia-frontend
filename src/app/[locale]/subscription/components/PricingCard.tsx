"use client";

import { Button } from "@/components/ui/button";
import { Check, Sparkles } from "lucide-react";
import { SubscriptionPlan } from "../hooks/useSubscription";
import { cn } from "@/lib/utils";

interface PricingCardProps {
  plan: SubscriptionPlan;
  name: string;
  price: string;
  description: string;
  features: string[];
  isPopular?: boolean;
  currentPlan: boolean;
  onSelect: (plan: SubscriptionPlan) => void;
  isLoading?: boolean;
}

export function PricingCard({
  plan,
  name,
  price,
  description,
  features,
  isPopular,
  currentPlan,
  onSelect,
  isLoading,
}: PricingCardProps) {
  return (
    <div
      className={cn(
        "relative flex flex-col p-6 bg-card border rounded-2xl transition-all duration-300 hover:shadow-xl hover:-translate-y-1 h-full",
        isPopular ? "border-primary shadow-lg shadow-primary/10" : "border-border"
      )}
    >
      {isPopular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <span className="bg-primary text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1 shadow-sm">
            <Sparkles className="w-3.5 h-3.5" />
            Most Popular
          </span>
        </div>
      )}

      <div className="mb-4 mt-2">
        <h3 className="text-xl font-bold">{name}</h3>
        <p className="text-sm text-muted-foreground mt-2 min-h-[40px]">{description}</p>
      </div>

      <div className="mb-6 flex items-baseline gap-1">
        <span className="text-4xl font-extrabold tracking-tight">{price}</span>
        {price !== "Free" && <span className="text-muted-foreground font-medium">/month</span>}
      </div>

      <ul className="flex-1 space-y-3 mb-8">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start gap-3 text-sm">
            <div className="mt-0.5 rounded-full bg-primary/10 p-1">
              <Check className="w-3 h-3 text-primary shrink-0" />
            </div>
            <span className="text-foreground/80 leading-tight">{feature}</span>
          </li>
        ))}
      </ul>

      <Button
        onClick={() => onSelect(plan)}
        disabled={currentPlan || isLoading}
        className={cn("w-full py-6 font-semibold rounded-xl bg-primary/80 text-white cursor-pointer",
          currentPlan && "bg-secondary text-secondary-foreground hover:bg-secondary border-none"
        )}
      >
        {currentPlan ? "Current Plan" : isLoading ? "Processing..." : plan === "free" ? "Get Started" : "Subscribe"}
      </Button>
    </div>
  );
}