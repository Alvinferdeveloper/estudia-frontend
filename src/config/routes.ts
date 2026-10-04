const DOCUMENT_BASE = "/document";

export const ROUTES = {
  home: "/",
  login: "/login",
  register: "/register",
  workspace: "/workspace",
  subscription: "/subscription",
  upload: "/upload",
  document: (id: string) => `${DOCUMENT_BASE}/${id}`,
} as const;

// Route groups the middleware guards.
export const PROTECTED_ROUTE_PREFIXES = [ROUTES.workspace, DOCUMENT_BASE];
export const AUTH_ROUTES: string[] = [ROUTES.login, ROUTES.register];
