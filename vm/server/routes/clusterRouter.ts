import express from 'express';
import { Request, Response, NextFunction } from 'express';
import clusterController from '../controllers/clusterController';
import configController from '../controllers/configController';
import dockerController from '../controllers/dockerController';
import cacheController from '../controllers/cacheController';

const clusterRouter = express.Router();

// SAVE NEW CONNECTION - DONE. Working fullstack.
// This route handles all logic for writing custom configs for Prometheus / Grafana
// As well as adding the cluster information to the database
clusterRouter.post(
  '/newconnection/:user_id',
  configController.configPrometheus,
  configController.writeGrafanaDashboard,
  configController.writeGrafanaDashboardConfig,
  configController.writeGrafanaDatasource,
  clusterController.postCluster,
  clusterController.postUserCluster,
  clusterController.postJmxPort,
  (_req: Request, res: Response, _next: NextFunction): void => {
    res.sendStatus(200);
  }
);

// CONNECT TO A CLUSTER ROUTE - DONE. Working fullstack.
// Connect to a running cluster that has already been added
// This route spins up a Prometheus and Grafana container configured to scrape metrics from your cluster
clusterRouter.get(
  '/connect/:client_id/:network/:cluster_id',
  cacheController.cacheClusterId,
  dockerController.runPrometheus,
  dockerController.runGrafana,
  (_req: Request, res: Response, _next: NextFunction): void => {
    res.sendStatus(200);
  }
);

// DISCONNECT FROM A RUNNING CLUSTER ROUTE
clusterRouter.get(
  '/disconnect/:client_id',
  cacheController.clearCache,
  dockerController.removeMetricsContainers,
  (_req: Request, res: Response, _next: NextFunction): void => {
    res.sendStatus(200);
  }
)

// SAVED CONNECTIONS getUserConnections - DONE. Working fullstack.
clusterRouter.get(
  '/userclusters/:user_id',
  clusterController.getUserClusters,
  (_req: Request, res: Response, _next: NextFunction): void => {
    res.status(200).json(res.locals.clusters);
  }
);

// SAVED CONNECTIONS deleteUserConnection - DONE. Working fullstack.
clusterRouter.delete(
  '/:user_id/:cluster_id/:clientId',
  clusterController.deleteCluster,
  clusterController.deleteUserCluster,
  clusterController.deleteJmxPort,
  dockerController.deleteClusterDirFromVolume,
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
