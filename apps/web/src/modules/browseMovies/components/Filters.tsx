import { ChangeEvent, MouseEvent, useMemo } from 'react';

import { useTranslation } from 'next-i18next';

import { NO_VALUE, useFilters } from '../hooks/useFilters';
import { FiltersMetadata } from '../schema';

type FiltersProps = {
  data: FiltersMetadata;
};

// NOTE: not really robust solution, values could be rounded - not needed for now
const minMaxToTimeOptions = (times: FiltersMetadata['times']) => {
  const timeOptions: number[] = [];

  for (let i = times.min; i <= times.max; i += 10) {
    timeOptions.push(i);
  }

  return timeOptions;
};

export function Filters({ data }: FiltersProps) {
  const {
    filters: { duration, genres: selectedGenres },
    isAnyFilterActive,
    reset,
    setDuration,
    setGenres,
  } = useFilters();

  const { t } = useTranslation('browse-movies');

  const selectedDuration = duration ?? NO_VALUE;
  const timeOptions = useMemo(() => minMaxToTimeOptions(data.times), [data.times]);

  const handleGenresChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const options = e.target.options;
    const newGenres = [...options].filter((opt) => opt.selected).map((opt) => opt.value);

    setGenres(newGenres);
  };

  const handleDurationChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const duration = e.target.value;
    if (duration === NO_VALUE) return setDuration(NO_VALUE);

    const durationAsNumber = Number.parseInt(duration);
    setDuration(Number.isNaN(durationAsNumber) ? NO_VALUE : durationAsNumber);
  };

  const handleReset = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    reset();
  };

  return (
    <>
      <form>
        <p>{t('genres')}:</p>

        <div>
          <select
            multiple
            onChange={handleGenresChange}
            style={{ height: 200, width: 150 }}
            value={selectedGenres}
          >
            {data.genres.map((genre) => (
              <option key={genre} value={genre}>
                {genre}
              </option>
            ))}
          </select>
        </div>

        <div>
          <p>{t('duration')}:</p>
          <select onChange={handleDurationChange} value={selectedDuration}>
            <option value={NO_VALUE}>-</option>
            {timeOptions.map((time) => (
              <option key={time} value={time}>
                {time}
              </option>
            ))}
          </select>
        </div>

        <button disabled={!isAnyFilterActive} onClick={handleReset} type="reset">
          {t('reset')}
        </button>
      </form>
    </>
  );
}
