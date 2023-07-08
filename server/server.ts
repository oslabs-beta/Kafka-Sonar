import express, { Express, Request, Response } from 'express';

const app: Express = express();

app.get('/test', (req: Request, res: Response) => {
  res.send('Hello from Kafka Sonar');
});

app.listen(3333, () => {
  console.log('listening on Port 3333...');
});
