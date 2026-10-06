import { QueryClient, useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api-client';

export type SubscriptionPlan = 'free' | 'basic' | 'pro' | 'enterprise';

export interface UsageStats {
  plan: SubscriptionPlan;
  isActive: boolean;
  chat: {
    used: number;
    limit: number;
    remaining: number;
  };
  aiNotes: {
    used: number;
    limit: number;
    remaining: number;
  };
  documents: {
    limit: number;
  };
  storage: {
    limit: number;
  };
  features: PlanFeatures;
}

export interface PlanFeatures {
  semanticSearch: boolean;
  vectorization: boolean;
  advancedModels: boolean;
  exportNotes: boolean;
  apiAccess: boolean;
}

// A limit of -1 means unlimited.
export interface PlanLimits {
  chatMessages: number;
  aiNotes: number;
  documents: number;
  storageBytes: number;
}

export interface Plan {
  plan: SubscriptionPlan;
  price: number;
  isPopular?: boolean;
  limits: PlanLimits;
  features: PlanFeatures;
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
  const { data } = await api.get('/subscriptions/usage');
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
