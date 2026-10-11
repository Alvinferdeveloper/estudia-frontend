import type referenceMessages from "@/messages/es";
import type { Plan, SubscriptionPlan } from "../hooks/useSubscription";
import { PLAN_FEATURES, UNLIMITED, type CreditPeriod } from "./entitlements";

export type PlanFeatureKey = keyof typeof referenceMessages.subscription.features;

export interface PlanFeatureItem {
  key: PlanFeatureKey;
  count?: number;
  storageBytes?: number;
  // Listed even when missing, so plans compare row by row.
  included: boolean;
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

// Perks with no entitlement behind them, and the plans that include each.
const PLAN_PERKS: Partial<Record<PlanFeatureKey, SubscriptionPlan[]>> = {
  prioritySupport: ["enterprise"],
};

const limitItem = (value: number, keys: LimitKeys, field: "count" | "storageBytes" = "count"): PlanFeatureItem =>
  value === UNLIMITED ? { key: keys.unlimited, included: true } : { key: keys.limited, [field]: value, included: true };

// Every plan returns the same rows in the same order. Feature keys double as message keys,
// so a plan feature without copy fails type-checking.
export const getPlanFeatureItems = ({ plan, entitlements }: Plan): PlanFeatureItem[] => {
  const { credits, quotas, caps, features } = entitlements;
  return [
    limitItem(credits.amount, CREDIT_KEYS[credits.period]),
    limitItem(quotas.documents, DOCUMENT_KEYS),
    limitItem(quotas.storageBytes, STORAGE_KEYS, "storageBytes"),
    limitItem(caps.examQuestions, EXAM_KEYS),
    ...PLAN_FEATURES.map((key): PlanFeatureItem => ({ key, included: features.includes(key) })),
    ...Object.entries(PLAN_PERKS).map(([key, plans]): PlanFeatureItem => ({
      key: key as PlanFeatureKey,
      included: plans.includes(plan),
    })),
  ];
};
