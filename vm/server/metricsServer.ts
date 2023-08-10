import express from 'express';
import { Express, Request, Response, NextFunction } from 'express';
import bodyParser from 'body-parser';
import api from './routes/api';
import { storeMetrics } from './metricService';
import { query } from './models/appModel';
import { format } from 'date-fns';
import cache from 'memory-cache';
import pkg from 'fs-extra';
const { outputFileSync } = pkg;

const app: Express = express();
const cors = require('cors');

app.use(bodyParser.json());

// Allow specific origin - 'http://localhost:5175' - needed for debug mode
app.use(cors({
  origin: 'http://localhost:5175'
}));

// Remove for production
app.use('/api', api);

/**
 * Automatically store metrics data.
 * The function will check for the currently connected cluster ID and, if found, invoke `storeMetrics`.
 * This happens every 60 seconds.
 */
setInterval(async () => {
  const currentClusterId: number | null = cache.get('connectedClusterId'); 

  // If there is no active connection, don't scrape
  if (!currentClusterId) return;

  try {
    await storeMetrics();
    console.log(`Metrics stored successfully at ${new Date()}`); // Keep for monitoring
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message);
    }
  }
}, 60 * 1000);

// Endpoint to download metrics data for a given client and cluster as a CSV file
app.get('/download/:clientId/:clusterId', async (req, res) => {
  try {
    const { clientId, clusterId } = req.params;

    const values: [number] = [Number(clusterId)];
    const result = await query('SELECT * FROM metrics_table WHERE cluster_id = $1', values);
    
    const headers = "_id,endpoint,metric,env,instance,job,service,request,aggregate,scope,value,timestamp,cluster_id";
    const csvContent = result.rows.map(row => {
      const date = new Date(row['timestamp']);
      // Converts timestamp in each row with a string in the excel-friendly "YYYY-MM-DD HH:mm:ss" format
      row['timestamp'] = format(date, 'yyyy-MM-dd HH:mm:ss');
      return Object.values(row).join(',');
    }).join('\n');
    const csv = headers + '\n' + csvContent;

    const currentDateTime = format(new Date(), 'yyyy-MM-dd_HH-mm-ss');
    const filename = `${clientId}_metrics_table_${currentDateTime}.csv`;
    
    // Write to /backend/user/<clientId>/
    const fullPath = `./user/${clientId}/metrics/${filename}`;
    outputFileSync(fullPath, csv);
    res.download(fullPath);
  } catch (err) {
    console.error(`Error processing download: ${err}`);
    res.status(500).send("Error processing download.");
  }
});

// Catch-all route handler
app.use((_req: Request, res: Response): unknown =>
  res.status(404).send("This is not the page you're looking for...")
);

// Global error handler
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
