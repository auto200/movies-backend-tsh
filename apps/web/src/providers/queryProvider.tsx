import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const client = new QueryClient({
  defaultOptions: { queries: { staleTime: Infinity } },
});

type QueryProviderProps = { children: React.ReactNode };

export function QueryProvider({ children }: QueryProviderProps) {
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}
