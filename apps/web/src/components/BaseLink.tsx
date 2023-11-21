import React, { ComponentProps } from 'react';

import Link from 'next/link';

import { cn } from '@/utils';

type BaseLinkProps = ComponentProps<typeof Link>;

export function BaseLink({ children, className, ...props }: BaseLinkProps) {
  return (
    <Link {...props} className={cn('font-medium text-blue-500 hover:underline', className)}>
      {children}
    </Link>
  );
}
