'use server';

import axios from 'axios';
import { cookies } from 'next/headers';

export const getDocument = async (id: string) => {
  try {
    const cookieStore = await cookies();
    const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/documents/${id}`,
      { headers: { cookie: cookieStore.toString() }, withCredentials: true });
    return data;
  } catch (error) {
    console.error('Error fetching document:', error);
    return null;
  }
};
