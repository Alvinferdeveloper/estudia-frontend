"use client";

import { useTranslations } from "next-intl";
import type { ApiErrorKey } from "@/lib/api-errors";
import { cn } from "@/lib/utils";

// Prefers the API's reason (limit reached, AI unavailable) over a context's own generic message.
export const useApiErrorText = () => {
  const t = useTranslations("errors");
  return (errorKey: ApiErrorKey | null | undefined, fallback: string): string =>
    errorKey && errorKey !== "unknown" ? t(errorKey) : fallback;
};

interface ApiErrorMessageProps {
  errorKey: ApiErrorKey | null | undefined;
  className?: string;
}

export const ApiErrorMessage = ({ errorKey, className }: ApiErrorMessageProps) => {
  const t = useTranslations("errors");
  if (!errorKey) return null;

  return (
    <p role="alert" className={cn("text-sm text-destructive", className)}>
      {t(errorKey)}
    </p>
  );
};
