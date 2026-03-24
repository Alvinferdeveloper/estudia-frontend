import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { convertToModelMessages, streamText } from 'ai';
import { ChatRequestBody, SearchResult } from '@/app/api/chat/lib/types';
import { ensureDocumentIsVectorized } from '@/app/api/chat/lib/ensureVectorized';
import { searchDocumentChunks, getLastUserQuery } from '@/app/api/chat/lib/searchDocument';
import { buildSystemPrompt } from '@/app/api/chat/lib/buildPrompt';

export const runtime = 'edge';

const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_API_KEY,
});

export async function POST(req: Request) {
  const json = await req.json();
  const { messages, documentId, documentName = 'documento' }: ChatRequestBody = json;

  let chunks: SearchResult[] = [];

  if (documentId) {
    await ensureDocumentIsVectorized(documentId);

    const query = getLastUserQuery(messages);
    if (query) {
      chunks = await searchDocumentChunks(documentId, query, 3);
    }
  }

  const systemPrompt = buildSystemPrompt(documentName, chunks);
  const modelMessages = convertToModelMessages(messages);

  const result = streamText({
    model: google('gemini-2.5-flash'),
    system: systemPrompt,
    messages: modelMessages,
  });

  return result.toUIMessageStreamResponse();
}
