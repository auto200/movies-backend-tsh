import React from 'react';

import { useTranslation } from 'next-i18next';

import { MovieDTO } from '@movies/shared/communication';

import { Badge } from '@/components/ui/Badge';

type MovieResultProps = {
  movie: MovieDTO;
};

export const MovieCard: React.FC<MovieResultProps> = ({ movie }) => {
  const { t } = useTranslation('browse-movies');

  return (
    <div key={movie.id} className="flex max-w-lg flex-col items-center">
      <h2 className="mb-4 text-2xl font-bold">{movie.title}</h2>
      <object
        className="flex aspect-[2/3] w-[250px] align-middle"
        data={movie.posterUrl}
        type="image/jpg"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          alt={t('posterNotFound')}
          className="w-[250px] object-contain"
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Question_mark_%28black%29.svg/800px-Question_mark_%28black%29.svg.png"
        />
      </object>
      <div className="mt-1 flex flex-col gap-1">
        <div>
          {movie.genres.map((genre) => (
            <Badge key={genre} variant="outline">
              {genre}
            </Badge>
          ))}
          <Badge variant="outline">{movie.year}</Badge>
        </div>
        <p>
          {t('movieCart.director')}: <span className="font-bold">{movie.director}</span>
        </p>
        <p>{movie.plot}</p>
      </div>
    </div>
  );
};
