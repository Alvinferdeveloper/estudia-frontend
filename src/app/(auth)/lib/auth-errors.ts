// Better Auth returns English messages; map its error codes to copy our users can act on.
const AUTH_ERROR_MESSAGES: Record<string, string> = {
  INVALID_EMAIL_OR_PASSWORD: "El correo o la contraseña no son correctos.",
  INVALID_PASSWORD: "La contraseña no es correcta.",
  INVALID_EMAIL: "Ese correo no parece válido.",
  USER_ALREADY_EXISTS: "Ya hay una cuenta con ese correo. Prueba a entrar.",
  USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL: "Ya hay una cuenta con ese correo. Prueba a entrar.",
  PASSWORD_TOO_SHORT: "La contraseña debe tener al menos 8 caracteres.",
  PASSWORD_TOO_LONG: "La contraseña es demasiado larga.",
  EMAIL_NOT_VERIFIED: "Confirma tu correo antes de entrar.",
};

const TOO_MANY_REQUESTS = "Demasiados intentos. Espera un momento y vuelve a intentarlo.";
const UNKNOWN_ERROR = "No pudimos completar la operación. Inténtalo de nuevo.";

export const NETWORK_ERROR = "No pudimos conectar con el servidor. Revisa tu conexión.";

export const getAuthErrorMessage = (error: { code?: string; status?: number }): string => {
  if (error.code && AUTH_ERROR_MESSAGES[error.code]) return AUTH_ERROR_MESSAGES[error.code];
  if (error.status === 429) return TOO_MANY_REQUESTS;
  return UNKNOWN_ERROR;
};
