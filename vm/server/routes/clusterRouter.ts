import express from 'express';
import { Request, Response, NextFunction } from 'express';
import clusterController from '../controllers/clusterController';

const clusterRouter = express.Router();

// SAVE NEW CONNECTION handleFinish - WIP.

clusterRouter.post(
  '/:user_id',
  clusterController.postCluster,
  clusterController.postUserCluster,
  // TASK: Following controller will need to be refactored to add all ports associated with a cluster_id in one operation.
  // clusterController.postJmxPort,
  (_req: Request, res: Response, _next: NextFunction): void => {
    res.sendStatus(200);
  }
);

// SAVED CONNECTIONS getUserConnections - DONE. Working fullstack.

clusterRouter.get(
  '/userclusters/:user_id',
  clusterController.getUserClusters,
  (_req: Request, res: Response, _next: NextFunction): void => {
    res.status(200).json(res.locals.clusters);
  }
);

// SAVED CONNECTIONS deleteUserConnection - WIP.

clusterRouter.delete(
  '/:user_id/:cluster_id',
  clusterController.deleteCluster,
  clusterController.deleteUserCluster,
  // TASK: Following controller will need to be refactored to add all ports associated with a cluster_id in one operation.
  // clusterController.deleteJmxPort,
  (_req: Request, res: Response, _next: NextFunction): void => {
    res.sendStatus(200);
  }
);

// SAVED CONNECTIONS connectToSelected - WIP, will likly involve getting a specific cluster's data to spin up containers, posting metrics continuously, and posting errors continuously.
// TASK: Add controllers for spinning up and posting metrics. All controllers will need to be consolidated into one route.

clusterRouter.get(
  '/:cluster_id',
  clusterController.getCluster,
  (_req: Request, res: Response, _next: NextFunction): void => {
    res.status(200).json(res.locals.cluster);
  }
);

// following controller seems fine, gets all ports associated with a cluster_id.
clusterRouter.get(
  '/jmxports/:cluster_id',
  clusterController.getJmxPorts,
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

// SAVED CONNECTIONS disconnectFromCurrent - WIP, will likely involve getting a specific cluster's data to spin down containers, stopping metrics posts, and stopping errors posts.
// TASK: Add controllers for spinning down, stopping metrics, and stopping logging. All controllers will need to be consolidated into one route.

clusterRouter.get(
  '/:cluster_id',
  clusterController.getCluster,
  (_req: Request, res: Response, _next: NextFunction): void => {
    res.status(200).json(res.locals.cluster);
  }
);

// following controller seems fine, gets all ports associated with a cluster_id.
clusterRouter.get(
  '/jmxports/:cluster_id',
  clusterController.getJmxPorts,
  (_req: Request, res: Response, _next: NextFunction): void => {
    res.status(200).json(res.locals.clusters);
  }
);

// SAVED CONNECTIONS downloadMetrics - Must for launch.
// TASK: Decide and implement download format on FE.

// SAVED CONNECTIONS downloadLogs - Nice-to-have. TBD download format on FE.

clusterRouter.get(
  '/clustererrors/:cluster_id',
  clusterController.getClusterErrors,
  (_req: Request, res: Response, _next: NextFunction): void => {
    res.status(200).json(res.locals.clusters);
  }
);

// For testing purposes
// Not used in app - getting all clusters for all users

clusterRouter.get(
  '/allclusters',
  clusterController.getAllClusters,
  (_req: Request, res: Response, _next: NextFunction): void => {
    res.status(200).json(res.locals.clusters);
  }
);

export default clusterRouter;
