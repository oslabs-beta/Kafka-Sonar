import { Request, Response, NextFunction } from 'express';
import Dockerode from 'dockerode';
import pkg from 'fs-extra';
const { removeSync } = pkg;
import createPromContainerCreateOpts from '../utils/promContainerCreateOptions';
import createGrafContainerCreateOpts from '../utils/grafContainerCreateOptions'

const docker = new Dockerode({ socketPath: '/var/run/docker.sock'});

const dockerController = {
  runPrometheus: async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    console.log('REQ.PARAMS', req.params);
    const { client_id, network } = req.params
    const clusterDir = client_id;
    res.locals.clusterDir = clusterDir
    try {
      const promCreateOpts = createPromContainerCreateOpts(network, clusterDir);
      console.log('PROM CREATE OPTS', promCreateOpts);
      await docker.pull(promCreateOpts.Image!);
      const promContainer = await docker.createContainer(promCreateOpts);
      await promContainer.start();
      return next();
    } catch (err) {
      return next({
        log: 'Error occured in dockerController.runPrometheus Middleware',
        message: { err: JSON.stringify(err, Object.getOwnPropertyNames(err))}
      });
    }
  },
  runGrafana: async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const { network } = req.params;
    const { clusterDir } = res.locals;
    try {
      const grafCreateOpts = createGrafContainerCreateOpts(network, clusterDir);
      console.log('GRAF CREATE OPTS', grafCreateOpts);
      await docker.pull(grafCreateOpts.Image!);
      const grafContainer = await docker.createContainer(grafCreateOpts);
      await grafContainer.start();
      return next();
    } catch (err) {
      return next({
        log: 'Error occured in dockerController.runGrafana Middleware',
        message: { err: JSON.stringify(err, Object.getOwnPropertyNames(err))}
      });
    }
  },
  removeMetricsContainers: async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const { client_id} = req.params;
    const clusterDir = client_id;
    const containers = await docker.listContainers();
    const regex = new RegExp('/' + clusterDir + '-kafkasonar-', 'g')
    // instantiate a counter to track how many metrics containers have been removed
    let metricsContainersFound = 0;
    try {
      for (const containerInfo of containers) {
        if (containerInfo.Names[0].match(regex)) {
          metricsContainersFound += 1;
          const container = docker.getContainer(containerInfo.Id);
          await container.stop();
          await container.remove({ v: true });
          // if we have removed both metrics containers, break out of this loop
          if (metricsContainersFound === 2) break;
        };
      };
      return next();
    } catch (err) {
      return next({
        log: 'Error occured in dockerController.removeMetricsContainers Middleware',
        message: { err: JSON.stringify(err, Object.getOwnPropertyNames(err))}
      });
    }
  },
  deleteClusterDirFromVolume: async (
    req: Request,
    _res: Response,
    next: NextFunction
  ): Promise<void> => {
    const { clientId } = req.params;
    const clusterDir = clientId;
    // remove the directory that matches ./user/${clusterDir}
    try {
      removeSync(`./user/${clusterDir}`);
      return next();
    } catch (err) {
      return next({
        log: 'Error occured in dockerController.deleteClusterDir Middleware',
        message: { err: JSON.stringify(err, Object.getOwnPropertyNames(err))}
      });
    }

  }
}

export default dockerController;