"use client";

import { useFormatter, useNow, useTranslations } from "next-intl";
import { type ApiErrorKey, isPlanLimitError } from "@/lib/api-errors";
import { useUsage } from "@/app/[locale]/subscription/hooks/useSubscription";
import { UpgradePlanLink } from "@/components/upgrade-plan-link";
import { cn } from "@/lib/utils";

// Translates an API error, filling in the values some messages need (when credits renew).
// A context's own `fallback` wins over the generic "unknown" message.
const useApiErrorText = (errorKey: ApiErrorKey | null | undefined, fallback?: string): string | null => {
  const t = useTranslations("errors");
  const tCredits = useTranslations("common.credits");
  const format = useFormatter();
  const now = useNow({ updateInterval: 60_000 });
  const needsRenewal = errorKey === "insufficientCredits";
  const { data: usage } = useUsage({ enabled: needsRenewal });

  if (!errorKey || (errorKey === "unknown" && fallback !== undefined)) return fallback ?? null;
  if (needsRenewal) {
    const when = usage ? format.relativeTime(new Date(usage.credits.resetsAt), now) : tCredits("renewSoon");
    return t("insufficientCredits", { when });
  }
  return t(errorKey);
};

interface ApiErrorTextProps {
  errorKey: ApiErrorKey | null | undefined;
  fallback?: string;
}

// The message plus, for limits an upgrade lifts, the link to the plans. Callers provide the wrapper.
export const ApiErrorText = ({ errorKey, fallback }: ApiErrorTextProps) => {
  const text = useApiErrorText(errorKey, fallback);
  if (!text) return null;

  return (
    <>
      {text}
      {errorKey && isPlanLimitError(errorKey) && (
        <>
          {" "}
          <UpgradePlanLink />
        </>
      )}
    </>
  );
};

interface ApiErrorMessageProps {
  errorKey: ApiErrorKey | null | undefined;
  className?: string;
}

export const ApiErrorMessage = ({ errorKey, className }: ApiErrorMessageProps) => {
  if (!errorKey) return null;

  return (
    <p role="alert" className={cn("text-sm text-destructive", className)}>
      <ApiErrorText errorKey={errorKey} />
    </p>
  );
};
