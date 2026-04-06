import { cookies } from "next/headers";

async function fetchWithAuth(url: string, options?: RequestInit): Promise<any> {
  const cookieStore = await cookies()
  const response = await fetch(url, {
    ...options,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
      cookie: cookieStore.toString(),
    },
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`HTTP error! status: ${response.status}, body: ${text}`);
  }

  return response.json();
}

export { fetchWithAuth };
