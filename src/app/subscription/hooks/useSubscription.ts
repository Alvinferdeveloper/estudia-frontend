import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

export type SubscriptionPlan = 'free' | 'basic' | 'pro' | 'enterprise';

export interface Subscription {
  id: string;
  userId: string;
  plan: SubscriptionPlan;
  isActive: boolean;
  currentPeriodStart: string | null;
  currentPeriodEnd: string | null;
  chatMessagesUsed: number;
  chatMessagesLimit: number;
  aiNotesUsed: number;
  aiNotesLimit: number;
  documentsLimit: number;
  storageLimitBytes: number;
  hasSemanticSearch: boolean;
  hasVectorization: boolean;
  hasAdvancedModels: boolean;
  hasExportNotes: boolean;
  hasApiAccess: boolean;
}

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
  features: {
    semanticSearch: boolean;
    vectorization: boolean;
    advancedModels: boolean;
    exportNotes: boolean;
    apiAccess: boolean;
  };
}

export interface Plan {
  plan: SubscriptionPlan;
  name: string;
  price: number;
  description: string;
  features: string[];
  isPopular?: boolean;
}

export interface PlansResponse {
  plans: Plan[];
  currentPlan: SubscriptionPlan;
}

export interface CreateOrderResponse {
  orderId: string;
  approvalUrl: string;
  paymentId: string;
}

export interface CreateSubscriptionResponse {
  subscriptionId: string;
  approvalUrl: string;
  paymentId: string;
}

const fetchSubscription = async (): Promise<Subscription> => {
  const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/subscriptions`, {
    withCredentials: true,
  });
  return data;
};

const fetchUsage = async (): Promise<UsageStats> => {
  const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/subscriptions/usage`, {
    withCredentials: true,
  });
  return data;
};

const fetchPlans = async (): Promise<PlansResponse> => {
  const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/subscriptions/plans`, {
    withCredentials: true,
  });
  return data;
};

const updatePlan = async (plan: SubscriptionPlan): Promise<Subscription> => {
  const { data } = await axios.post(
    `${process.env.NEXT_PUBLIC_API_URL}/subscriptions/update-plan`,
    { plan },
    { withCredentials: true }
  );
  return data;
};

const createPaymentOrder = async (plan: SubscriptionPlan): Promise<CreateOrderResponse> => {
  const { data } = await axios.post(
    `${process.env.NEXT_PUBLIC_API_URL}/payments/create-order`,
    { plan },
    { withCredentials: true }
  );
  return data;
};

const createSubscription = async (plan: SubscriptionPlan): Promise<CreateSubscriptionResponse> => {
  const { data } = await axios.post(
    `${process.env.NEXT_PUBLIC_API_URL}/payments/create-subscription`,
    { plan },
    { withCredentials: true }
  );
  return data;
};

const capturePayment = async (paymentId: string): Promise<any> => {
  const { data } = await axios.post(
    `${process.env.NEXT_PUBLIC_API_URL}/payments/activate-subscription/${paymentId}`,
    {},
    { withCredentials: true }
  );
  return data;
};

export const useSubscription = () => {
  return useQuery<Subscription, Error>({
    queryKey: ['subscription'],
    queryFn: fetchSubscription,
  });
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

export const useUpdatePlan = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updatePlan,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscription'] });
      queryClient.invalidateQueries({ queryKey: ['subscription-plans'] });
      queryClient.invalidateQueries({ queryKey: ['usage'] });
    },
  }, queryClient);
};

export const useCreatePaymentOrder = () => {
  return useMutation({
    mutationFn: createPaymentOrder,
  });
};

export const useCreateSubscription = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createSubscription,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscription'] });
      queryClient.invalidateQueries({ queryKey: ['subscription-plans'] });
      queryClient.invalidateQueries({ queryKey: ['usage'] });
    },
  }, queryClient);
};

export const useCapturePayment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: capturePayment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscription'] });
      queryClient.invalidateQueries({ queryKey: ['subscription-plans'] });
      queryClient.invalidateQueries({ queryKey: ['usage'] });
    },
  }, queryClient);
};
