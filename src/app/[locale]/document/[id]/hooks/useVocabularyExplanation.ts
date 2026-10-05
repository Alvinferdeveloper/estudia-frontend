import { useMutation } from "@tanstack/react-query";
import axios from "axios";
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
  const { data } = await axios.post(
    `${process.env.NEXT_PUBLIC_API_URL}/ai/vocabulary/explain`,
    request,
    { withCredentials: true }
  );
  return data.explanation;
};

export const useVocabularyExplanation = () => {
  return useMutation<VocabularyExplanation, Error, VocabularyExplainRequest>({
    mutationFn: postExplainVocabulary,
  });
};
