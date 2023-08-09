import { Request, Response, NextFunction } from 'express';
import Dockerode from 'dockerode';
import pkg from 'fs-extra';
const { removeSync } = pkg;
import createPromContainerCreateOpts from '../utils/promContainerCreateOptions';
import createGrafContainerCreateOpts from '../utils/grafContainerCreateOptions'

const docker = new Dockerode({ socketPath: '/var/run/docker.sock'});

const dockerController = {
  /* 
    runPrometheus: create and start a prometheus container configured from the cluster's
    prometheus.yml stored in the user volume under the cluster's directory
  */
  runPrometheus: async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    /* 
    destructure network and client_id, needed for creating the container
    the network is needed to hook prometheus into the user's kafka cluster compose network
    without this, it cannot scrape the cluster
    */
    const { client_id, network } = req.params
    // semantically rename client_id and store on res.locals for the next middleware
    const clusterDir = client_id;
    res.locals.clusterDir = clusterDir
    try {
      // create a prometheus container create options object using the network and clusterDir
      const promCreateOpts = createPromContainerCreateOpts(network, clusterDir);
      // pull the image from the create options
      await docker.pull(promCreateOpts.Image!);
      // create a container using those create options
      const promContainer = await docker.createContainer(promCreateOpts);
      // start the container
      await promContainer.start();
      return next();
    } catch (err) {
      return next({
        log: 'Error occurred in dockerController.runPrometheus Middleware',
        message: { err: JSON.stringify(err, Object.getOwnPropertyNames(err))}
      });
    }
  },
  /* 
    runGrafana: create and start a grafana container using all the custom files
    written for it in all the configController grafana middleware
  */
  runGrafana: async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    // get the network from params
    const { network } = req.params;
    // get the clusterDir from previous middleware
    const { clusterDir } = res.locals;
    try {
      // create a grafana container create options object using network and clusterDir
      const grafCreateOpts = createGrafContainerCreateOpts(network, clusterDir);
      // pull the image from the create options
      await docker.pull(grafCreateOpts.Image!);
      // create the container using the create options
      const grafContainer = await docker.createContainer(grafCreateOpts);
      // start the container
      await grafContainer.start();
      return next();
    } catch (err) {
      return next({
        log: 'Error occurred in dockerController.runGrafana Middleware',
        message: { err: JSON.stringify(err, Object.getOwnPropertyNames(err))}
      });
    }
  },
  /* 
    removeMetricsContainers: stop and remove the prometheus
    and grafana containers associated with a specific cluster connection
  */
  removeMetricsContainers: async (
    req: Request,
    _res: Response,
    next: NextFunction
  ): Promise<void> => {
    // destructure the client_id
    const { client_id} = req.params;
    // semantically rename it to clusterDir, this is needed to know which container's to spin down
    const clusterDir = client_id;
    // get a list of all the user's running containers
    const containers = await docker.listContainers();
    // instantiate a regex to match the prometheus/grafana kafkasonar metrics containers
    const regex = new RegExp('/' + clusterDir + '-kafkasonar-', 'g')
    // set a counter to track how many metrics containers have been removed
    let metricsContainersFound = 0;
    try {
      // iterate through the containers
      for (const containerInfo of containers) {
        // if a container matches the kafkasonar metrics containers pattern
        if (containerInfo.Names[0].match(regex)) {
          metricsContainersFound += 1;
          // get that container
          const container = docker.getContainer(containerInfo.Id);
          // stop and remove it
          await container.stop();
          await container.remove({ v: true });
          // if we have removed both metrics containers, break out of this loop
          if (metricsContainersFound === 2) break;
        };
      };
      return next();
    } catch (err) {
      return next({
        log: 'Error occurred in dockerController.removeMetricsContainers Middleware',
        message: { err: JSON.stringify(err, Object.getOwnPropertyNames(err))}
      });
    }
  },
  /* 
    deleteClusterDirFromVolume: remove a cluster's directory from
    the user volume when they delete a connection
  */
  deleteClusterDirFromVolume: async (
    req: Request,
    _res: Response,
    next: NextFunction
  ): Promise<void> => {
    // get the clientId and semantically rename it
    const { clientId } = req.params;
    const clusterDir = clientId;
    try {
      // remove the directory that matches ./user/${clusterDir}
      removeSync(`./user/${clusterDir}`);
      return next();
    } catch (err) {
      return next({
        log: 'Error occurred in dockerController.deleteClusterDir Middleware',
        message: { err: JSON.stringify(err, Object.getOwnPropertyNames(err))}
      });
    }
  }
}

export default dockerController;