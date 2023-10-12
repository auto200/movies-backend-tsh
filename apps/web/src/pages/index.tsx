import { useState } from 'react';

import { RefreshCw } from 'lucide-react';
import { GetStaticProps } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import { BasicTooltip } from '@/components/ui/BasicTooltip';
import { Button } from '@/components/ui/Button';
import { Label } from '@/components/ui/Label';
import { Switch } from '@/components/ui/Switch';
import { useBrowseMovies } from '@/modules/browseMovies/api/queries/useBrowseMovies';
import { useFiltersMetadata } from '@/modules/browseMovies/api/queries/useFiltersMetadata';
import { Filters } from '@/modules/browseMovies/components/Filters';
import { MovieCard } from '@/modules/browseMovies/components/MovieCard';
import { useFilters } from '@/modules/browseMovies/hooks/useFilters';

export default function BrowsePage() {
  const [isUsingSearchEngine, setIsUsingSearchEngine] = useState(true);
  const { filters, isAnyFilterActive } = useFilters();
  const { data: movies, refetch: refetchMovies } = useBrowseMovies(filters, isUsingSearchEngine);
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

      {!isAnyFilterActive && (
        <p className="relative my-10 text-center text-4xl">
          <>
            {t('randomMovie')}
            <BasicTooltip content={t('getAnotherRandomMovie')}>
              <Button
                className="absolute top-0 ml-2"
                // eslint-disable-next-line @typescript-eslint/no-misused-promises
                onClick={() => refetchMovies()}
                variant="ghost"
              >
                <RefreshCw />
              </Button>
            </BasicTooltip>
          </>
        </p>
      )}

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
