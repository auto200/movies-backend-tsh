import React from 'react';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const client = new QueryClient({
  defaultOptions: {
    mutations: { throwOnError: true },
    queries: { staleTime: Infinity, throwOnError: true },
  },
});

type QueryProviderProps = { children: React.ReactNode };

export function QueryProvider({ children }: QueryProviderProps) {
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}
