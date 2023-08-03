import { Request, Response, NextFunction } from 'express';
import Dockerode from 'dockerode';
import promContainerOpts from '../utils/promContainerOpts';
import grafContainerOpts from '../utils/grafContainerOpts';
import axios from 'axios';

// create an axios instance send requests the docker daemon to remove containers
// could use dockerode to do this, but this approach is more straightforward for now
// definitely an iteration goal to clean up this process
const daemon = axios.create({
  baseURL: 'http://unix:/',
  // we have ported the socket used to speak to the docker daemon into this backend container as a bind mount
  socketPath: '/var/run/docker.sock'
})
// instantiate the dockerode client, this works the same as the axios instance instantiate above, but should simplify the container creation process
const docker = new Dockerode({ socketPath: '/var/run/docker.sock'});

/* TO-DO: 
- write killPrometheus & killGrafana middleware 
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
      const args = promContainerOpts(user_network, clusterDir);
      const { image, cmd, createOpts, startOpts } = args;
      await docker.pull(image);
      // refactor to await
      docker.run(image, cmd, process.stdout, createOpts, startOpts)
        .then((data) => {
          const output = data[0];
          const container = data[1];
          console.log(output.statusCode);
          return container.remove();
        })
        .then((data) => console.log('container removed'))
        .catch(err => console.log(err));
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
      const args = grafContainerOpts(user_network, clusterDir);
      const { image, cmd, createOpts, startOpts } = args;
      await docker.pull(image);
      docker.run(image, cmd, process.stdout, createOpts, startOpts)
      .then((data) => {
        const output = data[0];
        const container = data[1];
        console.log(output.statusCode);
        return container.remove();
      })
      .then((_data) => console.log('container removed'))
      .catch(err => console.log(err));
    return next();
    } catch (err) {
      return next({
        log: 'Error occured in dockerController.runGrafana Middleware',
        message: { err: JSON.stringify(err, Object.getOwnPropertyNames(err))}
      });
    }
  },
  killMetricsContainers: async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const { clusterDir } = req.params;
    const containers = await docker.listContainers();
    const regex = new RegExp(clusterDir + '-kafkasonar-', 'g')
    for (const container of containers) {
      if (container.Names[0].match(regex)) {
        console.log('CONTAINER TO DELETE in kill', container.Names[0]);
        console.log('CONTAINER TO DELETE ID in kill', container.Id);
        const containerId = container.Id;
        await daemon.post(`v1.43/containers/${containerId}/kill`)
      }
    }
    return next();
  },
  // removeMetricsContainers: async (
  //   req: Request,
  //   res: Response,
  //   next: NextFunction
  // ): Promise<void> => {
  //   const { clusterDir } = req.params;
  //   const containers = await docker.listContainers();
  //   const regex = new RegExp('/' + clusterDir + '-kafkasonar-', 'g')
  //   try {
  //     for (const container of containers) {
  //       if (container.Names[0].match(regex)) {
  //         console.log('CONTAINER TO DELETE in remove', container.Names[0]);
  //         console.log('CONTAINER TO DELETE ID in remove', container.Id);
  //         const containerId = container.Id;
  //         // curl command: curl -X DELETE --unix-socket /var/run/docker.sock http:/v1.43/containers/<container id>\?force\=true
  //         await daemon.delete(`v1.43/${containerId}?force=true&v=true`)
  //       }
  //     }
  //     return next();
  //   } catch (err) {
  //     return next({
  //       log: 'Error occured in dockerController.removeMetricsContainers Middleware',
  //       message: { err: JSON.stringify(err, Object.getOwnPropertyNames(err))}
  //     });
  //   }
  //   return next();
  // }
}

export default dockerController;