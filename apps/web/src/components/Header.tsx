import React from 'react';

import Link from 'next/link';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';

import { ROUTES } from '@/constants/routes';
import { cn } from '@/utils';

export function Header() {
  const router = useRouter();
  const { t } = useTranslation('common');

  return (
    <div className="container flex items-center">
      <div className="flex gap-5">
        <Link
          className={cn('p-3 text-4xl text-black', {
            'bg-zinc-300': router.pathname === ROUTES.browseMovies,
          })}
          href={ROUTES.browseMovies}
        >
          {t('header.browse')}
        </Link>
        <Link
          className={cn('p-3 text-4xl text-black', {
            'bg-zinc-300': router.pathname === ROUTES.addMovie,
          })}
          href={ROUTES.addMovie}
        >
          {t('header.addMovie')}
        </Link>
      </div>

      <div className="ml-auto mr-3 text-2xl">
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
  );
}
