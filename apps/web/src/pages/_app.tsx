import type { AppProps } from "next/app";

import { QueryProvider } from "@/providers/queryProvider";

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <QueryProvider>
      <Component {...pageProps} />
    </QueryProvider>
  );
}
