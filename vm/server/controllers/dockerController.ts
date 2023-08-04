import { Request, Response, NextFunction } from 'express';
import Dockerode from 'dockerode';
import createPromContainerCreateOpts from '../utils/promContainerCreateOptions';
import createGrafContainerCreateOpts from '../utils/grafContainerCreateOptions'

const docker = new Dockerode({ socketPath: '/var/run/docker.sock'});

/* TO-DO: 
- refactor routes and refactor destructuring of req.body to match clientside request shape
*/

const dockerController = {
  runPrometheus: async (
    _req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const { clusterDir, network } = res.locals;
    try {
      const promCreateOpts = createPromContainerCreateOpts(network, clusterDir);
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
    _req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const { clusterDir, network } = res.locals;
    try {
      const grafCreateOpts = createGrafContainerCreateOpts(network, clusterDir);
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
    const { clusterDir } = req.params;
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
}

export default dockerController;