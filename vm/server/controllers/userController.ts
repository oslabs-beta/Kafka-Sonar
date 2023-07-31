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
  // following are potentially for Google OAuth 2.0
  getUserByGoogleId: async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    // Why are we doing this again when we did it in google.ts?
    // console.log('in getUserByGoogleId');
    // console.log('req.user in getUserByGoogleId', req.user);
    // try {
    //   if (!req.user) {
    //     res.redirect('/');
    //   }
    //   const googleId = req.user.id;
    //   // query db for use whose googleId matches googleId
    //   let user = await query(
    //     `SELECT * FROM users WHERE email=${profile._json.email}`
    //   );
    //   if (!user) {
    //     throw new Error();
    //   }
    //   console.log('found the user based on google id', user);
    //   res.locals.user = user;
    //   return next();
    // } catch (err) {
    //   return next({
    //     log: 'error with finding user by google id, check userController.getUserByGoogleId',
    //     message: { err: 'Could not find user by google id' },
    //   });
    // }
  },
  isLoggedIn: async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      // express-session applies user to req
      // @ts-ignore
      if (req.user) {
        return next();
      } else {
        res.redirect('/');
      }
    } catch (err) {
      return next({
        log: `Express error handler caught isLoggedIn error ${err}`,
        status: 500,
        message: {
          err: `Express error handler caught isLoggedIn error ${err}`,
        },
      });
    }
  },
  logOut: async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    // Shouldn't this just delete the session? On FE, we can redirect to the login page
    // try {
    //   req.logout((err) => {
    //     if (err) throw Error(err);
    //     // console.log('user is logged out!');
    //     // return next()
    //   })
    //   console.log('req.user after logout', req.user)
    //   return next();
    // } catch (err) {
    //   return next({
    //     log: 'error with user logout, check userController.logout',
    //     message: { err: 'User did not log out' }
    //   })
    // }
  },
};

export default userController;
