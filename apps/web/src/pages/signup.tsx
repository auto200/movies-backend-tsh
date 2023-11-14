import { GetStaticProps } from 'next';

import { SignupForm } from '@/modules/auth/SignupForm';
import { getServerTranslations } from '@/utils/server';

function SignupPage() {
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
