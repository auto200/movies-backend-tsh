import { Router } from "express";
import { validator } from "@common/payloadValidation";
import { AddMovieRequestDTOSchema } from "./models/movie";
import { RootService } from "@config/rootService";

const validators = {
  addMovie: validator({ body: AddMovieRequestDTOSchema }),
};

export const createMoviesRouter = ({ moviesService }: RootService): Router => {
  const router = Router();

  router.post("/", validators.addMovie, (req, res, next) => {
    const movieToAdd = req.body;

    // NOTE: currently movie genres has to exactly match genres from database,
    // including capitalization
    moviesService
      .addMovie(movieToAdd)
      .then(() => res.send("Success"))
      .catch(next);
  });

  router.get("/", async (_req, res, next) => {
    moviesService
      .getRandomMovie()
      .then((movie) => res.json(movie))
      .catch(next);
  });

  return router;
};
