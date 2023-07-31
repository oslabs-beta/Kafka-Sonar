import express from 'express';
import { Request, Response, NextFunction } from 'express';
import clusterController from '../controllers/clusterController';

const clusterRouter = express.Router();

// SAVE NEW CONNECTION handleFinish

clusterRouter.post(
  '/',
  clusterController.postCluster,
  clusterController.postUserCluster,
  (_req: Request, res: Response, _next: NextFunction): void => {
    res.status(200);
  }
);

// SAVED CONNECTIONS useEffect

clusterRouter.get(
  '/userclusters/:user_id',
  clusterController.getUserClusters,
  (_req: Request, res: Response, _next: NextFunction): void => {
    res.status(200).json(res.locals.clusters);
  }
);

// General clusters routes

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

// User clusters routes

clusterRouter.post(
  '/userclusters/:user_id/:cluster_id',
  clusterController.postUserCluster,
  (_req: Request, res: Response, _next: NextFunction): void => {
    res.status(200).json(res.locals.cluster);
  }
);

clusterRouter.delete(
  '/userclusters/:user_id/:cluster_id',
  clusterController.deleteUserCluster,
  (_req: Request, res: Response, _next: NextFunction): void => {
    res.status(200).json(res.locals.cluster);
  }
);

// Error logs routes

clusterRouter.get(
  '/clustererrors/:cluster_id',
  clusterController.getClusterErrors,
  (_req: Request, res: Response, _next: NextFunction): void => {
    res.status(200).json(res.locals.clusters);
  }
);

clusterRouter.post(
  '/clustererrors/:cluster_id',
  clusterController.postClusterError,
  (_req: Request, res: Response, _next: NextFunction): void => {
    res.status(200).json(res.locals.cluster);
  }
);

// jmx ports routes

clusterRouter.get(
  '/jmxports/:cluster_id',
  clusterController.getJmxPorts,
  (_req: Request, res: Response, _next: NextFunction): void => {
    res.status(200).json(res.locals.clusters);
  }
);

clusterRouter.post(
  '/jmxports/:cluster_id',
  clusterController.postJmxPort,
  (_req: Request, res: Response, _next: NextFunction): void => {
    res.status(200).json(res.locals.cluster);
  }
);

clusterRouter.put(
  '/jmxports/:cluster_id/:port_id',
  clusterController.putJmxPort,
  (_req: Request, res: Response, _next: NextFunction): void => {
    res.status(200).json(res.locals.cluster);
  }
);

clusterRouter.delete(
  '/jmxports/:cluster_id/:port_id',
  clusterController.deleteJmxPort,
  (_req: Request, res: Response, _next: NextFunction): void => {
    res.status(200).json(res.locals.cluster);
  }
);

export default clusterRouter;
