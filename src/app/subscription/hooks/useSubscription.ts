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
