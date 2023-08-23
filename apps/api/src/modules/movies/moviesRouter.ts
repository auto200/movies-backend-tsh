import { Router } from "express";
import { validator } from "@common/payloadValidation";
import { addMovieRequestDTOSchema, getMovieWithQueryFiltersSchema } from "./models/movie";
import { RootService } from "@config/rootService";

const validators = {
  addMovie: validator({ body: addMovieRequestDTOSchema }),
  getMovie: validator({
    query: getMovieWithQueryFiltersSchema,
  }),
};

// NOTE: currently movie genres has to exactly match genres from database,
// including capitalization

export const createMoviesRouter = ({ moviesService }: RootService): Router => {
  const router = Router();

  router.post("/", validators.addMovie, (req, res, next) => {
    const movieToAdd = req.body;

    moviesService
      .addMovie(movieToAdd)
      .then(() => res.send("Success"))
      .catch(next);
  });

  router.get("/", validators.getMovie, (req, res, next) => {
    const filters = req.query;

    const filtersActive = Object.keys(filters).length > 0;
    if (filtersActive) {
      moviesService
        .getMoviesWithFilters(filters)
        .then((movies) => res.json(movies))
        .catch(next);

      return;
    }

    moviesService
      .getRandomMovie()
      .then((movie) => res.json(movie))
      .catch(next);
  });

  return router;
};
