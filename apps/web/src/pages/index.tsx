import { GetStaticProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import { useMovies, useFiltersMetadata } from '@/modules/movies/api/queries';
import { Filters } from '@/modules/movies/components';
import { useFilters } from '@/modules/movies/hooks/useFilters';

export default function Page() {
  const { filters } = useFilters();
  const { data: movies } = useMovies(filters);
  const { data: filtersMetadata } = useFiltersMetadata();

  return (
    <div>
      {filtersMetadata && <Filters data={filtersMetadata} />}

      {movies?.map((movie) => (
        <div key={movie.id}>
          <h1>
            {movie.title} - {movie.year}
          </h1>
          <object data={movie.posterUrl} style={{ width: 250 }} type="image/jpg">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              alt="poster not found"
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Question_mark_%28black%29.svg/800px-Question_mark_%28black%29.svg.png"
              style={{ width: 250 }}
            />
          </object>
          <p>
            <b>{movie.director}</b> - {movie.genres.join(', ')}
          </p>
          <p>{movie.plot}</p>
        </div>
      ))}
    </div>
  );
}

export const getStaticProps: GetStaticProps = async ({ locale = 'en' }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
};
