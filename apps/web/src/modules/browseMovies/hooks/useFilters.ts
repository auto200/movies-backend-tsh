import { useMemo } from 'react';

import { useRouter, useSearchParams } from 'next/navigation';

import { GetMovieSearchFilters } from '../schema';

const PARAM_NAMES = {
  duration: 'duration',
  genres: 'genres',
};

export const NO_VALUE = '#!NO_VALUE!#';

type UseFiltersResult = {
  filters: GetMovieSearchFilters;
  isAnyFilterActive: boolean;
  reset: () => void;
  setDuration: (duration: number | typeof NO_VALUE) => void;
  setGenres: (genres: string[]) => void;
};

export function useFilters(): UseFiltersResult {
  const router = useRouter();
  const searchParams = useSearchParams();

  const genres = searchParams.getAll(PARAM_NAMES.genres);
  const duration = decodeDuration(searchParams.get(PARAM_NAMES.duration));

  const isAnyFilterActive = genres.length > 0 || duration !== undefined;

  const setUrlState = (newSearchParams: URLSearchParams) => {
    const paramString = newSearchParams.toString();

    router.push(paramString.length > 0 ? `?${paramString}` : '');
  };

  const setGenres = (genres: string[]) => {
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.delete(PARAM_NAMES.genres);

    for (const genre of genres) {
      newSearchParams.append(PARAM_NAMES.genres, genre);
    }

    setUrlState(newSearchParams);
  };

  const setDuration = (duration: number | typeof NO_VALUE) => {
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.delete(PARAM_NAMES.duration);

    if (duration === NO_VALUE) {
      return setUrlState(newSearchParams);
    }

    newSearchParams.set(PARAM_NAMES.duration, duration.toString());
    setUrlState(newSearchParams);
  };

  const reset = () => {
    const newSearchParams = new URLSearchParams(searchParams);

    // delete only these params that we manage
    for (const param of Object.values(PARAM_NAMES)) {
      newSearchParams.delete(param);
    }

    setUrlState(newSearchParams);
  };
  // We stringify objects to get stable reference and not trigger infinite loop
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const filters = useMemo(() => ({ duration, genres }), [duration, JSON.stringify(genres)]);

  return { filters, isAnyFilterActive, reset, setDuration, setGenres };
}

function decodeDuration(duration: string | null): number | undefined {
  const durationAsNumber = Number.parseInt(String(duration));

  return Number.isNaN(durationAsNumber) ? undefined : durationAsNumber;
}
