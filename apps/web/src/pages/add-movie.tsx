import { GetStaticProps } from 'next';

import { AddMovieForm } from '@/modules/addMovie/components/AddMovieForm';
import { getServerTranslations } from '@/utils/server';

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
      ...(await getServerTranslations(locale, ['add-movie'])),
    },
  };
};
