export const ROUTES = {
  addMovie: '/add-movie',
  browseMovies: '/',
  login: '/login',
  signup: '/signup',
} as const;

export type Route = (typeof ROUTES)[keyof typeof ROUTES];
