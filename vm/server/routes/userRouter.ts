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

userRouter.delete(
  '/:user_id',
  userController.deleteUser,
  (_req: Request, res: Response, _next: NextFunction): void => {
    res.status(200).json(res.locals.user);
  }
);

userRouter.get(
  '/getUserByGoogleId',
  userController.getUserByGoogleId,
  (req, res) => {
    console.log('end of /getUserByGoogleId route');
    res.status(200).json(res.locals.user);
  }
);

userRouter.delete('/logoutUser', userController.logOut, (req, res) => {
  console.log('end of user/logout route');
  res.status(200).json({ message: 'logged out' });
});

export default userRouter;
