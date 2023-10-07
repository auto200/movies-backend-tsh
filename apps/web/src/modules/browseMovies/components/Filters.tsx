import { ChangeEvent, MouseEvent, useMemo } from 'react';

import { useTranslation } from 'next-i18next';

import { Button } from '@/components/ui/Button';
import { Label } from '@/components/ui/Label';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/Select';

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

  const handleDurationChange = (duration: string) => {
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
      <form className="flex flex-col gap-4">
        <div>
          <Label htmlFor="genres-select">{t('genres')}:</Label>

          <div>
            <select
              multiple
              id="genres-select"
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
        </div>

        <div>
          <Label htmlFor="duration-select">{t('duration')}</Label>

          <Select onValueChange={handleDurationChange} value={selectedDuration.toString()}>
            <SelectTrigger className="w-[180px]" id="duration-select">
              <SelectValue placeholder={t('duration')} />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value={NO_VALUE}>-</SelectItem>
                {timeOptions.map((time) => (
                  <SelectItem key={time} value={time.toString()}>
                    {time}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <Button
          className="w-[100px]"
          disabled={!isAnyFilterActive}
          onClick={handleReset}
          type="reset"
        >
          {t('reset')}
        </Button>
      </form>
    </>
  );
}
