import { GetStaticProps } from 'next';

import { useRedirectLoggedUser } from '@/modules/auth/hooks/useRedirectLoggedUser';
import { SignupForm } from '@/modules/auth/SignupForm';
import { getServerTranslations } from '@/utils/server';

function SignupPage() {
  useRedirectLoggedUser();

  return <SignupForm />;
}

export default SignupPage;

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await getServerTranslations(locale, ['signup'])),
    },
  };
};
