import { useMutation } from "@tanstack/react-query";
import axios from "axios";

export interface VisualQueryRequest {
  question: string;
  imageBase64?: string;
  imageXref?: number;
  pageNumber?: number;
}

const postVisualQuery = async (
  documentId: string,
  request: VisualQueryRequest
): Promise<string> => {
  const { data } = await axios.post(
    `${process.env.NEXT_PUBLIC_API_URL}/documents/${documentId}/visual-query`,
    request,
    { withCredentials: true }
  );
  return data.answer;
};

export const useVisualQuery = (documentId: string) => {
  return useMutation<string, Error, VisualQueryRequest>({
    mutationFn: (request) => postVisualQuery(documentId, request),
    meta: { inlineError: true },
  });
};
