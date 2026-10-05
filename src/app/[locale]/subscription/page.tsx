"use client";

export const dynamic = 'force-dynamic';

import { useState } from "react";
import { useFormatter, useTranslations } from "next-intl";
import { usePlans, SubscriptionPlan } from "./hooks/useSubscription";
import { PricingCard } from "@/app/[locale]/subscription/components/PricingCard";
import { PayPalButton } from "@/app/[locale]/subscription/components/PayPalButton";
import { getPlanFeatureItems } from "@/app/[locale]/subscription/lib/plan-features";
import { X, Loader2, ArrowLeft, CheckCircle2, Lock, ShieldCheck } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";
import { ROUTES } from "@/config/routes";
import { type ApiErrorKey, getApiErrorKey } from "@/lib/api-errors";
import { ApiErrorMessage } from "@/components/api-error-message";

const CURRENCY = "USD";

export default function SubscriptionPage() {
  const t = useTranslations("subscription");
  const tPlans = useTranslations("common.plans");
  const tPlanDescriptions = useTranslations("subscription.planDescriptions");
  const format = useFormatter();
  const { data, isLoading, error } = usePlans();

  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [paymentErrorKey, setPaymentErrorKey] = useState<ApiErrorKey | null>(null);

  const handleSelectPlan = (plan: SubscriptionPlan) => {
    if (plan === data?.currentPlan) return;
    setPaymentErrorKey(null);
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
          <p className="text-destructive mb-4">{t("loadError")}</p>
          <Link href={ROUTES.workspace} className="text-primary hover:underline">
            {t("backToWorkspace")}
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
          <h2 className="text-3xl font-bold">{t("success.title")}</h2>
          <p className="text-muted-foreground text-lg">
            {t("success.description")}
          </p>
          <Button asChild className="w-full py-6 text-lg font-semibold rounded-xl">
            <Link href={ROUTES.workspace}>{t("success.goToWorkspace")}</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <PayPalScriptProvider options={{
      clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "sb",
      currency: CURRENCY,
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
                {t("backToPlans")}
              </button>
            )}
            <div className="flex-1" />
            <Link
              href={ROUTES.workspace}
              className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-full transition-all duration-200"
              aria-label={t("closePricing")}
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
                  {t("hero.badge")}
                </div>

                {/* Main title with gradient text */}
                <h1 className="text-4xl md:text-6xl font-extrabold mb-6 tracking-tight">
                  {t.rich("hero.title", {
                    highlight: (chunks) => (
                      <span className="bg-gradient-to-r from-primary via-green-400 to-green-600 bg-clip-text text-transparent">{chunks}</span>
                    ),
                  })}
                </h1>

                {/* Subtitle improved with emphasis on keywords */}
                <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
                  {t.rich("hero.subtitle", {
                    brand: siteConfig.name,
                    strong: (chunks) => <strong className="text-foreground font-semibold">{chunks}</strong>,
                    highlight: (chunks) => <span className="text-primary font-medium">{chunks}</span>,
                  })}
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
                      name={tPlans(plan.plan)}
                      price={plan.price}
                      currency={CURRENCY}
                      description={tPlanDescriptions(plan.plan)}
                      features={getPlanFeatureItems(plan)}
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
                  <h2 className="text-2xl font-extrabold tracking-tight mb-2">{t("checkout.title")}</h2>
                  <p className="text-muted-foreground text-sm">
                    {t.rich("checkout.subscribingTo", {
                      plan: tPlans(selectedPlan),
                      badge: (chunks) => (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary mt-1">
                          {chunks}
                        </span>
                      ),
                    })}
                  </p>
                </div>

                <div className="p-8 space-y-8">
                  {/* Summary of the "Ticket" type order */}
                  <div className="bg-gradient-to-br from-background to-muted/50 rounded-2xl p-6 border border-border/50 shadow-sm relative overflow-hidden">
                    {/* visual adornment */}
                    <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-bl-full"></div>

                    <div className="flex justify-between items-end relative z-10">
                      <div>
                        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1 block">{t("checkout.totalToPay")}</span>
                        <div className="flex items-baseline gap-1">
                          <span className="text-4xl font-black">
                            {format.number(plans.find(p => p.plan === selectedPlan)?.price ?? 0, { style: "currency", currency: CURRENCY })}
                          </span>
                          <span className="text-muted-foreground font-medium">{t("checkout.perMonth")}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-bold bg-muted px-2 py-1 rounded text-foreground uppercase tracking-widest">
                          {CURRENCY}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-5">
                    <div className="flex items-center justify-center gap-2 text-xs font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 py-2 rounded-lg">
                      <ShieldCheck className="w-4 h-4" />
                      <span>{t("checkout.securePayment")}</span>
                    </div>

                    {/* PayPal Component */}
                    <div className="bg-white p-1 rounded-xl">
                      <PayPalButton
                        plan={selectedPlan}
                        onSuccess={handlePaymentSuccess}
                        onCancel={() => setSelectedPlan(null)}
                        onError={(paymentError) => setPaymentErrorKey(getApiErrorKey(paymentError))}
                      />
                    </div>

                    <ApiErrorMessage errorKey={paymentErrorKey} className="text-center" />

                    <button
                      onClick={() => setSelectedPlan(null)}
                      className="w-full cursor-pointer flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mt-4"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      {t("checkout.cancelAndReturn")}
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