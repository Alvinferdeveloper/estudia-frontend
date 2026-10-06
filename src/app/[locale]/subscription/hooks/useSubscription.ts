import { QueryClient, useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import type { CreditPeriod, PlanEntitlements, PlanFeature, PlanQuota } from '../lib/entitlements';

export type SubscriptionPlan = 'free' | 'basic' | 'pro' | 'enterprise';

// GET /usage: the plan in force and how much of it has been used.
export interface UsageStats {
  plan: SubscriptionPlan;
  credits: { used: number; limit: number; period: CreditPeriod; resetsAt: string };
  quotas: Record<PlanQuota, { used: number; limit: number }>;
  features: PlanFeature[];
  caps: PlanEntitlements['caps'];
}

export interface Plan {
  plan: SubscriptionPlan;
  price: number;
  isPopular?: boolean;
  entitlements: PlanEntitlements;
}

export interface PlansResponse {
  plans: Plan[];
  currentPlan: SubscriptionPlan;
}

export interface CreateSubscriptionResponse {
  subscriptionId: string;
  approvalUrl: string;
  paymentId: string;
}

const fetchUsage = async (): Promise<UsageStats> => {
  const { data } = await api.get('/usage');
  return data;
};

const fetchPlans = async (): Promise<PlansResponse> => {
  const { data } = await api.get('/subscriptions/plans');
  return data;
};

const createSubscription = async (plan: SubscriptionPlan): Promise<CreateSubscriptionResponse> => {
  const { data } = await api.post('/payments/create-subscription', { plan });
  return data;
};

const capturePayment = async (paymentId: string): Promise<any> => {
  const { data } = await api.post(`/payments/activate-subscription/${paymentId}`, {});
  return data;
};

export const useUsage = () => {
  return useQuery<UsageStats, Error>({
    queryKey: ['usage'],
    queryFn: fetchUsage,
  });
};

export const usePlans = () => {
  return useQuery<PlansResponse, Error>({
    queryKey: ['subscription-plans'],
    queryFn: fetchPlans,
  });
};

// A plan change affects both the plan list (current plan) and the usage limits.
const invalidateSubscriptionQueries = (queryClient: QueryClient) => {
  queryClient.invalidateQueries({ queryKey: ['subscription-plans'] });
  queryClient.invalidateQueries({ queryKey: ['usage'] });
};

export const useCreateSubscription = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createSubscription,
    meta: { inlineError: true },
    onSuccess: () => invalidateSubscriptionQueries(queryClient),
  });
};

export const useCapturePayment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: capturePayment,
    meta: { inlineError: true },
    onSuccess: () => invalidateSubscriptionQueries(queryClient),
  });
};
