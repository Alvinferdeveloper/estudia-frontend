import { useCallback, useRef, useState } from "react";
import axios from "axios";

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

  const clear = useCallback(() => {
    abortRef.current?.abort();
    setTranslation(null);
    setDetectedSourceLanguage(null);
    setIsLoading(false);
  }, []);

  const translate = useCallback((rawText: string, targetLanguage = "es") => {
    abortRef.current?.abort();

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

    axios
      .post(
        `${process.env.NEXT_PUBLIC_API_URL}/translate`,
        { text, targetLanguage },
        { withCredentials: true, signal: controller.signal }
      )
      .then(({ data }) => {
        const detected = data.detectedSourceLanguage ?? null;
        translationCache.set(key, { translatedText: data.translatedText, detectedSourceLanguage: detected });
        setTranslation(data.translatedText);
        setDetectedSourceLanguage(detected);
      })
      .catch((err) => {
        if (axios.isCancel(err)) return;
        // Silent failure: the bubble just doesn't appear, reading isn't interrupted.
        setTranslation(null);
      })
      .finally(() => {
        if (abortRef.current === controller) setIsLoading(false);
      });
  }, []);

  return { translation, detectedSourceLanguage, isLoading, translate, clear };
};
