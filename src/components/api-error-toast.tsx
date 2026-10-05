"use client";

import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { type ApiErrorKey, getApiErrorKey } from "@/lib/api-errors";

const ToastMessage = ({ errorKey }: { errorKey: ApiErrorKey }) => {
  const t = useTranslations("errors");
  return <>{t(errorKey)}</>;
};

// Translated inside the Toaster, so callers need no `t`; the key as id collapses repeats.
export const showApiErrorToast = (error: unknown): void => {
  const errorKey = getApiErrorKey(error);
  toast.error(<ToastMessage errorKey={errorKey} />, { id: errorKey });
};
