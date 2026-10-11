"use client";

export const dynamic = 'force-dynamic';

import { useState } from "react";
import { useFormatter, useTranslations } from "next-intl";
import { usePlans, SubscriptionPlan } from "./hooks/useSubscription";
import { PricingCard } from "@/app/[locale]/subscription/components/PricingCard";
import { PayPalButton } from "@/app/[locale]/subscription/components/PayPalButton";
import { CurrentUsage } from "@/app/[locale]/subscription/components/CurrentUsage";
import { getPlanFeatureItems } from "@/app/[locale]/subscription/lib/plan-features";
import { X, ArrowLeft, CheckCircle2, Lock, ShieldCheck } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ROUTES } from "@/config/routes";
import { env } from "@/config/env";
import { type ApiErrorKey, getApiErrorKey } from "@/lib/api-errors";
import { ApiErrorMessage } from "@/components/api-error-message";

const CURRENCY = "USD";
const PLAN_PLACEHOLDERS = 4;

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
      <div className="min-h-screen bg-background px-4 pt-40">
        <div className="mx-auto grid w-full max-w-6xl gap-4 md:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: PLAN_PLACEHOLDERS }, (_, index) => (
            <Skeleton key={index} className="h-[26rem] rounded-2xl" />
          ))}
        </div>
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
          <Button asChild size="lg" className="w-full">
            <Link href={ROUTES.workspace}>{t("success.goToWorkspace")}</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <PayPalScriptProvider options={{
      clientId: env.paypalClientId,
      currency: CURRENCY,
      intent: "capture",
      vault: true
    }}>
      <div className="min-h-screen from-background relative">
        <header className="absolute top-0 w-full z-10">
          <div className="container mx-auto px-4 h-16 flex items-center justify-between">
            {selectedPlan && (
              <Button variant="ghost" size="sm" onClick={() => setSelectedPlan(null)}>
                <ArrowLeft />
                {t("backToPlans")}
              </Button>
            )}
            <div className="flex-1" />
            <Button asChild variant="ghost" size="icon">
              <Link href={ROUTES.workspace} aria-label={t("closePricing")} title={t("closePricing")}>
                <X />
              </Link>
            </Button>
          </div>
        </header>

        <main className="container mx-auto flex min-h-screen flex-col items-center justify-center px-4 py-24">
          {!selectedPlan ? (
            <>
              <div className="mb-12 max-w-2xl text-center">
                <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
                  {t.rich("hero.title", {
                    highlight: (chunks) => <span className="font-serif font-normal italic text-primary">{chunks}</span>,
                  })}
                </h1>
                <p className="mt-3 text-muted-foreground">{t("hero.subtitle")}</p>
                <div className="mt-5">
                  <CurrentUsage />
                </div>
              </div>

              <div className="grid w-full max-w-6xl gap-x-4 md:grid-cols-2 lg:grid-cols-4">
                {plans.map((plan) => (
                  <PricingCard
                    key={plan.plan}
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
                    <div className="flex items-center justify-center gap-2 text-xs font-medium text-muted-foreground bg-success/10 py-2 rounded-lg">
                      <ShieldCheck className="w-4 h-4 text-success" />
                      <span>{t("checkout.securePayment")}</span>
                    </div>

                    {/* PayPal's buttons (including the black card button) are made for a light surface */}
                    <div className="bg-ivory-sheet p-1 rounded-xl">
                      <PayPalButton
                        plan={selectedPlan}
                        onSuccess={handlePaymentSuccess}
                        onCancel={() => setSelectedPlan(null)}
                        onError={(paymentError) => setPaymentErrorKey(getApiErrorKey(paymentError))}
                      />
                    </div>

                    <ApiErrorMessage errorKey={paymentErrorKey} className="text-center" />

                    <Button variant="ghost" onClick={() => setSelectedPlan(null)} className="mt-4 w-full">
                      <ArrowLeft />
                      {t("checkout.cancelAndReturn")}
                    </Button>
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