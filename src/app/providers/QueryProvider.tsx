"use client";

import { MutationCache, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode } from 'react';
import { showApiErrorToast } from '@/components/api-error-toast';
import { USAGE_QUERY_KEY } from '@/app/[locale]/subscription/hooks/useSubscription';

const queryClient = new QueryClient({
  // Every failed mutation gets a translated toast, unless it shows its error inline (`meta.inlineError`).
  mutationCache: new MutationCache({
    onError: (error, _variables, _context, mutation) => {
      if (!mutation.meta?.inlineError) showApiErrorToast(error);
    },
    // On failure too: a refused or refunded action still changes what the balance should show.
    onSettled: (_data, _error, _variables, _context, mutation) => {
      if (mutation.meta?.refreshesUsage) queryClient.invalidateQueries({ queryKey: USAGE_QUERY_KEY });
    },
  }),
});

export const QueryProvider = ({ children }: { children: ReactNode }) => {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};
