import { useState } from "react";
import { authClient } from "@/app/lib/auth-client";
import { AFTER_AUTH_PATH } from "../lib/auth-modes";
import { NETWORK_ERROR, getAuthErrorMessage } from "../lib/auth-errors";

export type SocialProvider = "google" | "github" | "facebook";

export const useSocialAuth = () => {
  const [pendingProvider, setPendingProvider] = useState<SocialProvider | null>(null);
  const [error, setError] = useState<string | null>(null);

  const signInWith = async (provider: SocialProvider) => {
    setPendingProvider(provider);
    setError(null);

    try {
      const { error: authError } = await authClient.signIn.social({
        provider,
        callbackURL: `${window.location.origin}${AFTER_AUTH_PATH}`,
      });
      // On success the browser is already leaving for the provider, so the pending state stays.
      if (authError) {
        setError(getAuthErrorMessage(authError));
        setPendingProvider(null);
      }
    } catch {
      setError(NETWORK_ERROR);
      setPendingProvider(null);
    }
  };

  return { signInWith, pendingProvider, error };
};
