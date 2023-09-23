import React from 'react';

import Link from 'next/link';
import { useRouter } from 'next/router';

function getLinkStyles(isActive: boolean): React.CSSProperties {
  return {
    color: 'black',
    fontWeight: isActive ? 'bold' : 'normal',
    textDecoration: 'none',
  };
}

export const Header = () => {
  const router = useRouter();

  return (
    <div style={{ display: 'flex' }}>
      <div style={{ fontSize: '1.5rem', marginLeft: 'auto', marginRight: 10 }}>
        <Link href="/" locale="en" style={getLinkStyles(router.locale === 'en')}>
          EN
        </Link>
        /
        <Link href="/" locale="pl" style={getLinkStyles(router.locale === 'pl')}>
          PL
        </Link>
      </div>
    </div>
  );
};
