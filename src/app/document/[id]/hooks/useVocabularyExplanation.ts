import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { VocabularyExplanation } from "@/app/types";

export interface VocabularyExplainRequest {
  selectedText: string;
  wordLanguage: string;
  explanationLanguage: string;
  documentContext?: string;
}

const postExplainVocabulary = async (
  request: VocabularyExplainRequest
): Promise<VocabularyExplanation> => {
  try {
    const { data } = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/ai/vocabulary/explain`,
      request,
      { withCredentials: true }
    );
    return data.explanation;
  } catch (err) {
    if (axios.isAxiosError(err) && err.response?.data?.message) {
      throw new Error(err.response.data.message);
    }
    throw err;
  }
};

export const useVocabularyExplanation = () => {
  return useMutation<VocabularyExplanation, Error, VocabularyExplainRequest>({
    mutationFn: postExplainVocabulary,
  });
};
