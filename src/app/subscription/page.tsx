"use client";

export const dynamic = 'force-dynamic';

import { useState } from "react";
import { usePlans, SubscriptionPlan } from "./hooks/useSubscription";
import { PricingCard } from "@/app/subscription/components/PricingCard";
import { PayPalButton } from "@/app/subscription/components/PayPalButton";
import { X, Loader2, ArrowLeft, CheckCircle2, Lock, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import { Button } from "@/components/ui/button";

export default function SubscriptionPage() {
  const { data, isLoading, error } = usePlans();

  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSelectPlan = (plan: SubscriptionPlan) => {
    if (plan === data?.currentPlan) return;
    setSelectedPlan(plan);
  };

  const handlePaymentSuccess = () => {
    setIsSuccess(true);
    setSelectedPlan(null);
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

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center space-y-6 animate-in fade-in zoom-in duration-500">
          <div className="mx-auto w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center">
            <CheckCircle2 className="w-10 h-10 text-primary" />
          </div>
          <h2 className="text-3xl font-bold">Subscription Updated!</h2>
          <p className="text-muted-foreground text-lg">
            Your payment was successful and your plan has been updated. You now have access to all the features of your new plan.
          </p>
          <Button asChild className="w-full py-6 text-lg font-semibold rounded-xl">
            <Link href="/workspace">Go to Workspace</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <PayPalScriptProvider options={{
      clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "sb",
      currency: "USD",
      intent: "capture",
      vault: true
    }}>
      <div className="min-h-screen from-background relative">
        <header className="absolute top-0 w-full z-10">
          <div className="container mx-auto px-4 h-16 flex items-center justify-between">
            {selectedPlan && (
              <button
                onClick={() => setSelectedPlan(null)}
                className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to plans
              </button>
            )}
            <div className="flex-1" />
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
          {!selectedPlan ? (
            <>
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
                    />
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="max-w-md w-full mx-auto relative animate-in fade-in slide-in-from-bottom-8 duration-700">
              <div className="relative bg-card border border-border/50 rounded-lg shadow-2xl overflow-hidden backdrop-blur-sm">
                {/* decorative headboard */}
                <div className="bg-muted/30 p-8 border-b border-border/50 text-center">
                  <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                    <Lock className="w-6 h-6 text-primary" />
                  </div>
                  <h2 className="text-2xl font-extrabold tracking-tight mb-2">Complete Payment</h2>
                  <p className="text-muted-foreground text-sm">
                    You are subscribing to the plan{" "}
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary mt-1">
                      {plans.find(p => p.plan === selectedPlan)?.name}
                    </span>
                  </p>
                </div>

                <div className="p-8 space-y-8">
                  {/* Summary of the "Ticket" type order */}
                  <div className="bg-gradient-to-br from-background to-muted/50 rounded-2xl p-6 border border-border/50 shadow-sm relative overflow-hidden">
                    {/* visual adornment */}
                    <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-bl-full"></div>

                    <div className="flex justify-between items-end relative z-10">
                      <div>
                        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1 block">Total to pay</span>
                        <div className="flex items-baseline gap-1">
                          <span className="text-4xl font-black">${plans.find(p => p.plan === selectedPlan)?.price}</span>
                          <span className="text-muted-foreground font-medium">/ month</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-bold bg-muted px-2 py-1 rounded text-foreground uppercase tracking-widest">
                          USD
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-5">
                    <div className="flex items-center justify-center gap-2 text-xs font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 py-2 rounded-lg">
                      <ShieldCheck className="w-4 h-4" />
                      <span>100% secure and encrypted payment</span>
                    </div>

                    {/* PayPal Component */}
                    <div className="bg-white p-1 rounded-xl">
                      <PayPalButton
                        plan={selectedPlan}
                        onSuccess={handlePaymentSuccess}
                        onCancel={() => setSelectedPlan(null)}
                      />
                    </div>

                    <button
                      onClick={() => setSelectedPlan(null)}
                      className="w-full cursor-pointer flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mt-4"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      Cancel and return
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </PayPalScriptProvider>
  );
}