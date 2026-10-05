import type { routing } from "@/i18n/routing";
import type messages from "@/messages/es";

// Spanish is the reference: message keys autocomplete and a missing key is a type error.
declare module "next-intl" {
  interface AppConfig {
    Locale: (typeof routing.locales)[number];
    Messages: typeof messages;
  }
}

declare module "@tanstack/react-query" {
  interface Register {
    mutationMeta: {
      // Set when the component shows the error itself, so the global toast stays quiet.
      inlineError?: boolean;
    };
  }
}
