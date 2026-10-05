import { ROUTES } from "@/config/routes";
import { Locale } from "@/i18n/routing";
import { localizePath } from "@/i18n/paths";

export type AuthMode = "login" | "register";

export const AFTER_AUTH_PATH = ROUTES.workspace;
export const MIN_PASSWORD_LENGTH = 8;

// Absolute: Better Auth resolves relative callbacks against the API origin, not this app.
export const afterAuthCallbackUrl = (locale: Locale) =>
  `${window.location.origin}${localizePath(AFTER_AUTH_PATH, locale)}`;

// Behaviour that differs between the two screens; their copy lives in the "auth" messages under the same key.
export const AUTH_MODES = {
  login: {
    passwordAutoComplete: "current-password",
    showPasswordHint: false,
    switchHref: ROUTES.register,
  },
  register: {
    passwordAutoComplete: "new-password",
    showPasswordHint: true,
    switchHref: ROUTES.login,
  },
} as const;
