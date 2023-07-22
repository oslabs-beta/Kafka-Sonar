import express from 'express';
import { Request, Response, NextFunction } from 'express';
import configController from '../controllers/configController';
import dockerController from '../controllers/dockerController';

const initRouter = express.Router();

initRouter.post(
  '/test',
  configController.configPrometheus,
  configController.writeGrafanaDashboard,
  dockerController.writeMetricsCompose,
  // dockerController.metricsComposeUp,
  // save client info to cluster table, returning cluster_id
  // save jmx info to jmx table, using cluster_id as fk
  (_req: Request, res: Response, _next: NextFunction): void => {
    // send FE back data in this shape: https://codesmithptri10.slack.com/archives/C04SNGT58CX/p1690066936887399
    res.status(200).json('test complete, check for custom files');
  });

export default initRouter;