"use client";

export const dynamic = 'force-dynamic';

import { useState } from "react";
import { usePlans, useUpdatePlan, SubscriptionPlan } from "./hooks/useSubscription";
import { PricingCard } from "./components/PricingCard";
import { X, Loader2 } from "lucide-react";
import Link from "next/link";

export default function SubscriptionPage() {
  const { data, isLoading, error } = usePlans();
  const updatePlan = useUpdatePlan();

  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null);

  const handleSelectPlan = async (plan: SubscriptionPlan) => {
    if (plan === data?.currentPlan) return;
    if (plan === "free") return;

    const confirmed = window.confirm(
      `This is a demo. In production, you would be redirected to payment. Do you want to simulate upgrading to ${plan} plan?`
    );

    if (confirmed) {
      setSelectedPlan(plan);
      updatePlan.mutate(plan);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-destructive mb-4">Failed to load subscription plans</p>
          <Link href="/workspace" className="text-primary hover:underline">
            Back to workspace
          </Link>
        </div>
      </div>
    );
  }

  const { plans, currentPlan } = data || { plans: [], currentPlan: 'free' as SubscriptionPlan };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30 relative">
      <header className="absolute top-0 w-full z-10">
        <div className="container mx-auto px-4 h-16 flex items-center justify-end">
          <Link
            href="/workspace"
            className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-full transition-all duration-200"
            aria-label="Close pricing"
          >
            <X className="w-6 h-6" />
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 pt-12 pb-12 flex flex-col items-center justify-center min-h-screen">
        <div className="relative text-center mb-20 animate-in fade-in slide-in-from-bottom-6 duration-700">
          {/* Background glow (Glow effect) to give it depth */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-primary/20 blur-[100px] rounded-full pointer-events-none"></div>

          {/* Top label (Badge) with blinking dot */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6 ring-1 ring-primary/20 hover:ring-primary/40 transition-all cursor-default">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            Pricing Plans
          </div>

          {/* Main title with gradient text */}
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 tracking-tight">
            Choose Your <span className="bg-gradient-to-r from-primary via-green-400 to-green-600 bg-clip-text text-transparent">Perfect Plan</span>
          </h1>

          {/* Subtitle improved with emphasis on keywords */}
          <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            Unlock the full potential of <strong className="text-foreground font-semibold">studiIA</strong> with our subscription plans.
            Upgrade anytime to get more <span className="text-primary font-medium">AI-powered features</span>.
          </p>
        </div>

        <div className="grid md:grid-cols-2 px-4 lg:grid-cols-4 max-w-8xl gap-6 mx-auto w-full">
          {plans.map((plan, index) => (
            <div
              key={plan.plan}
              className="animate-in fade-in slide-in-from-bottom-8 duration-500 fill-mode-both"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <PricingCard
                plan={plan.plan}
                name={plan.name}
                price={plan.price === 0 ? "Free" : `$${plan.price}`}
                description={plan.description}
                features={plan.features}
                isPopular={plan.isPopular}
                currentPlan={currentPlan === plan.plan}
                onSelect={handleSelectPlan}
                isLoading={selectedPlan === plan.plan && updatePlan.isPending}
              />
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}