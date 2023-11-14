import { GetStaticProps } from 'next';

import { LoginForm } from '@/modules/auth/LoginForm';
import { getServerTranslations } from '@/utils/server';

function LoginPage() {
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
