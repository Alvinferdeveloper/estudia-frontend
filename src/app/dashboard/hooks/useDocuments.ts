import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

export interface Document {
  id: string;
  fileName: string;
  filePath: string;
  mimeType: string;
  createdAt: string;
  fileSize: string;
  topicId: string | null;
  tags: string[];
}

const fetchDocuments = async (topicId?: string): Promise<Document[]> => {
  const url = topicId
    ? `http://localhost:3001/documents?topicId=${topicId}`
    : `http://localhost:3001/documents`;
  const { data } = await axios.get(url, { withCredentials: true });
  return data;
};

const uploadDocument = async (formData: FormData): Promise<Document> => {
  const { data } = await axios.post('http://localhost:3001/documents/upload', formData, {
    withCredentials: true,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return data;
};

const deleteDocument = async (documentId: string): Promise<void> => {
  await axios.delete(`http://localhost:3001/documents/${documentId}`, { withCredentials: true });
};

export const useDocuments = (topicId?: string) => {
  const queryClient = useQueryClient();

  const { data: documents, isLoading, isError } = useQuery<Document[]>({
    queryKey: ['documents', topicId],
    queryFn: () => fetchDocuments(topicId)
  });

  const uploadMutation = useMutation<Document, Error, FormData>({
    mutationFn: uploadDocument,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents', topicId] });
      queryClient.invalidateQueries({ queryKey: ['topics'] });
    }
  });

  const deleteMutation = useMutation<void, Error, string>({
    mutationFn: deleteDocument,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents', topicId] });
      queryClient.invalidateQueries({ queryKey: ['topics'] });
    }
  });

  return {
    documents,
    isLoading,
    isError,
    uploadDocument: uploadMutation.mutate,
    isUploading: uploadMutation.isPending,
    deleteDocument: deleteMutation.mutate,
  };
};

