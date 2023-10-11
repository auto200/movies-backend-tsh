import { MouseEvent, useMemo } from 'react';

import { useTranslation } from 'next-i18next';

import { Button } from '@/components/ui/Button';
import { CheckboxSelectList, Option } from '@/components/ui/CheckboxSelectList';
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
  const genreOptions: Option[] = useMemo(
    () => data.genres.map((genre) => ({ label: genre, value: genre })),
    [data.genres]
  );

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
      <form className="flex max-w-xs flex-col gap-4">
        <div>
          <Label asChild>
            <p>{t('genres')}:</p>
          </Label>

          <CheckboxSelectList
            onChange={setGenres}
            options={genreOptions}
            selected={selectedGenres}
          />
        </div>

        <div>
          <Label htmlFor="duration-select">{t('duration')}</Label>

          <Select onValueChange={handleDurationChange} value={selectedDuration.toString()}>
            <SelectTrigger className="w-40" id="duration-select">
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
          className="w-fit px-8"
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
