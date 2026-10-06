"use client";

import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";
import { SubscriptionPlan, useCreateSubscription, useCapturePayment } from "../hooks/useSubscription";
import { Loader2 } from "lucide-react";
import { useRef } from "react";
import { useTranslations } from "next-intl";

interface PayPalButtonProps {
  plan: SubscriptionPlan;
  onSuccess: () => void;
  onCancel?: () => void;
  onError?: (error: unknown) => void;
}

export function PayPalButton({ plan, onSuccess, onCancel, onError }: PayPalButtonProps) {
  const t = useTranslations("subscription.checkout");
  const [{ isPending }] = usePayPalScriptReducer();
  const createSubscriptionMutation = useCreateSubscription();
  const capturePaymentMutation = useCapturePayment();
  // PayPalButtons keeps its first callbacks, so state set in createSubscription would read stale here.
  const paymentIdRef = useRef<string | null>(null);

  if (isPending) {
    return (
      <div className="flex flex-col items-center justify-center py-6 gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        <span className="text-sm text-muted-foreground font-medium animate-pulse">{t("connectingPayPal")}</span>
      </div>
    );
  }

  return (
    <div className="w-full relative z-0 transition-opacity duration-300 hover:opacity-95">
      <PayPalButtons
        style={{ layout: "vertical", color: "gold", shape: "pill", label: "pay", height: 48 }}
        createSubscription={async () => {
          try {
            const response = await createSubscriptionMutation.mutateAsync(plan);
            paymentIdRef.current = response.paymentId;
            return response.subscriptionId;
          } catch (error) {
            console.error("Error creating PayPal subscription:", error);
            onError?.(error);
            throw error;
          }
        }}
        onApprove={async () => {
          const paymentId = paymentIdRef.current;
          if (!paymentId) {
            onError?.(new Error("Approved a PayPal subscription without an internal payment id"));
            return;
          }
          try {
            await capturePaymentMutation.mutateAsync(paymentId);
            onSuccess();
          } catch (error) {
            console.error("Error activating PayPal subscription:", error);
            onError?.(error);
          }
        }}
        onCancel={() => onCancel?.()}
        onError={(err) => {
          console.error("PayPal Button Error:", err);
          onError?.(err);
        }}
      />
    </div>
  );
}