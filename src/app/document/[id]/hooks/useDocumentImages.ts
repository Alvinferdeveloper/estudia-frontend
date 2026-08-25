import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export interface DocumentImageRef {
  id: string;
  documentId: string;
  pageNumber: number;
  xref: number;
  bboxX0: number;
  bboxY0: number;
  bboxX1: number;
  bboxY1: number;
}

const fetchDocumentImages = async (
  documentId: string
): Promise<DocumentImageRef[]> => {
  const { data } = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/documents/${documentId}/images`,
    { withCredentials: true }
  );
  return data;
};

export const useDocumentImages = (documentId: string) => {
  return useQuery<DocumentImageRef[], Error>({
    queryKey: ["document-images", documentId],
    queryFn: () => fetchDocumentImages(documentId),
    enabled: !!documentId,
    staleTime: Infinity,
  });
};
