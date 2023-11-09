import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { Express, json } from 'express';
import helmet from 'helmet';

import { RootService } from '@/common/infrastructure/rootService';
import { errorHandlerMiddleware } from '@/common/middlewares/errorHandlerMiddleware';
import { createMoviesRouter } from '@/modules/movies';

import { createAuthRouter } from './modules/auth';
import { createUsersRouter } from './modules/users';

export const initApp = (rootService: RootService): Express => {
  const app = express();

  app.use(json());
  app.use(cookieParser());
  app.use(helmet());
  app.use(
    cors()
    // to be investigated if it's needed during frontend integration
    // { credentials: true }
  );

  app.use('/v1/movies', createMoviesRouter(rootService));
  app.use('/v1/users', createUsersRouter(rootService));
  app.use('/v1/auth', createAuthRouter(rootService));

  app.use(errorHandlerMiddleware);

  return app;
};
