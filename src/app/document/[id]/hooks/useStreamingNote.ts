import { useCompletion } from "@ai-sdk/react";
import { useCallback } from "react";

interface UseStreamingNoteOptions {
  apiEndpoint?: string;
}

interface UseStreamingNoteBody {
  selectedText: string;
  prompt: string;
  documentContext?: string;
  originalNote?: string;
}

interface UseStreamingNoteReturn {
  completion: string;
  isLoading: boolean;
  error: Error | undefined;
  complete: (prompt: string, body: UseStreamingNoteBody) => Promise<string | null | undefined>;
  stop: () => void;
  setCompletion: (completion: string) => void;
}

export const useStreamingNote = (options: UseStreamingNoteOptions = {}): UseStreamingNoteReturn => {
  const { apiEndpoint = "/api/stream-note" } = options;

  const {
    completion,
    isLoading,
    error,
    complete,
    stop,
    setCompletion,
  } = useCompletion({
    api: apiEndpoint,
    streamProtocol: "text",
    body: {},
  });

  const wrappedComplete = useCallback(
    async (prompt: string, body: UseStreamingNoteBody) => {
      return await complete(prompt, { body });
    },
    [complete]
  );

  return {
    completion,
    isLoading,
    error,
    complete: wrappedComplete,
    stop,
    setCompletion,
  };
};
