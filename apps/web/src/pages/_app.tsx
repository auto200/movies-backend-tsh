import type { AppProps } from 'next/app';
import { appWithTranslation } from 'next-i18next';

import { AppErrorBoundary } from '@/components/AppErrorBoundary';
import { MainLayout } from '@/layouts/MainLayout';
import { QueryProvider } from '@/providers/queryProvider';
import { NextPageWithLayout } from '@/typings/NextPageWithLayout';

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};
function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout = Component.getLayout ?? ((page) => <MainLayout>{page}</MainLayout>);

  return (
    <QueryProvider>
      <AppErrorBoundary>{getLayout(<Component {...pageProps} />)}</AppErrorBoundary>
    </QueryProvider>
  );
}

// explicit type declaration fixes typescript error:
// https://github.com/microsoft/TypeScript/issues/47663#issuecomment-1519138189
const translatedApp: ReturnType<typeof appWithTranslation> = appWithTranslation(MyApp);

export default translatedApp;
