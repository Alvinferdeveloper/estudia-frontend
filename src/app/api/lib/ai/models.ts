import { createGoogleGenerativeAI } from '@ai-sdk/google';

const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_API_KEY,
});

/**
 * AI Model Registry
 * Centralizes the definition and configuration of AI models across the entire application.
 * If you want to switch to OpenAI (ChatGPT) or Anthropic (Claude) in the future,
 * simply install the provider package, initialize it above, and swap the models here.
 */
export const AI_MODELS = {
  exam: google('gemini-2.5-flash'),
  noteGeneration: google('gemini-3-flash-preview'),
  noteStream: google('gemini-2.5-flash-lite'),
  chat: google('gemini-2.5-flash'),
} as const;
