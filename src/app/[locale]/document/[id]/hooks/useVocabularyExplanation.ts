import { useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import { VocabularyExplanation } from "@/app/types";

export interface VocabularyExplainRequest {
  selectedText: string;
  wordLanguage: string;
  explanationLanguage: string;
  sourceLanguage?: string;
  documentContext?: string;
}

const postExplainVocabulary = async (
  request: VocabularyExplainRequest
): Promise<VocabularyExplanation> => {
  const { data } = await api.post("/ai/vocabulary/explain", request);
  return data.explanation;
};

export const useVocabularyExplanation = () => {
  return useMutation<VocabularyExplanation, Error, VocabularyExplainRequest>({
    mutationFn: postExplainVocabulary,
    meta: { inlineError: true },
  });
};
