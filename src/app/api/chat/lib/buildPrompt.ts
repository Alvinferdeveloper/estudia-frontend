import { SearchResult } from './types';

export function buildSystemPrompt(documentName: string, chunks: SearchResult[]): string {
  let prompt = `Eres un asistente de estudio del documento "${documentName}". `;

  if (chunks.length > 0) {
    prompt += `El usuario hace una pregunta. Busca las secciones más relevantes del documento para responder.\n\n`;
    prompt += `SECCIONES RELEVANTES DEL DOCUMENTO:\n`;

    chunks.forEach((chunk, i) => {
      prompt += `\n--- Sección ${i + 1} (pág. ${chunk.pageNumber}) ---\n${chunk.content}\n`;
    });

    prompt += `\n\nResponde basándote en las secciones relevantes del documento. Cita las páginas cuando sea posible.`;
  } else {
    prompt += `Responde de forma clara, concisa y útil para facilitar el estudio.`;
  }

  return prompt;
}
