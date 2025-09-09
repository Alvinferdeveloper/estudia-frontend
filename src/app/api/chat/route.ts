import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { convertToModelMessages, streamText, UIMessage } from 'ai';

export const runtime = 'edge';

const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_API_KEY,
})
export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();
  const result = streamText({
    model: google('gemini-1.5-flash'),
    messages: convertToModelMessages(messages),
  });

  return result.toUIMessageStreamResponse();
}
