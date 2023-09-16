import cors from 'cors';
import express, { Express, json } from 'express';
import helmet from 'helmet';

import { errorHandlerMiddleware } from '@/common/middlewares/errorHandlerMiddleware';
import { RootService } from '@/config/rootService';
import { createMoviesRouter } from '@/modules/movies/moviesRouter';

export const initApp = (rootService: RootService): Express => {
  const app = express();

  app.use(json());
  app.use(helmet());
  app.use(cors());

  app.use('/v1/movies', createMoviesRouter(rootService));

  app.use(errorHandlerMiddleware);

  return app;
};
