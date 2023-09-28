import { QueryErrorResetBoundary } from '@tanstack/react-query';
import { useTranslation } from 'next-i18next';
import { ErrorBoundary, FallbackProps } from 'react-error-boundary';

type AppErrorBoundaryProps = {
  children: React.ReactNode;
};

export function AppErrorBoundary({ children }: AppErrorBoundaryProps) {
  return (
    <QueryErrorResetBoundary>
      {({ reset }) => (
        <ErrorBoundary FallbackComponent={ErrorBoundaryFallback} onReset={reset}>
          {children}
        </ErrorBoundary>
      )}
    </QueryErrorResetBoundary>
  );
}

function ErrorBoundaryFallback({ error, resetErrorBoundary }: FallbackProps) {
  const { t } = useTranslation();
  return (
    <div>
      <div>{t('errorBoundary.title')}</div>
      <details>
        <summary>{t('errorBoundary.details')}</summary>
        {error instanceof Error && (
          <p>
            Error code: {error.name}, message: {error.message}
          </p>
        )}
      </details>
      <button onClick={resetErrorBoundary}>{t('errorBoundary.tryAgain')}</button>
    </div>
  );
}
