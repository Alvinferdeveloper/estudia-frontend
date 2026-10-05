import type referenceMessages from "@/messages/es";

export type AuthErrorKey = keyof typeof referenceMessages.auth.errors;

// Better Auth error codes mapped to message keys; the UI translates them into the active language.
const ERROR_CODE_KEYS: Record<string, AuthErrorKey> = {
  INVALID_EMAIL_OR_PASSWORD: "invalidCredentials",
  INVALID_PASSWORD: "invalidPassword",
  INVALID_EMAIL: "invalidEmail",
  USER_ALREADY_EXISTS: "userExists",
  USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL: "userExists",
  PASSWORD_TOO_SHORT: "passwordTooShort",
  PASSWORD_TOO_LONG: "passwordTooLong",
  EMAIL_NOT_VERIFIED: "emailNotVerified",
};

export const getAuthErrorKey = (error: { code?: string; status?: number }): AuthErrorKey => {
  if (error.code && ERROR_CODE_KEYS[error.code]) return ERROR_CODE_KEYS[error.code];
  if (error.status === 429) return "tooManyRequests";
  return "unknown";
};
