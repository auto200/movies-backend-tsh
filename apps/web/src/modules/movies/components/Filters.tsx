import { useMemo } from 'react';

import { DevTool } from '@hookform/devtools';
import { useFormContext } from 'react-hook-form';

import { FilterFormData, FiltersMetadata } from '../schema';

type FiltersProps = {
  data: FiltersMetadata;
  onReset: () => void;
};

// NOTE: not really robust solution, values could be rounded - not needed for now
const minMaxToTimeOptions = (times: FiltersMetadata['times']) => {
  const timeOptions: number[] = [];

  for (let i = times.min; i <= times.max; i += 10) {
    timeOptions.push(i);
  }

  return timeOptions;
};

export function Filters({ data, onReset }: FiltersProps) {
  const {
    control,
    formState: { isDirty },
    register,
  } = useFormContext<FilterFormData>();

  const timeOptions = useMemo(() => minMaxToTimeOptions(data.times), [data.times]);

  return (
    <>
      <form>
        Genres:
        <div>
          <select multiple {...register('genres')} style={{ height: 200, width: 150 }}>
            {data.genres.map((genre) => (
              <option key={genre} value={genre}>
                {genre}
              </option>
            ))}
          </select>
        </div>
        <div>
          <p>Duration:</p>
          <select {...register('duration')}>
            <option value="">-</option>
            {timeOptions.map((time) => (
              <option key={time} value={time}>
                {time}
              </option>
            ))}
          </select>
          {/* <input
            type="number"
            min={0}
            {...register("duration", {
              setValueAs: (v) =>
                v === "" ? undefined : Number.parseInt(v, 10),
            })}
          /> */}
        </div>
        <button disabled={!isDirty} onClick={onReset}>
          reset
        </button>
      </form>
      <DevTool control={control} />
    </>
  );
}
