import express from 'express';
import { Express, Request, Response, NextFunction } from 'express';
import bodyParser from 'body-parser';
import api from './routes/api';
// import session from 'express-session';
// import passport from 'passport';
// import googleOAuth from './auth/google';
// import 'dotenv/config';

const app: Express = express();

// googleOAuth(passport);
// app.use(
//   session({
//     secret: process.env.SESSION_SECRET,
//     resave: false,
//     saveUninitialized: false,
//     maxAge: 100000000,
//   })
// );
// app.use(passport.initialize());
// app.use(passport.session());

// // redirects the user to Google, where they will authenticate
// app.get(
//   '/login/google',
//   passport.authenticate('google', { scope: ['email', 'profile'] })
// );
// // once done, Google redirects to the callbackURL (/oauth2/redirect/google here)

// // processes the authentication response and logs the user in, after Google redirects the user back to the app
// app.get(
//   '/oauth2/redirect/google',
//   passport.authenticate('google', {
//     successRedirect: 'http://localhost:5175/saved',
//     failureRedirect: 'http://localhost:5175/',
//     failureMessage: true,
//   })
// );
// // verify function in GoogleStrategy passed to passport.use is called (see server/auth/google.ts)

app.use(bodyParser.json());

app.get('/hello', (req, res) => {
  res.send(`Hello from the backend (socket)`);
});

app.use('/api', api);

// catch-all route handler
app.use((_req: Request, res: Response): unknown =>
  res.status(404).send("This is not the page you're looking for...")
);

// global error handler
app.use(
  (
    err: unknown,
    _req: Request,
    res: Response,
    _next: NextFunction
  ): unknown => {
    const defaultErr = {
      log: `Express error handler caught unknown middleware error ${err}`,
      status: 500,
      message: { err: 'An error occurred' },
    };
    const errorObj = Object.assign({}, defaultErr, err);
    console.log(errorObj.log);
    return res.status(errorObj.status).json(errorObj.message);
  }
);

export default app;
