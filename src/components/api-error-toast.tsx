"use client";

import { toast } from "sonner";
import { getApiErrorKey } from "@/lib/api-errors";
import { ApiErrorText } from "@/components/api-error-message";

// Translated inside the Toaster, so callers need no `t`; the key as id collapses repeats.
export const showApiErrorToast = (error: unknown): void => {
  const errorKey = getApiErrorKey(error);
  toast.error(<ApiErrorText errorKey={errorKey} />, { id: errorKey });
};
