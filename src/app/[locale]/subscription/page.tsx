"use client";

export const dynamic = 'force-dynamic';

import { useState } from "react";
import { useFormatter, useTranslations } from "next-intl";
import { usePlans, SubscriptionPlan } from "./hooks/useSubscription";
import { PricingCard } from "@/app/[locale]/subscription/components/PricingCard";
import { PayPalButton } from "@/app/[locale]/subscription/components/PayPalButton";
import { CurrentUsage } from "@/app/[locale]/subscription/components/CurrentUsage";
import { getPlanFeatureItems } from "@/app/[locale]/subscription/lib/plan-features";
import { X, ArrowLeft, CheckCircle2, ShieldCheck } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import { Button } from "@/components/ui/button";
import { BrandLogo } from "@/components/brand/BrandLogo";
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
      <div className="flex min-h-screen items-center justify-center bg-background p-4">
        <div className="w-full max-w-md text-center">
          <CheckCircle2 aria-hidden className="mx-auto size-10 text-success" />
          <h1 className="mt-5 font-serif text-4xl italic">{t("success.title")}</h1>
          <p className="mt-3 text-muted-foreground">{t("success.description")}</p>
          <Button asChild size="lg" className="mt-8 w-full">
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
      <div className="relative min-h-screen bg-background">
        <header className="absolute top-0 w-full z-10">
          <div className="container mx-auto px-4 h-16 flex items-center justify-between">
            <Link
              href={ROUTES.workspace}
              className="rounded-lg text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <BrandLogo />
            </Link>
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
            <div className="w-full max-w-md">
              <section aria-labelledby="checkout-title" className="rounded-2xl border border-border bg-card p-6">
                <h1 id="checkout-title" className="text-base font-semibold">{t("checkout.title")}</h1>

                <dl className="mt-5 divide-y divide-border border-y border-border text-sm">
                  <div className="flex items-center justify-between py-3">
                    <dt className="text-muted-foreground">{t("checkout.plan")}</dt>
                    <dd className="font-medium">{tPlans(selectedPlan)}</dd>
                  </div>
                  <div className="flex items-baseline justify-between py-3">
                    <dt className="text-muted-foreground">{t("checkout.totalToPay")}</dt>
                    <dd>
                      <span className="font-mono font-semibold tabular-nums">
                        {format.number(plans.find((p) => p.plan === selectedPlan)?.price ?? 0, { style: "currency", currency: CURRENCY })}
                      </span>
                      <span className="text-muted-foreground"> {t("checkout.perMonth")}</span>
                    </dd>
                  </div>
                </dl>

                <p className="mt-5 flex items-center gap-2 text-xs text-muted-foreground">
                  <ShieldCheck aria-hidden className="size-4 text-success" />
                  {t("checkout.securePayment")}
                </p>

                {/* PayPal's buttons (including the black card button) are made for a light surface */}
                <div className="mt-4 rounded-xl bg-ivory-sheet p-1">
                  <PayPalButton
                    plan={selectedPlan}
                    onSuccess={handlePaymentSuccess}
                    onCancel={() => setSelectedPlan(null)}
                    onError={(paymentError) => setPaymentErrorKey(getApiErrorKey(paymentError))}
                  />
                </div>

                <ApiErrorMessage errorKey={paymentErrorKey} className="mt-3 text-center" />
              </section>

              <Button variant="ghost" onClick={() => setSelectedPlan(null)} className="mt-4 w-full">
                <ArrowLeft />
                {t("checkout.cancelAndReturn")}
              </Button>
            </div>
          )}
        </main>
      </div>
    </PayPalScriptProvider>
  );
}