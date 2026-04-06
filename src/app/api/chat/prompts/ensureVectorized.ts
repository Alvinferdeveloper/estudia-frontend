import { fetchWithAuth } from '@/app/api/utils/fetchWithAuth';

export async function ensureDocumentIsVectorized(documentId: string): Promise<void> {
  try {
    const status = await fetchWithAuth(
      `${process.env.NEXT_PUBLIC_API_URL}/documents/${documentId}/vectorize-status`
    );

    if (!status.isVectorized) {
      await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_API_URL}/documents/${documentId}/vectorize`,
        { method: 'POST' }
      );
    }
  } catch (error) {
    console.error('Auto-vectorize error:', error);
  }
}
