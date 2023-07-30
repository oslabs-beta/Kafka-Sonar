import express from 'express';
import { Request, Response, NextFunction } from 'express';
import promController from '../controllers/promController';

const promRouter = express.Router();

promRouter.get(
  '/freePhysicalMemorySize',
  promController.getFreePhysicalMemorySize,
  (_req: Request, res: Response, _next: NextFunction): void => {
    res.status(200).json(res.locals.memory);
  }
);

export default promRouter;