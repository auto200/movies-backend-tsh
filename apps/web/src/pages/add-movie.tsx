import { GetStaticProps } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import { AddMovieForm } from '@/modules/addMovie/components/AddMovieForm';

export default function AddMoviePage() {
  const { t } = useTranslation('add-movie');

  return (
    <div>
      <p>{t('form.title')}</p>
      <AddMovieForm />
    </div>
  );
}

export const getStaticProps: GetStaticProps = async ({ locale = 'en' }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common', 'add-movie'])),
    },
  };
};
