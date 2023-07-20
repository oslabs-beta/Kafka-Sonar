import * as express from 'express';
import { Express, Request, Response } from 'express';
import * as fs from 'fs';

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

app.get('/test', (req: Request, res: Response) => {
  res.send('Hello from Kafka Sonar');
});

// app.listen(3333, () => {
//   console.log('listening on Port 3333...');
// });

app.listen(SOCKETFILE, () => console.log(`🚀 Server listening on ${SOCKETFILE}`));