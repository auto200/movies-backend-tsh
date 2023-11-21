import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'next-i18next';
import { useForm } from 'react-hook-form';

import { Button } from '@/components/ui/Button';
import { FormField, FormItem, FormLabel, FormControl, Form } from '@/components/ui/Form';
import { Input } from '@/components/ui/Input';
import { ROUTES } from '@/constants/routes';

import { useLogin } from '../api/mutations/useLogin';
import { LoginFormData, loginFormSchema } from '../schema';
import { BaseLink } from '@/components/BaseLink';

export function LoginForm() {
  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginFormSchema),
  });

  const { t } = useTranslation('login');

  const { control, handleSubmit } = form;

  const { isPending, mutate: login } = useLogin();

  function onSubmit(data: LoginFormData) {
    login(data);
  }

  return (
    <div className="grid max-w-xl gap-6">
      <Form {...form}>
        {/* rhc quirk */}
        {/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-2">
            <FormField
              control={control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('fields.email.label')}</FormLabel>
                  <FormControl>
                    {/* https://github.com/shadcn-ui/ui/issues/410#issuecomment-1676316957 */}
                    <Input
                      {...field}
                      autoCapitalize="none"
                      autoComplete="email"
                      autoCorrect="off"
                      disabled={isPending}
                      placeholder={t('fields.email.placeholder')}
                      type="email"
                      value={field.value ?? ''}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('fields.password.label')}</FormLabel>
                  <FormControl>
                    {/* https://github.com/shadcn-ui/ui/issues/410#issuecomment-1676316957 */}
                    <Input
                      {...field}
                      autoCapitalize="none"
                      autoComplete="new-password"
                      autoCorrect="off"
                      disabled={isPending}
                      placeholder={t('fields.password.placeholder')}
                      type="password"
                      value={field.value ?? ''}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <Button disabled={isPending}>
              {/* {isLoading && (
                  <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                )} */}
              {t('loginButton')}
            </Button>
          </div>
        </form>
      </Form>

      <div>
        {t('signupPrompt')} <BaseLink href={ROUTES.signup}>{t('signupNow')}</BaseLink>
      </div>
    </div>
  );
}
