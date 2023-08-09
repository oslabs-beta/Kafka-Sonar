import express from 'express';
import { Request, Response, NextFunction } from 'express';
import clusterController from '../controllers/clusterController';
import configController from '../controllers/configController';
import dockerController from '../controllers/dockerController';
import cacheController from '../controllers/cacheController';

const clusterRouter = express.Router();

/*
 SAVE NEW CONNECTION
  This route handles all logic for writing custom configs for Prometheus / Grafana
  As well as adding the cluster information to the database
*/
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

/*
  CONNECT TO A CLUSTER ROUTE
  Connect to a running cluster that has already been added
  This route spins up a Prometheus and Grafana container configured to scrape metrics from your cluster
  And render them as iframes on the extension's ui
*/
clusterRouter.get(
  '/connect/:client_id/:network/:cluster_id',
  cacheController.cacheClusterId,
  dockerController.runPrometheus,
  dockerController.runGrafana,
  (_req: Request, res: Response, _next: NextFunction): void => {
    res.sendStatus(200);
  }
);

/* 
  DISCONNECT FROM A RUNNING CLUSTER ROUTE
  This route remove's metrics containers spun up on cluster connect
*/
clusterRouter.get(
  '/disconnect/:client_id',
  cacheController.clearCache,
  dockerController.removeMetricsContainers,
  (_req: Request, res: Response, _next: NextFunction): void => {
    res.sendStatus(200);
  }
)

/*
  SAVED CONNECTIONS
  Fetch all connections for a given user
*/ 
clusterRouter.get(
  '/userclusters/:user_id',
  clusterController.getUserClusters,
  (_req: Request, res: Response, _next: NextFunction): void => {
    res.status(200).json(res.locals.clusters);
  }
);

/* 
  DELETE CONNECTIONS
  Delete all data related to a given cluster from the DB and user volume
*/
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

// Get all JMX ports associated with a given cluster
clusterRouter.get(
  '/jmxports/:cluster_id',
  clusterController.getJmxPorts,
  (_req: Request, res: Response, _next: NextFunction): void => {
    res.status(200).json(res.locals.clusters);
  }
);

export default clusterRouter;
