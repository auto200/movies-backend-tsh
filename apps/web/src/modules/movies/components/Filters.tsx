import { useFormContext } from "react-hook-form";
import { DevTool } from "@hookform/devtools";

import { FilterFormData } from "../schema";

type FiltersProps = {
  movieGenres: string[];
  onReset: () => void;
};

export function Filters({ movieGenres, onReset }: FiltersProps) {
  const {
    register,
    control,
    formState: { isDirty },
  } = useFormContext<FilterFormData>();

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
            {movieGenres.map((genre) => (
              <option key={genre} value={genre}>
                {genre}
              </option>
            ))}
          </select>
        </div>
        <div>
          <p>Duration:</p>
          <input
            type="number"
            min={0}
            {...register("duration", {
              setValueAs: (v) =>
                v === "" ? undefined : Number.parseInt(v, 10),
            })}
          />
        </div>
        <button onClick={onReset} disabled={!isDirty}>
          reset
        </button>
      </form>
      <DevTool control={control} />
    </>
  );
}
