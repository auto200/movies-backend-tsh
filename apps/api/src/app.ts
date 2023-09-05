import express, { Express } from "express";
import helmet from "helmet";
import cors from "cors";

import { errorHandlerMiddleware } from "@/common/middlewares/errorHandlerMiddleware";
import { createMoviesRouter } from "@/modules/movies/moviesRouter";
import { RootService } from "@/config/rootService";

export const initApp = (rootService: RootService): Express => {
  const app = express();

  app.use(express.json());
  app.use(helmet());
  app.use(cors());

  app.use("/v1/movies", createMoviesRouter(rootService));

  app.use(errorHandlerMiddleware);

  return app;
};
