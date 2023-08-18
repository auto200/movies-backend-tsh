import { Router } from "express";
import { validator } from "@common/payloadValidation";
import { AddMovieDTOSchema } from "./models/movie";
import { RootService } from "@config/rootService";

const validators = {
  addMovie: validator({ body: AddMovieDTOSchema }),
};

export const createMoviesRouter = ({ moviesService }: RootService): Router => {
  const router = Router();

  router.post("/", validators.addMovie, (req, res, next) => {
    const movieToAdd = req.body;

    moviesService
      .addMovie(movieToAdd)
      .then(() => res.send("Success"))
      .catch(next);
  });

  // router.get<unknown, Movie | null>("/", async (_req, res) => {
  //   console.log("lol");
  //   res.json(await moviesService.getMovie());
  // });

  return router;
};
