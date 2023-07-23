import express from 'express';
import { Express, Request, Response, NextFunction } from 'express';
import bodyParser from 'body-parser';
import fs from 'fs';
import api from './server/routes/api';
import http from 'http';

// Unix socket
const socket = '/run/guest-services/backend.sock';

// After a server is done with the unix domain socket, it is not automatically destroyed.
// You must instead unlink the socket in order to reuse that address/path.
// To do this, we delete the file with fs.unlinkSync()
try {
  if (fs.existsSync(socket)) {
    console.log('UNIX socket file exists.');
    fs.unlinkSync(socket);
    console.log('Deleted the UNIX socket file.');
  }
} catch (err) {
  console.error('An error occurred while deleting the socket file:', err);
}

const app: Express = express();

app.use(bodyParser.json());

app.get('/hello', (req, res) => {
  res.send(`🚀 Server listening on ${socket}`);
});

const server = http.createServer(app);
server.listen(socket, () => {
  console.log(`🚀 Server listening on ${socket}`);
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

// app.listen(3333, () => {
//   console.log('listening on Port 3333...');
// });