import { useMutation } from "@tanstack/react-query";
import axios from "axios";

export type ExportFormat = "markdown" | "json" | "csv" | "pdf";

interface ExportResponse {
  content: string;
  contentType: string;
  fileName: string;
}

export const useExportAnnotations = (documentId: string) => {
  return useMutation({
    mutationFn: async (format: ExportFormat) => {
      const { data } = await axios.get<ExportResponse>(
        `${process.env.NEXT_PUBLIC_API_URL}/documents/${documentId}/annotations/export`,
        {
          params: { format },
          withCredentials: true,
        }
      );
      return data;
    },
  });
};

export const downloadExport = (response: ExportResponse) => {
  let blob: Blob;
  
  if (response.contentType === 'application/pdf') {
    const binaryString = atob(response.content);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    blob = new Blob([bytes], { type: response.contentType });
  } else {
    blob = new Blob([response.content], { type: response.contentType });
  }
  
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = response.fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
