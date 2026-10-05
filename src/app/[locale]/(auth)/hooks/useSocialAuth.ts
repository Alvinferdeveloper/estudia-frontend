import { useState } from "react";
import { useLocale } from "next-intl";
import { authClient } from "@/app/lib/auth-client";
import { afterAuthCallbackUrl } from "../lib/auth-modes";
import { AuthErrorKey, getAuthErrorKey } from "../lib/auth-errors";

export type SocialProvider = "google" | "github" | "facebook";

export const useSocialAuth = () => {
  const locale = useLocale();
  const [pendingProvider, setPendingProvider] = useState<SocialProvider | null>(null);
  const [error, setError] = useState<AuthErrorKey | null>(null);

  const signInWith = async (provider: SocialProvider) => {
    setPendingProvider(provider);
    setError(null);

    try {
      const { error: authError } = await authClient.signIn.social({
        provider,
        callbackURL: afterAuthCallbackUrl(locale),
      });
      // On success the browser is already leaving for the provider, so the pending state stays.
      if (authError) {
        setError(getAuthErrorKey(authError));
        setPendingProvider(null);
      }
    } catch {
      setError("network");
      setPendingProvider(null);
    }
  };

  return { signInWith, pendingProvider, error };
};
