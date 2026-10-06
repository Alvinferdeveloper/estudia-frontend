import type referenceMessages from "@/messages/es";
import type { Plan, SubscriptionPlan } from "../hooks/useSubscription";
import { UNLIMITED, type CreditPeriod } from "./entitlements";

export type PlanFeatureKey = keyof typeof referenceMessages.subscription.features;

export interface PlanFeatureItem {
  key: PlanFeatureKey;
  count?: number;
  storageBytes?: number;
}

interface LimitKeys {
  limited: PlanFeatureKey;
  unlimited: PlanFeatureKey;
}

const CREDIT_KEYS: Record<CreditPeriod, LimitKeys> = {
  daily: { limited: "creditsDaily", unlimited: "creditsUnlimited" },
  monthly: { limited: "creditsMonthly", unlimited: "creditsUnlimited" },
};
const DOCUMENT_KEYS: LimitKeys = { limited: "documents", unlimited: "documentsUnlimited" };
const STORAGE_KEYS: LimitKeys = { limited: "storage", unlimited: "storageUnlimited" };
const EXAM_KEYS: LimitKeys = { limited: "examQuestions", unlimited: "examQuestionsUnlimited" };

// Perks with no entitlement behind them.
const PLAN_EXTRAS: Partial<Record<SubscriptionPlan, PlanFeatureKey[]>> = {
  enterprise: ["prioritySupport"],
};

const limitItem = (value: number, keys: LimitKeys, field: "count" | "storageBytes" = "count"): PlanFeatureItem =>
  value === UNLIMITED ? { key: keys.unlimited } : { key: keys.limited, [field]: value };

// Feature keys double as message keys, so a plan feature without copy fails type-checking.
export const getPlanFeatureItems = ({ plan, entitlements }: Plan): PlanFeatureItem[] => {
  const { credits, quotas, caps, features } = entitlements;
  return [
    limitItem(credits.amount, CREDIT_KEYS[credits.period]),
    limitItem(quotas.documents, DOCUMENT_KEYS),
    limitItem(quotas.storageBytes, STORAGE_KEYS, "storageBytes"),
    limitItem(caps.examQuestions, EXAM_KEYS),
    ...features.map((key): PlanFeatureItem => ({ key })),
    ...(PLAN_EXTRAS[plan] ?? []).map((key) => ({ key })),
  ];
};

const STORAGE_UNITS = ["megabyte", "gigabyte", "terabyte"] as const;

// Picks the largest binary unit (from MB up) that keeps the value >= 1, for Intl unit formatting.
export const toStorageSize = (bytes: number): { value: number; unit: (typeof STORAGE_UNITS)[number] } => {
  let value = bytes / 1024 ** 2;
  let index = 0;
  while (value >= 1024 && index < STORAGE_UNITS.length - 1) {
    value /= 1024;
    index++;
  }
  return { value, unit: STORAGE_UNITS[index] };
};
