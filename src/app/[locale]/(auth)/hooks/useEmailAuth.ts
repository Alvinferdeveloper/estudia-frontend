import { useState } from "react";
import { useLocale } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { authClient } from "@/app/lib/auth-client";
import { AFTER_AUTH_PATH, AuthMode, afterAuthCallbackUrl } from "../lib/auth-modes";
import { AuthErrorKey, getAuthErrorKey } from "../lib/auth-errors";

export interface EmailAuthFields {
  name: string;
  email: string;
  password: string;
}

export const useEmailAuth = (mode: AuthMode) => {
  const router = useRouter();
  const locale = useLocale();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<AuthErrorKey | null>(null);

  const submit = async ({ name, email, password }: EmailAuthFields) => {
    setIsSubmitting(true);
    setError(null);
    const callbackURL = afterAuthCallbackUrl(locale);

    try {
      const { error: authError } =
        mode === "login"
          ? await authClient.signIn.email({ email, password, callbackURL })
          : await authClient.signUp.email({ name, email, password, callbackURL });

      if (authError) {
        setError(getAuthErrorKey(authError));
        setIsSubmitting(false);
        return;
      }
      // Keep the loading state while the workspace loads.
      router.push(AFTER_AUTH_PATH);
    } catch {
      setError("network");
      setIsSubmitting(false);
    }
  };

  return { submit, isSubmitting, error, clearError: () => setError(null) };
};
