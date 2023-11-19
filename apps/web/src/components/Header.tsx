import React from 'react';

import Link from 'next/link';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';

import { ROUTES } from '@/constants/routes';
import { useUser } from '@/modules/auth/api/queries/useUser';
import { UserMenu } from '@/modules/auth/components/UserMenu';
import { cn } from '@/utils';

import { Button } from './ui/Button';

export function Header() {
  const router = useRouter();
  const { t } = useTranslation('common');

  const { data: user } = useUser();

  return (
    <div className="container flex items-center">
      <div className="flex gap-5">
        <Link
          className={cn('px-1 py-3 text-4xl text-black', {
            'bg-zinc-300': router.pathname === ROUTES.browseMovies,
          })}
          href={ROUTES.browseMovies}
        >
          {t('header.browse')}
        </Link>
        <Link
          className={cn('px-1 py-3 text-4xl text-black', {
            'bg-zinc-300': router.pathname === ROUTES.addMovie,
          })}
          href={ROUTES.addMovie}
        >
          {t('header.addMovie')}
        </Link>
      </div>

      <div className="ml-auto mr-3 flex gap-5 text-2xl">
        {!user && (
          <div>
            <Link href={ROUTES.login}>
              <Button>Login</Button>
            </Link>
          </div>
        )}

        {user && <UserMenu user={user} />}

        <div>
          <Link
            className={cn({ 'font-bold': router.locale === 'en' })}
            href={router.pathname}
            locale="en"
          >
            EN
          </Link>
          /
          <Link
            className={cn({ 'font-bold': router.locale === 'pl' })}
            href={router.pathname}
            locale="pl"
          >
            PL
          </Link>
        </div>
      </div>
    </div>
  );
}
