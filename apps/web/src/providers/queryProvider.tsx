import React from 'react';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const client = new QueryClient({
  defaultOptions: {
    mutations: { useErrorBoundary: true },
    queries: { staleTime: Infinity, useErrorBoundary: true },
  },
});

type QueryProviderProps = { children: React.ReactNode };

export function QueryProvider({ children }: QueryProviderProps) {
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}
