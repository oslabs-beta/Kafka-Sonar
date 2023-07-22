import express from 'express';
import { Request, Response, NextFunction } from 'express';
import configController from '../controllers/configController';
import dockerController from '../controllers/dockerController';

const initRouter = express.Router();

initRouter.post(
  '/test',
  configController.configPrometheus,
  // configController.writeGrafanaDashboard,
  dockerController.writeMetricsCompose,
  (req: Request, res: Response, _next: NextFunction): void => {
    res.status(200).json('test complete, check for custom files')
  });

export default initRouter;