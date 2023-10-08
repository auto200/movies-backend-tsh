import { GetStaticProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import { AddMovieForm } from '@/modules/addMovie/components/AddMovieForm';

export default function AddMoviePage() {
  return (
    <div>
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
