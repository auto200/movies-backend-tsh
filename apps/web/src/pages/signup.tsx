import { GetStaticProps } from 'next';

import { SignupForm } from '@/modules/auth/components/SignupForm';
import { useRedirectLoggedUser } from '@/modules/auth/hooks/useRedirectLoggedUser';
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
