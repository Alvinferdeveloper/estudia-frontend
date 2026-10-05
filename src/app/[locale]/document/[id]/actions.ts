'use server';

import { api } from '@/lib/api-client';
import { cookies } from 'next/headers';

export const getDocument = async (id: string) => {
  try {
    const cookieStore = await cookies();
    const { data } = await api.get(`/documents/${id}`, { headers: { cookie: cookieStore.toString() } });
    return data;
  } catch (error) {
    console.error('Error fetching document:', error);
    return null;
  }
};

export const touchDocumentAccess = async (id: string) => {
  try {
    const cookieStore = await cookies();
    await api.patch(`/documents/${id}/access`, {}, { headers: { cookie: cookieStore.toString() } });
  } catch (error) {
    console.error('Error touching document access:', error);
  }
};
