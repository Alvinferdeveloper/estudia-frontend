import { useCompletion } from "@ai-sdk/react";
import { useCallback, useRef } from "react";

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
  // Rejects with the request error; resolves empty when stopped by the user.
  complete: (prompt: string, body: UseStreamingNoteBody) => Promise<string | null | undefined>;
  stop: () => void;
  setCompletion: (completion: string) => void;
}

export const useStreamingNote = (options: UseStreamingNoteOptions = {}): UseStreamingNoteReturn => {
  const { apiEndpoint = `${process.env.NEXT_PUBLIC_API_URL}/ai/notes/stream` } = options;
  const lastError = useRef<Error | null>(null);

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
    credentials: 'include',
    // useCompletion resolves null on failure; keep the error so complete() can reject with it.
    onError: (requestError) => {
      lastError.current = requestError;
    },
  });

  const wrappedComplete = useCallback(
    async (prompt: string, body: UseStreamingNoteBody) => {
      lastError.current = null;
      const result = await complete(prompt, { body });
      if (lastError.current) throw lastError.current;
      return result;
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
