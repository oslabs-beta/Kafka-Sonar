import express, { Express, Request, Response } from 'express';

const app: Express = express();

app.get('/test', (req: Request, res: Response) => {
  res.send('hello');
})

app.listen(3000, () => {
  console.log('listening on Port 3000...')
})
