import React from 'react';

import Link from 'next/link';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';

import { ROUTES } from '@/constants/routes';
import { useIsMounted } from '@/hooks/useIsMounted';

function getLocaleStyles(isActive: boolean): React.CSSProperties {
  return {
    ...(isActive && {
      fontWeight: 'bold',
    }),
    color: 'black',
    textDecoration: 'none',
  };
}
function getRouteStyles(isActive: boolean): React.CSSProperties {
  return {
    ...(isActive && {
      backgroundColor: 'lightGray',
    }),
    color: 'black',
    fontSize: '2rem',
    padding: 10,
    textDecoration: 'none',
  };
}

export const Header = () => {
  const router = useRouter();
  const { t } = useTranslation('common');

  const isMounted = useIsMounted();

  return (
    <div style={{ display: 'flex' }}>
      <div style={{ display: 'flex', gap: 20 }}>
        <Link
          href={ROUTES.browseMovies}
          style={getRouteStyles(isMounted && router.pathname === ROUTES.browseMovies)}
        >
          {t('header.browse')}
        </Link>
        <Link
          href={ROUTES.addMovie}
          style={getRouteStyles(isMounted && router.pathname === ROUTES.addMovie)}
        >
          {t('header.addMovie')}
        </Link>
      </div>

      <div style={{ fontSize: '1.5rem', marginLeft: 'auto', marginRight: 10 }}>
        <Link
          href={router.pathname}
          locale="en"
          style={getLocaleStyles(isMounted && router.locale === 'en')}
        >
          EN
        </Link>
        /
        <Link
          href={router.pathname}
          locale="pl"
          style={getLocaleStyles(isMounted && router.locale === 'pl')}
        >
          PL
        </Link>
      </div>
    </div>
  );
};
