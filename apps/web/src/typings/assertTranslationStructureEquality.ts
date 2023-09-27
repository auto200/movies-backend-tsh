import { Equals, assert } from 'tsafe';

import addMovieEN from '../../public/locales/en/add-movie.json';
import browseMoviesEN from '../../public/locales/en/browse-movies.json';
import commonEN from '../../public/locales/en/common.json';
import addMoviePL from '../../public/locales/pl/add-movie.json';
import browseMoviesPL from '../../public/locales/pl/browse-movies.json';
import commonPL from '../../public/locales/pl/common.json';

assert<Equals<typeof browseMoviesEN, typeof browseMoviesPL>>;
assert<Equals<typeof addMovieEN, typeof addMoviePL>>;
assert<Equals<typeof commonEN, typeof commonPL>>;
