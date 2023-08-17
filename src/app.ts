import express, { Express } from "express";
import { errorHandlerMiddleware } from "@common/middlewares/errorHandlerMiddleware";
import { createTestingRouter } from "@modules/testing/testingRouter";

export const initApp = (): Express => {
  const app = express();

  app.use("/", createTestingRouter());

  app.use(errorHandlerMiddleware);

  return app;
};
