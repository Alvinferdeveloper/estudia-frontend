"use client";

import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";
import { SubscriptionPlan, useCreateSubscription, useCapturePayment } from "../hooks/useSubscription";
import { Loader2 } from "lucide-react";
import { useState } from "react";

interface PayPalButtonProps {
  plan: SubscriptionPlan;
  onSuccess: () => void;
  onCancel?: () => void;
  onError?: (error: any) => void;
}

export function PayPalButton({ plan, onSuccess, onCancel, onError }: PayPalButtonProps) {
  const [{ isPending }] = usePayPalScriptReducer();
  const createSubscriptionMutation = useCreateSubscription();
  const capturePaymentMutation = useCapturePayment();
  const [internalPaymentId, setInternalPaymentId] = useState<string | null>(null);

  if (isPending) {
    return (
      <div className="flex flex-col items-center justify-center py-6 gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        <span className="text-sm text-muted-foreground font-medium animate-pulse">Conectando con PayPal...</span>
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
            setInternalPaymentId(response.paymentId);
            return response.subscriptionId;
          } catch (error) {
            console.error("Error creating PayPal subscription:", error);
            if (onError) onError(error);
            throw error;
          }
        }}
        onApprove={async (data) => {
          if (!internalPaymentId) {
            console.error("Internal payment ID not found");
            return;
          }
          try {
            await capturePaymentMutation.mutateAsync(internalPaymentId);
            onSuccess();
          } catch (error) {
            console.error("Error activating PayPal subscription:", error);
            if (onError) onError(error);
          }
        }}
        onCancel={() => {
          if (onCancel) onCancel();
        }}
        onError={(err) => {
          console.error("PayPal Button Error:", err);
          if (onError) onError(err);
        }}
      />
    </div>
  );
}