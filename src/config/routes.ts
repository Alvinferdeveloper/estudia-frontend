const DOCUMENT_BASE = "/document";

export const ROUTES = {
  home: "/",
  login: "/login",
  register: "/register",
  workspace: "/workspace",
  subscription: "/subscription",
  document: (id: string) => `${DOCUMENT_BASE}/${id}`,
  documentPage: (id: string, page: number) => `${DOCUMENT_BASE}/${id}?page=${page}`,
  documentExams: (id: string) => `${DOCUMENT_BASE}/${id}/exams`,
  examAttempt: (documentId: string, examId: string, attemptId: string) =>
    `${DOCUMENT_BASE}/${documentId}/exams/${examId}/attempts/${attemptId}`,
} as const;

// Route groups the middleware guards.
export const PROTECTED_ROUTE_PREFIXES = [ROUTES.workspace, DOCUMENT_BASE];
export const AUTH_ROUTES: string[] = [ROUTES.login, ROUTES.register];
