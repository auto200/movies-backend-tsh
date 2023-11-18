import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useTranslation } from 'next-i18next';
import { useForm } from 'react-hook-form';

import { Button } from '@/components/ui/Button';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/Form';
import { Input } from '@/components/ui/Input';
import { ROUTES } from '@/constants/routes';

import { useSignup } from './api/mutations/useSignup';
import { SignupFormData, signupFormSchema } from './schema';

export function SignupForm() {
  const { t } = useTranslation('signup');

  const { mutate: signup } = useSignup();

  const form = useForm<SignupFormData>({
    resolver: zodResolver(signupFormSchema),
  });

  const { control, handleSubmit } = form;
  const isPending = false;

  function onSubmit(data: SignupFormData) {
    signup(data);
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
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('fields.username.label')}</FormLabel>
                  <FormControl>
                    {/* https://github.com/shadcn-ui/ui/issues/410#issuecomment-1676316957 */}
                    <Input
                      {...field}
                      autoCapitalize="none"
                      autoComplete="username"
                      autoCorrect="off"
                      disabled={isPending}
                      placeholder={t('fields.username.placeholder')}
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
              {t('signupButton')}
            </Button>
          </div>
        </form>
      </Form>

      <div>
        {t('loginPrompt')}{' '}
        <Link className="font-medium text-blue-500 hover:underline" href={ROUTES.login}>
          {t('loginHere')}
        </Link>
      </div>
    </div>
  );
}
