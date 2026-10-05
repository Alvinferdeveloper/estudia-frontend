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
  try {
    const { data } = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/documents/${documentId}/visual-query`,
      request,
      { withCredentials: true }
    );
    return data.answer;
  } catch (err) {
    if (axios.isAxiosError(err) && err.response?.data?.message) {
      throw new Error(err.response.data.message);
    }
    throw err;
  }
};

export const useVisualQuery = (documentId: string) => {
  return useMutation<string, Error, VisualQueryRequest>({
    mutationFn: (request) => postVisualQuery(documentId, request),
  });
};
