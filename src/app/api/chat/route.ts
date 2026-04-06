import { convertToModelMessages, streamText } from 'ai';
import { ChatRequestBody, SearchResult } from '@/app/api/chat/prompts/types';
import { ensureDocumentIsVectorized } from '@/app/api/chat/prompts/ensureVectorized';
import { searchDocumentChunks, getLastUserQuery } from '@/app/api/chat/prompts/searchDocument';
import { buildSystemPrompt } from './prompts/buildPrompt';
import { AI_MODELS } from '@/app/api/lib/ai/models';

export const runtime = 'edge';

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
    model: AI_MODELS.chat,
    system: systemPrompt,
    messages: modelMessages,
  });

  return result.toUIMessageStreamResponse();
}
