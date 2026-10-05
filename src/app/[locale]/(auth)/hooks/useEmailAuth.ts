import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/app/lib/auth-client";
import { AFTER_AUTH_PATH, AuthMode } from "../lib/auth-modes";
import { NETWORK_ERROR, getAuthErrorMessage } from "../lib/auth-errors";

export interface EmailAuthFields {
  name: string;
  email: string;
  password: string;
}

export const useEmailAuth = (mode: AuthMode) => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async ({ name, email, password }: EmailAuthFields) => {
    setIsSubmitting(true);
    setError(null);
    // Absolute: Better Auth resolves relative callbacks against the API origin, not this app.
    const callbackURL = `${window.location.origin}${AFTER_AUTH_PATH}`;

    try {
      const { error: authError } =
        mode === "login"
          ? await authClient.signIn.email({ email, password, callbackURL })
          : await authClient.signUp.email({ name, email, password, callbackURL });

      if (authError) {
        setError(getAuthErrorMessage(authError));
        setIsSubmitting(false);
        return;
      }
      // Keep the loading state while the workspace loads.
      router.push(AFTER_AUTH_PATH);
    } catch {
      setError(NETWORK_ERROR);
      setIsSubmitting(false);
    }
  };

  return { submit, isSubmitting, error, clearError: () => setError(null) };
};
