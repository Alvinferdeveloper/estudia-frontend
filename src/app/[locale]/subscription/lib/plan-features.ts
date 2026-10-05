import type referenceMessages from "@/messages/es";
import type { Plan, PlanFeatures, PlanLimits, SubscriptionPlan } from "../hooks/useSubscription";

export type PlanFeatureKey = keyof typeof referenceMessages.subscription.features;

export interface PlanFeatureItem {
  key: PlanFeatureKey;
  count?: number;
  storageBytes?: number;
}

const UNLIMITED = -1;

type CountedLimit = Exclude<keyof PlanLimits, "storageBytes">;

const COUNTED_LIMITS: Record<CountedLimit, { limited: PlanFeatureKey; unlimited: PlanFeatureKey }> = {
  documents: { limited: "documents", unlimited: "documentsUnlimited" },
  chatMessages: { limited: "chatMessages", unlimited: "chatMessagesUnlimited" },
  aiNotes: { limited: "aiNotes", unlimited: "aiNotesUnlimited" },
};

const FLAG_FEATURES = [
  "semanticSearch",
  "vectorization",
  "advancedModels",
  "exportNotes",
  "apiAccess",
] as const satisfies readonly (keyof PlanFeatures & PlanFeatureKey)[];

// Perks with no backing column in the plan table.
const PLAN_EXTRAS: Partial<Record<SubscriptionPlan, PlanFeatureKey[]>> = {
  enterprise: ["prioritySupport"],
};

export const getPlanFeatureItems = ({ plan, limits, features }: Plan): PlanFeatureItem[] => [
  ...(Object.keys(COUNTED_LIMITS) as CountedLimit[]).map((name): PlanFeatureItem => {
    const count = limits[name];
    const keys = COUNTED_LIMITS[name];
    return count === UNLIMITED ? { key: keys.unlimited } : { key: keys.limited, count };
  }),
  { key: "storage", storageBytes: limits.storageBytes },
  ...FLAG_FEATURES.filter((flag) => features[flag]).map((key) => ({ key })),
  ...(PLAN_EXTRAS[plan] ?? []).map((key) => ({ key })),
];

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
