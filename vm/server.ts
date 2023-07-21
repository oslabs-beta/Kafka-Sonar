import express from 'express';
import { Express, Request, Response, NextFunction } from 'express';
import * as fs from 'fs';
import bodyParser from 'body-parser';
import api from './server/routes/api';

const SOCKETFILE = '/run/guest-services/backend.sock'; // Unix socket
const app: Express = express();

// After a server is done with the unix domain socket, it is not automatically destroyed.
// You must instead unlink the socket in order to reuse that address/path.
// To do this, we delete the file with fs.unlinkSync()
try {
  fs.unlinkSync(SOCKETFILE);
  console.log('Deleted the UNIX socket file.');
} catch (err) {
  console.log('Did not need to delete the UNIX socket file.');
}

// app.get('/test', (req: Request, res: Response) => {
//   res.send('Hello from Kafka Sonar');
// });

app.use(bodyParser.json());

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

app.listen(3333, () => {
  console.log('listening on Port 3333...');
});

// app.listen(SOCKETFILE, () => console.log(`🚀 Server listening on ${SOCKETFILE}`));
