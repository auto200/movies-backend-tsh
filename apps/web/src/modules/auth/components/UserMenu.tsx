import React from 'react';

import { useTranslation } from 'next-i18next';

import { BasicUserInfo } from '@movies/shared/communication';

import { Button } from '@/components/ui/Button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/DropdownMenu';

import { useLogout } from '../api/mutations/useLogout';

type UserMenuProps = {
  user: BasicUserInfo;
};

export function UserMenu({ user }: UserMenuProps) {
  const { mutate: logout } = useLogout();
  const { t } = useTranslation();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="min-w-[100px] px-4" variant="outline">
          {user.username}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={() => logout()}>{t('userMenu.logout')}</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
