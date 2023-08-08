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
import path from 'path';
import { query } from './models/appModel';
import { format } from 'date-fns';
import cache from 'memory-cache'

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

// // server state to track the cluster_id PK of the currently connected cluster
// let currentClusterId: string|null = null;

// app.get('/connection/:clusterId', async (req, res) => {
//   currentClusterId = req.params.clusterId;
// });

// run storeMetrics every minute
setInterval(async () => {
  const currentClusterId = cache.get('connectedClusterId'); 
  console.log('here is the cached cluster_id ---->', currentClusterId)
  // If currentClusterId is null i.e. there is no active connection, do not scrape
  if (!currentClusterId) return;

  try {
    await storeMetrics();
    console.log(`Metrics stored successfully at ${new Date()}`);
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message);
    }
  }
}, 60 * 1000); // 60 seconds * 1000 ms/second

app.get('/download/:clientId/:clusterId', async (req, res) => {
  try {
    const { clientId, clusterId } = req.params;
    console.log(`Processing download for clientId: ${clientId}, clusterId: ${clusterId}`);
    const values = [clientId];

    const result = await query('SELECT * FROM metrics_table WHERE cluster_id = $1', values);

    const csv = result.rows.map(row => {
      const date = new Date(row['timestamp']);
      // converts timestamp in each row with a string in the excel-friendly "YYYY-MM-DD HH:mm:ss" format
      row['timestamp'] = format(date, 'yyyy-MM-dd HH:mm:ss');
      return Object.values(row).join(',');
    }).join('\n');

    const currentDateTime = format(new Date(), 'yyyy-MM-dd_HH-mm-ss');
    const filename = `${clusterId}_metrics_table_${currentDateTime}.csv`;

    console.log(`Writing to file: ${filename} with content size: ${csv.length}`);
    
    const directory = `/backend/user/${clusterId}/`;
    const fullPath = path.join(directory, filename);

    fs.writeFile(fullPath, csv, function (err) { 
      if (err) throw err;
      console.log(`File is created successfully at ${new Date()} with path ${fullPath}`);
      res.download(fullPath);
    });
  } catch (err) {
    console.error(`Error processing download: ${err}`);
    res.status(500).send("Error processing download.");
  }
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
