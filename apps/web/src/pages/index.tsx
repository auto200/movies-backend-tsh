import { useState } from 'react';

import { GetStaticProps } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import { Label } from '@/components/ui/Label';
import { Switch } from '@/components/ui/Switch';
import { useBrowseMovies, useFiltersMetadata } from '@/modules/browseMovies/api/queries';
import { Filters } from '@/modules/browseMovies/components';
import { useFilters } from '@/modules/browseMovies/hooks/useFilters';

export default function BrowsePage() {
  const [isUsingSearchEngine, setIsUsingSearchEngine] = useState(true);
  const { filters } = useFilters();
  const { data: movies } = useBrowseMovies(filters, isUsingSearchEngine);
  const { data: filtersMetadata } = useFiltersMetadata();

  const { t } = useTranslation('browse-movies');

  return (
    <div>
      {filtersMetadata && <Filters data={filtersMetadata} />}
      <div className="mt-2 flex items-center">
        <Switch
          checked={isUsingSearchEngine}
          id="use-search-engine"
          onCheckedChange={() => setIsUsingSearchEngine(!isUsingSearchEngine)}
        />
        <Label className="ml-2" htmlFor="use-search-engine">
          {t('useSearchEngine')}
        </Label>
      </div>

      {movies?.map((movie) => (
        <div key={movie.id}>
          <h1>
            {movie.title} - {movie.year}
          </h1>
          <object className="w-[250px]" data={movie.posterUrl} type="image/jpg">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              alt="poster not found"
              className="w-[250px]"
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Question_mark_%28black%29.svg/800px-Question_mark_%28black%29.svg.png"
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
      ...(await serverSideTranslations(locale, ['common', 'browse-movies'])),
    },
  };
};
