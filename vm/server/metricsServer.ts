import express from 'express';
import { Express, Request, Response, NextFunction } from 'express';
import bodyParser from 'body-parser';
import api from './routes/api';
import session from 'express-session';
import passport from 'passport';
import googleOAuth from './auth/google';
import 'dotenv/config';
import { storeMetrics } from './metricService';
import fs from 'fs';
import { query } from './models/appModel';
import { format } from 'date-fns';

const app: Express = express();

googleOAuth(passport);
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    maxAge: 100000000,
  })
);
app.use(passport.initialize());
app.use(passport.session());

// redirects the user to Google, where they will authenticate
app.get(
  '/login/google',
  passport.authenticate('google', { scope: ['email', 'profile'] })
);
// once done, Google redirects to the callbackURL (/oauth2/redirect/google here)

// processes the authentication response and logs the user in, after Google redirects the user back to the app
app.get(
  '/oauth2/redirect/google',
  passport.authenticate('google', {
    successRedirect: 'http://localhost:5175/saved',
    failureRedirect: 'http://localhost:5175/',
    failureMessage: true,
  })
);
// verify function in GoogleStrategy passed to passport.use is called (see server/auth/google.ts)

app.use(bodyParser.json());

app.use('/api', api);

// run storeMetrics every minute
setInterval(async () => {
  try {
    await storeMetrics();
    console.log(`Metrics stored successfully at ${new Date()}`);
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message);
    }
  }
}, 60 * 1000); // 60 seconds * 1000 ms/second

// :clientId needed for number of brokers
app.get(`/download/`, async (req, res) => {
  // const { clientId } = req.params;
  // const clusterDir = clientId;

  const result = await query('SELECT * FROM metrics_table');

  const csv = result.rows.map(row => {
    const date = new Date(row['timestamp']);
    // converts timestamp in each row with a string in the excel-friendly "YYYY-MM-DD HH:mm:ss" format
    row['timestamp'] = format(date, 'yyyy-MM-dd HH:mm:ss');
    return Object.values(row).join(',');
  }).join('\n');

  const currentDateTime = format(new Date(), 'yyyy-MM-dd_HH-mm-ss');
  const filename = `metrics_table_${currentDateTime}.csv`;

  fs.writeFile(filename, csv, function (err) { 
    if (err) throw err;
    console.log(`File is created successfully at ${new Date()}`);
    // res.download(`../../user/${clusterDir}/${filename}`);
    res.download(`${filename}`);
  });  
});

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
