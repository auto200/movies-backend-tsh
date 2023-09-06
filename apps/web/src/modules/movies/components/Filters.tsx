import { useFormContext } from "react-hook-form";
import { DevTool } from "@hookform/devtools";

import { FilterFormData, FiltersMetadata } from "../schema";
import { useMemo } from "react";

type FiltersProps = {
  data: FiltersMetadata;
  onReset: () => void;
};

// NOTE: not really robust solution, values could be rounded - not needed for now
const minMaxToTimeOptions = (times: FiltersMetadata["times"]) => {
  const timeOptions: number[] = [];

  for (let i = times.min; i <= times.max; i += 10) {
    console.log("xd");
    timeOptions.push(i);
  }

  return timeOptions;
};

export function Filters({ data, onReset }: FiltersProps) {
  const {
    register,
    control,
    formState: { isDirty },
  } = useFormContext<FilterFormData>();

  const timeOptions = useMemo(
    () => minMaxToTimeOptions(data.times),
    [data.times]
  );

  return (
    <>
      <form>
        Genres:
        <div>
          <select
            multiple
            {...register("genres")}
            style={{ width: 150, height: 200 }}
          >
            {data.genres.map((genre) => (
              <option key={genre} value={genre}>
                {genre}
              </option>
            ))}
          </select>
        </div>
        <div>
          <p>Duration:</p>
          <select {...register("duration")}>
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
        <button onClick={onReset} disabled={!isDirty}>
          reset
        </button>
      </form>
      <DevTool control={control} />
    </>
  );
}
