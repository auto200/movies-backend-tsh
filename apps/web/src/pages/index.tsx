import { useState } from 'react';

import { GetStaticProps } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import { Label } from '@/components/ui/Label';
import { Switch } from '@/components/ui/Switch';
import { useBrowseMovies, useFiltersMetadata } from '@/modules/browseMovies/api/queries';
import { Filters, MovieCard } from '@/modules/browseMovies/components';
import { useFilters } from '@/modules/browseMovies/hooks/useFilters';

export default function BrowsePage() {
  const [isUsingSearchEngine, setIsUsingSearchEngine] = useState(true);
  const { filters, isAnyFilterActive } = useFilters();
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
          {t('useAlternativeSearchEngine')}
        </Label>
      </div>

      {!isAnyFilterActive && <p className="my-10 text-center text-4xl ">{t('randomMovie')}</p>}

      <div className="flex flex-col items-center justify-center gap-16 md:flex-row md:flex-wrap">
        {movies?.map((movie) => <MovieCard key={movie.id} movie={movie} />)}
      </div>
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
