import { query } from '../models/appModel';
import { Request, Response, NextFunction } from 'express';

const userController = {
  getAllUsers: async (
    _req: Request,
    res: Response,
    next: NextFunction
  ): Promise<unknown> => {
    try {
      const request = 'SELECT * FROM users';
      // const values: any = [];
      const response: any = await query(request);
      console.log(response);
      res.locals.users = response.rows;
      return next();
    } catch (err) {
      return next({
        log: 'Error occured in userController.getAllUsers Middleware',
        message: { err: JSON.stringify(err, Object.getOwnPropertyNames(err)) },
      });
    }
  },
  getUser: async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<unknown> => {
    try {
      const user_id = req.params.user_id;
      const request = 'SELECT * FROM users WHERE user_id = $1';
      const values: any[] = [user_id];
      const response: any = await query(request, values);
      res.locals.user = response.rows;
      return next();
    } catch (err) {
      return next({
        log: 'Error occured in userController.getUser Middleware',
        message: { err: JSON.stringify(err, Object.getOwnPropertyNames(err)) },
      });
    }
  },
  postUser: async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<unknown> => {
    try {
      console.log(req.body);
      const { email, password, account_type } = req.body;

      const request =
        'INSERT INTO users (email, password, account_type) VALUES ($1,$2, $3) RETURNING *';
      const values: any[] = [email, password, account_type];
      const response: any = await query(request, values);
      res.locals.user = response.rows;
      return next();
    } catch (err) {
      return next({
        log: 'Error occured in userController.postUser Middleware',
        message: { err: JSON.stringify(err, Object.getOwnPropertyNames(err)) },
      });
    }
  },
  putUser: async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<unknown> => {
    try {
      const user_id = req.params.user_id;
      const { email, password, account_type } = req.body;
      const request =
        'UPDATE users SET email= $1, password = $2, account_type = $3 WHERE user_id= $4 RETURNING *';
      const values: any[] = [email, password, account_type, user_id];
      const response: any = await query(request, values);
      res.locals.user = response.rows;
      return next();
    } catch (err) {
      return next({
        log: 'Error occured in userController.putUser Middleware',
        message: { err: JSON.stringify(err, Object.getOwnPropertyNames(err)) },
      });
    }
  },
  deleteUser: async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<unknown> => {
    try {
      const user_id = req.params.user_id;
      const request = 'DELETE FROM users WHERE user_id = $1 RETURNING *';
      const values: any[] = [user_id];
      const response: any = await query(request, values);
      res.locals.user = response.rows;
      return next();
    } catch (err) {
      return next({
        log: 'Error occured in userController.deleteuser Middleware',
        message: { err: JSON.stringify(err, Object.getOwnPropertyNames(err)) },
      });
    }
  },
};

export default userController;
