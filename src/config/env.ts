import { z } from "zod";

const isProduction = process.env.NODE_ENV === "production";

// Local defaults only outside production, where a missing variable must fail loudly.
const withDevDefault = (value: string | undefined, devDefault: string) =>
  value ?? (isProduction ? undefined : devDefault);

const envSchema = z.object({
  NEXT_PUBLIC_API_URL: z.url(),
  NEXT_PUBLIC_AUTH_URL: z.url(),
  NEXT_PUBLIC_APP_URL: z.url(),
  NEXT_PUBLIC_PAYPAL_CLIENT_ID: z.string().min(1),
});

// Next inlines NEXT_PUBLIC_* only when written literally, so this is the one place that reads them.
const parsed = envSchema.parse({
  NEXT_PUBLIC_API_URL: withDevDefault(process.env.NEXT_PUBLIC_API_URL, "http://localhost:3001"),
  NEXT_PUBLIC_AUTH_URL: withDevDefault(process.env.NEXT_PUBLIC_AUTH_URL, "http://localhost:3001"),
  NEXT_PUBLIC_APP_URL: withDevDefault(process.env.NEXT_PUBLIC_APP_URL, "http://localhost:3000"),
  // "sb" is PayPal's shared sandbox client.
  NEXT_PUBLIC_PAYPAL_CLIENT_ID: withDevDefault(process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID, "sb"),
});

export const env = {
  apiUrl: parsed.NEXT_PUBLIC_API_URL,
  authUrl: parsed.NEXT_PUBLIC_AUTH_URL,
  appUrl: parsed.NEXT_PUBLIC_APP_URL,
  paypalClientId: parsed.NEXT_PUBLIC_PAYPAL_CLIENT_ID,
} as const;
