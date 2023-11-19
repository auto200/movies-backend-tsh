import { useEffect } from 'react';

import { useRouter } from 'next/router';

import { ROUTES, Route } from '@/constants/routes';

import { useUser } from '../api/queries/useUser';

export function useRedirectLoggedUser(route: Route = ROUTES.browseMovies) {
  const { data: user } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!user) return;

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    router.replace(route);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);
}
