import { useCallback, useRef, useState } from "react";
import axios from "axios";
import { api } from "@/lib/api-client";

interface CachedTranslation {
  translatedText: string;
  detectedSourceLanguage: string | null;
}

// Module-level cache (shared across mounts); keyed by target language too, so a flipped direction doesn't reuse a stale translation.
const translationCache = new Map<string, CachedTranslation>();
const cacheKey = (text: string, targetLanguage: string) => `${targetLanguage}:${text}`;

export interface UseQuickTranslateReturn {
  translation: string | null;
  detectedSourceLanguage: string | null;
  isLoading: boolean;
  translate: (text: string, targetLanguage?: string) => void;
  clear: () => void;
}

export const useQuickTranslate = (): UseQuickTranslateReturn => {
  const [translation, setTranslation] = useState<string | null>(null);
  const [detectedSourceLanguage, setDetectedSourceLanguage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const abortRef = useRef<AbortController | null>(null);
  const requestIdRef = useRef(0);

  const clear = useCallback(() => {
    abortRef.current?.abort();
    requestIdRef.current += 1;
    setTranslation(null);
    setDetectedSourceLanguage(null);
    setIsLoading(false);
  }, []);

  const translate = useCallback((rawText: string, targetLanguage = "es") => {
    abortRef.current?.abort();
    const requestId = ++requestIdRef.current;

    const text = rawText.trim();
    if (!text) {
      setTranslation(null);
      setDetectedSourceLanguage(null);
      setIsLoading(false);
      return;
    }

    const key = cacheKey(text, targetLanguage);
    const cached = translationCache.get(key);
    if (cached) {
      setTranslation(cached.translatedText);
      setDetectedSourceLanguage(cached.detectedSourceLanguage);
      setIsLoading(false);
      return;
    }

    const controller = new AbortController();
    abortRef.current = controller;
    setIsLoading(true);
    setTranslation(null);

    api
      .post("/translate", { text, targetLanguage }, { signal: controller.signal })
      .then(({ data }) => {
        if (requestIdRef.current !== requestId) return;
        const detected = data.detectedSourceLanguage ?? null;
        translationCache.set(key, { translatedText: data.translatedText, detectedSourceLanguage: detected });
        setTranslation(data.translatedText);
        setDetectedSourceLanguage(detected);
      })
      .catch((err) => {
        if (axios.isCancel(err) || requestIdRef.current !== requestId) return;
        // Silent failure: the bubble just doesn't appear, reading isn't interrupted.
        setTranslation(null);
      })
      .finally(() => {
        if (requestIdRef.current === requestId) setIsLoading(false);
      });
  }, []);

  return { translation, detectedSourceLanguage, isLoading, translate, clear };
};
