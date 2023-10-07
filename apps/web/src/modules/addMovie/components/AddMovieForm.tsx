import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'next-i18next';
import { useForm } from 'react-hook-form';

import { stripOptionalValues } from '@/lib/utils';

import { useAddMovie } from '../api/mutations';
import { useGenres } from '../api/queries';
import { AddMovieFormData, addMovieFormSchema } from '../schema';

export const AddMovieForm = () => {
  const {
    formState: { errors },
    handleSubmit,
    register,
  } = useForm<AddMovieFormData>({
    resolver: zodResolver(addMovieFormSchema),
  });
  const { data: genres } = useGenres();
  const { mutate: addMovie } = useAddMovie();

  const { t } = useTranslation('add-movie');

  const onSubmit = (data: AddMovieFormData) => {
    addMovie(stripOptionalValues(data));
  };

  return (
    // rhc quirk
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    <form onSubmit={handleSubmit(onSubmit)}>
      <label>
        <div>{t('form.fields.title.label')}*</div>
        <input type="text" {...register('title')} />
        {errors.title && <pre>{t('form.fields.title.error')}</pre>}
      </label>

      <label>
        <div>{t('form.fields.year.label')}*</div>
        <input type="number" {...register('year', { valueAsNumber: true })} />
        {errors.title && <pre>{t('form.fields.year.error')}</pre>}
      </label>

      <label>
        <div>{t('form.fields.director.label')}*</div>
        <input type="text" {...register('director')} />
        {errors.title && <pre>{t('form.fields.director.error')}</pre>}
      </label>

      <label>
        <div>{t('form.fields.runtime.label')}*</div>
        <input type="number" {...register('runtime', { valueAsNumber: true })} />
        {errors.title && <pre>{t('form.fields.runtime.error')}</pre>}
      </label>

      <label>
        <div>{t('form.fields.genres.label')}*</div>
        <select multiple {...register('genres')} style={{ height: 150, width: 180 }}>
          {genres?.map((genre) => (
            <option key={genre} value={genre}>
              {genre}
            </option>
          ))}
        </select>
        {errors.title && <pre>{t('form.fields.genres.error')}</pre>}
      </label>

      <label>
        <div>{t('form.fields.plot.label')}</div>
        <input type="text" {...register('plot')} />
      </label>

      <label>
        <div>{t('form.fields.posterUrl.label')}</div>
        <input type="text" {...register('posterUrl')} />
        {errors.title && <pre>{t('form.fields.posterUrl.error')}</pre>}
      </label>

      <label>
        <div>{t('form.fields.actors.label')}</div>
        <input type="text" {...register('actors')} />
      </label>

      <div>
        <button>{t('form.submit')}</button>
      </div>
    </form>
  );
};
