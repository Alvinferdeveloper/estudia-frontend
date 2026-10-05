import type { routing } from "@/i18n/routing";
import type messages from "@/messages/es";

// Spanish is the reference: message keys autocomplete and a missing key is a type error.
declare module "next-intl" {
  interface AppConfig {
    Locale: (typeof routing.locales)[number];
    Messages: typeof messages;
  }
}
