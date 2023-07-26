import express from 'express';
import { Express, Request, Response, NextFunction } from 'express';
import bodyParser from 'body-parser';

const app: Express = express();

app.use(bodyParser.json());

// tested with postman 
app.get('/test', (req, res) => {
  res.send(`Hello from the backend (port 3333)`);
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