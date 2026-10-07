import { useRouter } from "@/i18n/navigation";
import { ROUTES } from "@/config/routes";
import { ATTEMPT_MODES, useStartAttempt } from "@/app/[locale]/document/[id]/components/exam/hooks/useExam";

// Starts a fresh attempt of an existing exam and opens it.
export const useRetakeExam = (documentId: string) => {
  const router = useRouter();
  const startAttempt = useStartAttempt();

  const retake = (examId: string) =>
    startAttempt.mutate(
      { examId, mode: ATTEMPT_MODES.PRACTICE },
      { onSuccess: ({ attemptId }) => router.push(ROUTES.examAttempt(documentId, examId, attemptId)) }
    );

  return {
    retake,
    // The exam being restarted, so only its button shows progress.
    pendingExamId: startAttempt.isPending || startAttempt.isSuccess ? startAttempt.variables?.examId ?? null : null,
  };
};
