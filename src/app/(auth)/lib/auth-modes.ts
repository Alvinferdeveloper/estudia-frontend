import { BRAND_NAME } from "@/lib/brand";

export type AuthMode = "login" | "register";

export const AFTER_AUTH_PATH = "/workspace";
export const MIN_PASSWORD_LENGTH = 8;

// Login and register share one screen; everything that differs lives here.
export const AUTH_MODES = {
  login: {
    title: "Hola de nuevo",
    subtitle: `Entra para seguir estudiando con ${BRAND_NAME}.`,
    submitLabel: "Entrar",
    submittingLabel: "Entrando…",
    passwordAutoComplete: "current-password",
    passwordHint: undefined,
    switchPrompt: "¿Aún no tienes cuenta?",
    switchLabel: "Crear cuenta",
    switchHref: "/register",
  },
  register: {
    title: "Crea tu cuenta",
    subtitle: `Empieza a estudiar con ${BRAND_NAME}. Es gratis.`,
    submitLabel: "Crear cuenta",
    submittingLabel: "Creando tu cuenta…",
    passwordAutoComplete: "new-password",
    passwordHint: `Mínimo ${MIN_PASSWORD_LENGTH} caracteres.`,
    switchPrompt: "¿Ya tienes cuenta?",
    switchLabel: "Entrar",
    switchHref: "/login",
  },
} as const;
