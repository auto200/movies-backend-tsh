import { GetStaticProps } from 'next';

import { useRedirectLoggedUser } from '@/modules/auth/hooks/useRedirectLoggedUser';
import { LoginForm } from '@/modules/auth/LoginForm';
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
