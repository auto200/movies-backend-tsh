import { GetStaticProps } from 'next';

import { AddMovieForm } from '@/modules/addMovie/components/AddMovieForm';
import { getServerTranslations } from '@/utils/server';
import { useUser } from '@/modules/auth/api/queries/useUser';
import { ROUTES } from '@/constants/routes';
import { useTranslation } from 'next-i18next';
import { BaseLink } from '@/components/BaseLink';

export default function AddMoviePage() {
  const { t } = useTranslation('add-movie');

  const { data: user } = useUser();

  if (!user) {
    return (
      <div className="py-5">
        <div className="text-xl">{t('nonLoggedIn.prompt')}</div>
        <div className="mt-2 text-2xl">
          <BaseLink href={ROUTES.login}>{t('nonLoggedIn.login')}</BaseLink> {t('nonLoggedIn.or')}{' '}
          <BaseLink href={ROUTES.signup}>{t('nonLoggedIn.register')}</BaseLink>
        </div>
      </div>
    );
  }

  return (
    <div>
      <AddMovieForm />
    </div>
  );
}

export const getStaticProps: GetStaticProps = async ({ locale = 'en' }) => {
  return {
    props: {
      ...(await getServerTranslations(locale, ['add-movie'])),
    },
  };
};
