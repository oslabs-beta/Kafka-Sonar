import { query } from '../models/appModel';
import { Request, Response, NextFunction } from 'express';

const userController = {
  getAllusers: async (
    _req: Request,
    res: Response,
    next: NextFunction
  ): Promise<unknown> => {
    try {
      const request = 'SELECT * FROM users';
      // const values: any = [];
      const response: any = await query(request);
      res.locals.users = response.rows;
      return next();
    } catch (err) {
      return next({
        log: 'Error occured in userController.getAllusers Middleware',
        message: { err: JSON.stringify(err, Object.getOwnPropertyNames(err)) },
      });
    }
  },
  getuser: async (
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
        log: 'Error occured in userController.getuser Middleware',
        message: { err: JSON.stringify(err, Object.getOwnPropertyNames(err)) },
      });
    }
  },
  postuser: async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<unknown> => {
    try {
      const { email, password } = req.body;
      const request =
        'INSERT INTO users (email, password) VALUES ($1,$2) RETURNING *';
      const values: any[] = [email, password];
      const response: any = await query(request, values);
      res.locals.user = response.rows;
      return next();
    } catch (err) {
      return next({
        log: 'Error occured in userController.postuser Middleware',
        message: { err: JSON.stringify(err, Object.getOwnPropertyNames(err)) },
      });
    }
  },
  putuser: async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<unknown> => {
    try {
      const user_id = req.params.user_id;
      const {
        user_name,
        industry,
        user_type,
        user_description,
        host_id,
        total_attendees,
        user_location,
        user_status,
        date_time,
        user_price,
      } = req.body;
      const request =
        'UPDATE users SET user_name = $1, industry = $2, user_type = $3, user_description = $4, host_id = $5, total_attendees =$6, user_location = $7, user_status = $8, date_time = $9, user_price = $10 WHERE user_id= $11 RETURNING *';
      const values: any[] = [
        user_name,
        industry,
        user_type,
        user_description,
        host_id,
        total_attendees,
        user_location,
        user_status,
        date_time,
        user_price,
        user_id,
      ];
      const response: any = await query(request, values);
      res.locals.user = response.rows;
      return next();
    } catch (err) {
      return next({
        log: 'Error occured in userController.putuser Middleware',
        message: { err: JSON.stringify(err, Object.getOwnPropertyNames(err)) },
      });
    }
  },
  deleteuser: async (
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
