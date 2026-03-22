import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { streamText } from 'ai';

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

  const systemPrompt = `You are an AI study assistant specialized in creating clear, well-formatted study notes.

## CONTEXT
- Document: ${documentContext || 'No additional context'}
- Selected text: "${selectedText}"
- User request: ${prompt}

## FORMATTING RULES (CRITICAL)
You MUST follow these formatting rules strictly:

1. USE MARKDOWN PROPERLY - Do NOT use asterisks as separators (***). Use proper markdown:
   - # for headings (## for main sections, ### for subsections)
   - **text** for bold, *text* for italic
   - \`code\` for inline code, \`\`\`language for code blocks
   - > for quotes or key concepts
   - - or * for bullet points
   - 1. for numbered lists

2. CODE FORMATTING - Always specify the language for code blocks:
   \`\`\`python
   def example():
       pass
   \`\`\`

3. MATH & FORMULAS - Use LaTeX format:
   - Inline: $formula$
   - Block: $$formula$$

4. STRUCTURE - Organize content with clear hierarchy:
   - Start with the main concept (heading)
   - Use bullet points for key points
   - Include examples when helpful
   - End with a summary or key takeaway

5. VISUAL SEPARATORS - Use --- for section dividers instead of ***

6. TABLES - Use markdown tables when comparing or listing structured data

## OUTPUT
Provide a clear, educational response that:
- Directly addresses the user's request
- Is well-structured with markdown headings and lists
- Includes code examples with proper syntax highlighting
- Highlights important concepts with bold text
- Uses quotes for definitions or key terms`;

  const result = streamText({
    model: google('gemini-2.5-flash-lite'),
    messages: [
      {
        role: 'user',
        content: systemPrompt,
      },
    ],
  });

  return result.toTextStreamResponse();
}
