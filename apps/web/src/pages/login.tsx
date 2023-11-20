import { GetStaticProps } from 'next';

import { LoginForm } from '@/modules/auth/components/LoginForm';
import { useRedirectLoggedUser } from '@/modules/auth/hooks/useRedirectLoggedUser';
import { getServerTranslations } from '@/utils/server';

function LoginPage() {
  useRedirectLoggedUser();

  return <LoginForm />;
}

export default LoginPage;

export const getStaticProps: GetStaticProps = async ({ locale = 'en' }) => {
  return {
    props: {
      ...(await getServerTranslations(locale, ['login'])),
    },
  };
};
