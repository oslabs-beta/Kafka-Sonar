import express from 'express';
import { Request, Response, NextFunction } from 'express';
import configController from '../controllers/configController';

const configRouter = express.Router();

configRouter.post(
  '/test',
  configController.configPrometheus,
  (req: Request, res: Response, _next: NextFunction): void => {
    res.status(200).json('test completem, check for custom files')
  });

configRouter.get('/test', (req: Request, res: Response, next: NextFunction): void => {
  res.status(200).json('test complete');
})

configRouter.post('/test1', (req: Request, res: Response, next: NextFunction) => {
  console.log('we are in test1, here is req.body', req.body.test);
}, (req: Request, res: Response, next: NextFunction) => {
  res.status(200).json('test1');
})

export default configRouter;