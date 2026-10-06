// Mirrors estudia-api's entitlements/catalog.ts: what a plan can grant.

export const UNLIMITED = -1;

export type CreditPeriod = "daily" | "monthly";
export type PlanFeature = "exportNotes";
export type PlanQuota = "documents" | "storageBytes";
export type PlanCap = "examQuestions";

export interface PlanEntitlements {
  credits: { amount: number; period: CreditPeriod };
  features: PlanFeature[];
  // UNLIMITED (-1) means no limit.
  quotas: Record<PlanQuota, number>;
  caps: Record<PlanCap, number>;
}

// Mirrors CREDIT_COSTS['exam.generate'] in estudia-api's catalog.ts, for showing the price up front.
// The API's charge stays authoritative; change both together.
const EXAM_QUESTIONS_PER_CREDIT = 5;

export const examCreditCost = (questions: number): number => Math.ceil(questions / EXAM_QUESTIONS_PER_CREDIT);
