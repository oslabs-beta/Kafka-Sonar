import express from 'express';
import { Request, Response, NextFunction } from 'express';
import userController from '../controllers/userController';

const userRouter = express.Router();

userRouter.get(
  '/allusers',
  userController.getAllusers,
  (_req: Request, res: Response, _next: NextFunction): void => {
    res.status(200).json(res.locals.users);
  }
);

userRouter.get(
  '/:user_id',
  userController.getuser,
  (_req: Request, res: Response, _next: NextFunction): void => {
    res.status(200).json(res.locals.user);
  }
);

userRouter.post(
  '/',
  userController.postuser,
  (_req: Request, res: Response, _next: NextFunction): void => {
    res.status(200).json(res.locals.user);
  }
);

userRouter.put(
  '/:user_id',
  userController.putuser,
  (_req: Request, res: Response, _next: NextFunction): void => {
    res.status(200).json(res.locals.user);
  }
);

userRouter.delete(
  '/:user_id',
  userController.deleteuser,
  (_req: Request, res: Response, _next: NextFunction): void => {
    res.status(200).json(res.locals.user);
  }
);

export default userRouter;
