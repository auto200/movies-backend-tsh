import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { Express, json } from 'express';
import helmet from 'helmet';

import { errorHandlerMiddleware } from '@/common/middlewares/errorHandlerMiddleware';
import { appConfig } from '@/config/appConfig';
import { createAuthRouter } from '@/modules/auth';
import { createMoviesRouter } from '@/modules/movies';
import { RootService } from '@/rootService';

export const initApp = (rootService: RootService): Express => {
  const app = express();

  app.use(json());
  app.use(cookieParser());
  app.use(helmet());
  app.use(cors({ credentials: true, origin: appConfig.CLIENT_URL }));

  app.use('/v1/movies', createMoviesRouter(rootService));
  app.use('/v1/auth', createAuthRouter(rootService));

  app.use(errorHandlerMiddleware);

  return app;
};
