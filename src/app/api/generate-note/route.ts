import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { generateText } from 'ai';

export const runtime = 'edge';

const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_API_KEY,
});

export async function POST(req: Request) {
  const { selectedText, prompt, documentContext }: {
    selectedText: string;
    prompt: string;
    documentContext?: string;
  } = await req.json();

  const systemPrompt = `You are an AI study assistant. Your task is to generate helpful notes about specific text selections from documents.
                        Context: ${documentContext || 'No additional context'}
                        The user has selected the following text:"${selectedText}"
                        The user wants you to: ${prompt}
                        Please provide a clear, concise, and educational response. Format your answer appropriately.`;

  const result = await generateText({
    model: google('gemini-2.5-flash-lite'),
    messages: [
      {
        role: 'user',
        content: systemPrompt,
      },
    ],
  });

  return Response.json({
    content: result.text,
  });
}
