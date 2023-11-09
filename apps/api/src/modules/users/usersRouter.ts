import { Router } from 'express';
import { StatusCodes } from 'http-status-codes';

import { signupUserRequestDTOSchema } from '@movies/shared/communication';

import { type RootService } from '@/common/infrastructure/rootService';
import { validator } from '@/common/payloadValidation';

const validators = { signup: validator({ body: signupUserRequestDTOSchema }) };

export function createUsersRouter({ usersService }: RootService): Router {
  const router = Router();

  router.post('/', validators.signup, (req, res, next) => {
    usersService
      .create(req.body)
      .then((user) => {
        res.status(StatusCodes.CREATED).json(user);
      })
      .catch(next);
  });

  return router;
}
