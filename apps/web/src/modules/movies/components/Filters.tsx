import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { DevTool } from "@hookform/devtools";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/router";

import { FilterFormData, filterFormSchema } from "../types";

type FiltersProps = {
  movieGenres: string[];
  onSubmit: (data: FilterFormData) => void;
};
const filterFormDefaultValues: FilterFormData = {};

export function Filters({ movieGenres, onSubmit }: FiltersProps) {
  const router = useRouter();
  const params = useSearchParams();

  const {
    register,
    handleSubmit: submitForm,
    control,
    setValue,
    getValues,
  } = useForm<FilterFormData>({
    resolver: zodResolver(filterFormSchema),
    defaultValues: filterFormDefaultValues,
  });

  const handleSubmit = (data: FilterFormData) => {
    const { duration, ...restParams } = { ...router.query, ...getValues() };
    // remove duration from query if it's undefined
    router.replace({
      query: { ...restParams, ...(duration && { duration }) },
    });

    onSubmit(data);
  };

  useEffect(() => {
    const genres = params.getAll("genres");
    const duration = params.get("duration");

    if (genres) setValue("genres", genres);
    if (duration) setValue("duration", Number.parseInt(duration));

    submitForm(onSubmit)();
  }, []);

  return (
    <>
      <form onSubmit={submitForm(handleSubmit)}>
        Filters: Genres:
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
        <button type="submit">Apply</button>
      </form>
      <DevTool control={control} />
    </>
  );
}
