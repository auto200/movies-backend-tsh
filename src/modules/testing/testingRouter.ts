import { Router } from "express";
import { validator } from "@common/payloadValidation";
import { z } from "zod";
import { AppError } from "@common/errors/AppError";

const validators = {
  root: validator({ params: z.object({}), query: z.object({}) }),
  withQuery: validator({ query: z.object({ query: z.string() }) }),
};

export const createTestingRouter = (): Router => {
  const router = Router();

  router.get("/", validators.root, (_req, res) => {
    res.send("hello world");
  });

  router.get("/withParam", validators.withQuery, (req, res) => {
    res.send(`Your query is ${req.query.query}`);
  });

  router.get("/internalError", (_req, _res, next) => {
    next(new AppError("Something went wrong"));
  });

  return router;
};
