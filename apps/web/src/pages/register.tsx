import React, { useState } from 'react';

import { GetStaticProps } from 'next';
import { useTranslation } from 'next-i18next';

import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { getServerTranslations } from '@/utils/server';

function RegisterPage() {
  const { t } = useTranslation('register');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  function onSubmit(event: React.SyntheticEvent) {
    event.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
    }, 3000);
  }

  return (
    <div className="grid max-w-xl gap-6">
      <form onSubmit={onSubmit}>
        <div className="grid gap-2">
          <div className="grid gap-1">
            <Label htmlFor="email">{t('fields.email.label')}</Label>
            <Input
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect="off"
              disabled={isLoading}
              id="email"
              placeholder={t('fields.email.placeholder')}
              type="email"
            />
          </div>

          <div className="grid gap-1">
            <Label htmlFor="username">{t('fields.username.label')}</Label>
            <Input
              autoCapitalize="none"
              autoComplete="username"
              autoCorrect="off"
              disabled={isLoading}
              id="username"
              placeholder={t('fields.username.placeholder')}
              type="username"
            />
          </div>

          <div className="grid gap-1">
            <Label htmlFor="password">{t('fields.password.label')}</Label>
            <Input
              autoCapitalize="none"
              autoComplete="current-password"
              autoCorrect="off"
              disabled={isLoading}
              id="password"
              placeholder={t('fields.password.placeholder')}
              type="password"
            />
          </div>

          <Button disabled={isLoading}>
            {/* {isLoading && (
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              )} */}
            {t('registerButton')}
          </Button>
        </div>
      </form>
    </div>
  );
}
export default RegisterPage;

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await getServerTranslations(locale, ['register'])),
    },
  };
};
