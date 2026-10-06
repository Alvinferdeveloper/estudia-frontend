import type { UsageStats } from "../hooks/useSubscription";
import { UNLIMITED } from "./entitlements";

// Share of the credits after which the balance shows as running low.
const LOW_CREDITS_RATIO = 0.8;

export type CreditState = "ok" | "low" | "empty";

export const getCreditState = ({ used, limit }: UsageStats["credits"]): CreditState => {
  if (limit === UNLIMITED) return "ok";
  if (used >= limit) return "empty";
  return used >= limit * LOW_CREDITS_RATIO ? "low" : "ok";
};

// Null when the plan has no credit limit.
export const remainingCredits = ({ used, limit }: UsageStats["credits"]): number | null =>
  limit === UNLIMITED ? null : Math.max(0, limit - used);

export const isQuotaFull = ({ used, limit }: { used: number; limit: number }): boolean =>
  limit !== UNLIMITED && used >= limit;
