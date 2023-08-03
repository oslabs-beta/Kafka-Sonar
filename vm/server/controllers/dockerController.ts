import { Request, Response, NextFunction } from 'express';
import Dockerode from 'dockerode';
import createPromContainerCreateOpts from '../utils/promContainerCreateOptions';
import createGrafContainerCreateOpts from '../utils/grafContainerCreateOptions'

// instantiate the dockerode client, this works the same as the axios instance instantiate above, but should simplify the container creation process
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
    const { clusterDir, user_network } = res.locals;
    try {
      const promCreateOpts = createPromContainerCreateOpts(user_network, clusterDir);
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
    const { clusterDir, user_network } = res.locals;
    try {
      const grafCreateOpts = createGrafContainerCreateOpts(user_network, clusterDir);
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
          console.log(containerInfo.Names[0], containerInfo.Id);
          metricsContainersFound += 1;
          const container = docker.getContainer(containerInfo.Id);
          await container.stop();
          await container.remove({ v: true });
          // if we have removed both metrics containers, break out of this loop
          if (metricsContainersFound === 2) break;
        }
      }
      return next();
    } catch (err) {
      return next({
        log: 'Error occured in dockerController.removeMetricsContainers Middleware',
        message: { err: JSON.stringify(err, Object.getOwnPropertyNames(err))}
      });
    }
  },
  // killMetricsContainers: async (
  //   req: Request,
  //   res: Response,
  //   next: NextFunction
  // ): Promise<void> => {
  //   const { clusterDir } = req.params;
  //   const containers = await docker.listContainers();
  //   const regex = new RegExp(clusterDir + '-kafkasonar-', 'g')
  //   for (const container of containers) {
  //     if (container.Names[0].match(regex)) {
  //       console.log('CONTAINER TO DELETE in kill', container.Names[0]);
  //       console.log('CONTAINER TO DELETE ID in kill', container.Id);
  //       const containerId = container.Id;
  //       await daemon.post(`v1.43/containers/${containerId}/kill`)
  //     }
  //   }
  //   return next();
  // },
}

export default dockerController;