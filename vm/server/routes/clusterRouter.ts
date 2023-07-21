import express from 'express';
import { Request, Response, NextFunction } from 'express';
import clusterController from '../controllers/clusterController';

const clusterRouter = express.Router();

clusterRouter.get(
  '/allclusters',
  clusterController.getAllClusters,
  (_req: Request, res: Response, _next: NextFunction): void => {
    res.status(200).json(res.locals.clusters);
  }
);

clusterRouter.get(
  '/:cluster_id',
  clusterController.getCluster,
  (_req: Request, res: Response, _next: NextFunction): void => {
    res.status(200).json(res.locals.cluster);
  }
);

clusterRouter.post(
  '/',
  clusterController.postCluster,
  (_req: Request, res: Response, _next: NextFunction): void => {
    res.status(200).json(res.locals.cluster);
  }
);

clusterRouter.put(
  '/:cluster_id',
  clusterController.putCluster,
  (_req: Request, res: Response, _next: NextFunction): void => {
    res.status(200).json(res.locals.cluster);
  }
);

clusterRouter.delete(
  '/:cluster_id',
  clusterController.deleteCluster,
  (_req: Request, res: Response, _next: NextFunction): void => {
    res.status(200).json(res.locals.cluster);
  }
);

export default clusterRouter;
