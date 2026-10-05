"use client";

import { MutationCache, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode } from 'react';
import { showApiErrorToast } from '@/components/api-error-toast';

const queryClient = new QueryClient({
  // Every failed mutation gets a translated toast, unless it shows its error inline (`meta.inlineError`).
  mutationCache: new MutationCache({
    onError: (error, _variables, _context, mutation) => {
      if (!mutation.meta?.inlineError) showApiErrorToast(error);
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
