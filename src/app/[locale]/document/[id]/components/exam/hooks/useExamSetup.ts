import { useCallback, useState } from "react";
import { useRouter } from "@/i18n/navigation";
import { ROUTES } from "@/config/routes";
import { getApiErrorKey } from "@/lib/api-errors";
import { extractPagesText } from "@/app/[locale]/document/[id]/lib/pdf-text";
import type { PdfDocument } from "@/app/[locale]/document/[id]/lib/pdf-document";
import {
  type ExamConfig,
  useGenerateExam,
} from "@/app/[locale]/document/[id]/components/exam/hooks/useExam";

interface UseExamSetupProps {
  documentId: string;
  documentName: string;
  selectedPages: number[];
  pdfDoc: PdfDocument | null;
}

// Generates an exam from the selected pages and opens its first attempt.
export const useExamSetup = ({ documentId, documentName, selectedPages, pdfDoc }: UseExamSetupProps) => {
  const router = useRouter();
  const generateExam = useGenerateExam();
  const [isPreparing, setIsPreparing] = useState(false);

  const generate = useCallback(
    async (config: ExamConfig) => {
      const pages = [...selectedPages].sort((a, b) => a - b);
      setIsPreparing(true);
      const extracted = pdfDoc ? await extractPagesText(pdfDoc, pages) : "";
      setIsPreparing(false);
      const content = extracted || `Content from pages ${pages.join(", ")} of ${documentName}`;

      generateExam.mutate(
        { ...config, documentId, pages, content },
        {
          onSuccess: ({ examId, attemptId }) =>
            router.push(ROUTES.examAttempt(documentId, examId, attemptId)),
        }
      );
    },
    [selectedPages, pdfDoc, documentName, documentId, generateExam, router]
  );

  return {
    generate,
    // Stays pending through the navigation, so the panel doesn't flash back to idle.
    isGenerating: isPreparing || generateExam.isPending || generateExam.isSuccess,
    errorKey: generateExam.error ? getApiErrorKey(generateExam.error) : null,
  };
};
