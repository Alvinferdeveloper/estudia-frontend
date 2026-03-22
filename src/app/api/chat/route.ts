import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { convertToModelMessages, streamText } from 'ai';

export const runtime = 'edge';

const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_API_KEY,
});

export async function POST(req: Request) {
  const { messages } = await req.json();

  const systemPrompt = `Eres un asistente de estudio. El usuario te comparte texto del documento y hace preguntas sobre él. Responde de forma clara, concisa y útil para facilitar el estudio.`;

  const modelMessages = convertToModelMessages(messages);

  const result = streamText({
    model: google('gemini-2.5-flash-lite'),
    system: systemPrompt,
    messages: modelMessages,
  });

  return result.toUIMessageStreamResponse();
}
