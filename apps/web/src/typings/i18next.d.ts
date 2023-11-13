import 'i18next';

import addMovieEN from '../../public/locales/en/add-movie.json';
import browseMoviesEN from '../../public/locales/en/browse-movies.json';
import commonEN from '../../public/locales/en/common.json';
import loginEN from '../../public/locales/en/login.json';
import registerEN from '../../public/locales/en/register.json';

declare module 'i18next' {
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  interface CustomTypeOptions {
    defaultNS: 'common';
    resources: {
      ['add-movie']: typeof addMovieEN;
      ['browse-movies']: typeof browseMoviesEN;
      ['common']: typeof commonEN;
      ['login']: typeof loginEN;
      ['register']: typeof registerEN;
    };
  }
}
