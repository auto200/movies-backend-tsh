import { useMemo } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'next-i18next';
import { useForm } from 'react-hook-form';

import { Button } from '@/components/ui/Button';
import { CheckboxSelectList, Option } from '@/components/ui/CheckboxSelectList';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/Form';
import { Input } from '@/components/ui/Input';
import { stripOptionalValues } from '@/utils';

import { useAddMovie } from '../api/mutations';
import { useGenres } from '../api/queries';
import { AddMovieFormData, addMovieFormSchema } from '../schema';

export const AddMovieForm = () => {
  const form = useForm<AddMovieFormData>({
    resolver: zodResolver(addMovieFormSchema),
  });
  const { data: genres } = useGenres();
  const { mutate: addMovie } = useAddMovie();

  const { t } = useTranslation('add-movie');

  const genreOptions: Option[] = useMemo(
    () => genres?.map((genre) => ({ label: genre, value: genre })) ?? [],
    [genres]
  );
  const { control, handleSubmit } = form;

  const onSubmit = (data: AddMovieFormData) => {
    addMovie(stripOptionalValues(data));
  };

  return (
    <Form {...form}>
      {/* rhc quirk */}
      {/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
      <form className="w-min" onSubmit={handleSubmit(onSubmit)}>
        <FormField
          control={control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('form.fields.title.label')}*</FormLabel>
              <FormControl>
                {/* https://github.com/shadcn-ui/ui/issues/410#issuecomment-1676316957 */}
                <Input placeholder="Forrest Gump" {...field} value={field.value ?? ''} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="year"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('form.fields.year.label')}*</FormLabel>
              <FormControl>
                {/* https://github.com/shadcn-ui/ui/issues/410#issuecomment-1676316957 */}
                <Input placeholder="1994" type="number" {...field} value={field.value ?? ''} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="director"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('form.fields.director.label')}*</FormLabel>
              <FormControl>
                {/* https://github.com/shadcn-ui/ui/issues/410#issuecomment-1676316957 */}
                <Input placeholder="Robert Zemeckis" {...field} value={field.value ?? ''} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="runtime"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('form.fields.runtime.label')}*</FormLabel>
              <FormControl>
                {/* https://github.com/shadcn-ui/ui/issues/410#issuecomment-1676316957 */}
                <Input placeholder="142" type="number" {...field} value={field.value ?? ''} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="genres"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('form.fields.genres.label')}*</FormLabel>
              <FormControl>
                {/* https://github.com/shadcn-ui/ui/issues/410#issuecomment-1676316957 */}
                <CheckboxSelectList
                  onChange={field.onChange}
                  options={genreOptions}
                  selected={field.value ?? []}
                />
              </FormControl>
            </FormItem>
          )}
        />

        {/* optional fields */}
        <FormField
          control={control}
          name="plot"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('form.fields.plot.label')}</FormLabel>
              <FormControl>
                {/* https://github.com/shadcn-ui/ui/issues/410#issuecomment-1676316957 */}
                <Input {...field} value={field.value ?? ''} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="posterUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('form.fields.posterUrl.label')}</FormLabel>
              <FormControl>
                {/* https://github.com/shadcn-ui/ui/issues/410#issuecomment-1676316957 */}
                <Input {...field} value={field.value ?? ''} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="actors"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('form.fields.actors.label')}</FormLabel>
              <FormControl>
                {/* https://github.com/shadcn-ui/ui/issues/410#issuecomment-1676316957 */}
                <Input {...field} value={field.value ?? ''} />
              </FormControl>
            </FormItem>
          )}
        />

        <Button className="mt-2">{t('form.submit')}</Button>
      </form>
    </Form>
  );
};
