import { appConfig } from '@/config/appConfig';

export function authFetch(fetcher: typeof fetch = fetch) {
  return async function tryToFetch(...params: Parameters<typeof fetch>) {
    const resPromise = fetcher(...params);
    const res = await resPromise;

    if (res.status === 401) {
      const tokenRefresh = await fetcher(`${appConfig.NEXT_PUBLIC_API_URL}/v1/auth/refresh-token`, {
        credentials: 'include',
      });

      if (tokenRefresh.ok) {
        return tryToFetch(...params);
      }
    }

    return resPromise;
  };
}
