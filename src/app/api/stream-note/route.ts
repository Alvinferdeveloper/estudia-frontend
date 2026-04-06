import { streamText } from 'ai';
import { BASE_SYSTEM_PROMPT, buildUserPrompt } from '@/app/api/stream-note/prompts/buildPrompt';
import { AI_MODELS } from '@/app/api/lib/ai/models';

export const runtime = 'edge';

export async function POST(req: Request) {
  const {
    selectedText,
    prompt,
    documentContext,
    originalNote
  }: {
    selectedText: string;
    prompt: string;
    documentContext?: string;
    originalNote?: string;
  } = await req.json();

  const userContent = buildUserPrompt({
    selectedText,
    prompt,
    documentContext,
    originalNote,
  });

  const result = streamText({
    model: AI_MODELS.noteStream,
    messages: [
      { role: 'system', content: BASE_SYSTEM_PROMPT },
      { role: 'user', content: userContent },
    ],
  });

  return result.toTextStreamResponse();
}
