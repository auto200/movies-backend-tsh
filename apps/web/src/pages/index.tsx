import { useCallback, useEffect } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/router';
import { useForm, FormProvider } from 'react-hook-form';

import { useMovies, useFiltersMetadata } from '@/modules/movies/api/queries';
import { Filters } from '@/modules/movies/components';
import { FilterFormData, filterFormSchema } from '@/modules/movies/schema';

const filterFormDefaultValues: FilterFormData = {};

export default function Page() {
  const formMethods = useForm<FilterFormData>({
    defaultValues: filterFormDefaultValues,
    resolver: zodResolver(filterFormSchema),
  });

  const { data: movies } = useMovies(formMethods.getValues());
  const { data: filtersMetadata } = useFiltersMetadata();

  const router = useRouter();

  const handleSubmit = useCallback(
    async (data: FilterFormData) => {
      const { duration, ...restParams } = { ...router.query, ...data };
      // remove duration from query if it's undefined
      await router.replace({
        query: { ...restParams, ...(duration && { duration }) },
      });
    },
    [router]
  );

  // synchronize form state with query params on page enter
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const genres = searchParams.getAll('genres');
    const duration = searchParams.get('duration');

    if (genres) formMethods.setValue('genres', genres);
    if (duration) formMethods.setValue('duration', Number.parseInt(duration));
  }, [formMethods]);

  useEffect(() => {
    const { unsubscribe } = formMethods.watch(() => {
      // rhc quirk https://github.com/orgs/react-hook-form/discussions/8020
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      formMethods.handleSubmit(handleSubmit)();
    });

    return () => unsubscribe();
  }, [formMethods, handleSubmit]);

  return (
    <div>
      <FormProvider {...formMethods}>
        {filtersMetadata && <Filters data={filtersMetadata} onReset={() => formMethods.reset()} />}
      </FormProvider>

      {movies?.map((movie) => (
        <div key={movie.id}>
          <h1>
            {movie.title} - {movie.year}
          </h1>
          <object data={movie.posterUrl} style={{ width: 250 }} type="image/jpg">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              alt="poster not found"
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Question_mark_%28black%29.svg/800px-Question_mark_%28black%29.svg.png"
              style={{ width: 250 }}
            />
          </object>
          <p>
            <b>{movie.director}</b> - {movie.genres.join(', ')}
          </p>
          <p>{movie.plot}</p>
        </div>
      ))}
    </div>
  );
}
