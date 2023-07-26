import express from 'express';
import { Request, Response, NextFunction } from 'express';
import userController from '../controllers/userController';

const userRouter = express.Router();

userRouter.get(
  '/allusers',
  userController.getAllUsers,
  (_req: Request, res: Response, _next: NextFunction): void => {
    res.status(200).json(res.locals.users);
  }
);

userRouter.get(
  '/:user_id',
  userController.getUser,
  (_req: Request, res: Response, _next: NextFunction): void => {
    res.status(200).json(res.locals.user);
  }
);

userRouter.post(
  '/',
  userController.postUser,
  (_req: Request, res: Response, _next: NextFunction): void => {
    res.status(200).json(res.locals.user);
  }
);

userRouter.put(
  '/:user_id',
  userController.putUser,
  (_req: Request, res: Response, _next: NextFunction): void => {
    res.status(200).json(res.locals.user);
  }
);

userRouter.delete(
  '/:user_id',
  userController.deleteUser,
  (_req: Request, res: Response, _next: NextFunction): void => {
    res.status(200).json(res.locals.user);
  }
);

export default userRouter;
