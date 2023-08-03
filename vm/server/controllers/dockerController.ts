// import pkg from 'fs-extra';
// const { outputFileSync } = pkg;
import { Request, Response, NextFunction } from 'express';
// import writeMetricsCompose from '../utils/writeMetricsCompose';
// import writeBuffer from '../utils/writeBuffer';
import Dockerode from 'dockerode';
// import DockerodeCompose from 'dockerode-compose';
import promContainerOpts from '../utils/promContainerOpts';
import grafContainerOpts from '../utils/grafContainerOpts';
import axios from 'axios';

// create an axios instance send requests the docker daemon
const instance = axios.create({
  baseURL: 'http://unix:/',
  socketPath: '/var/run/docker.sock'
})

const docker = new Dockerode({ socketPath: '/var/run/docker.sock'});

/* TO-DO: 
- write killPrometheus & killGrafana middleware 
- refactor routes and refactor destructuring of req.body to match clientside request shape
*/


const dockerController = {
  // writeMetricsCompose: async (
  //   req: Request,
  //   res: Response,
  //   next: NextFunction,
  // ): Promise<void> => {
  //   const { userData: { user_network } } = req.body;
  //   res.locals.user_network = user_network;
  //   const { clusterDir } = res.locals;
  //   // get volume
  //   const volumes = await docker.listVolumes();
  //   console.log('VOLUMES --->', volumes);
  //   // write custom prometheus/grafana docker-compose and convert to buffer
  //   const customCompose = writeMetricsCompose(user_network, clusterDir);
  //   const composeBuffer = writeBuffer(customCompose);
  //   try {
  //     outputFileSync(`./user/${clusterDir}/docker/metrics-compose.yml`, composeBuffer);
  //     return next();
  //   } catch (err) {
  //     return next({
  //       log: 'Error occured in dockerController.writeMetricsCompose Middleware',
  //       message: { err: JSON.stringify(err, Object.getOwnPropertyNames(err))}
  //     });
  //   }
  // },
  // metricsComposeUp: async (
  //   req: Request,
  //   res: Response,
  //   next: NextFunction
  // ): Promise<void> => {
  //   // docker compose is stored in ./user/${clusterDir}/docker/metrics-compose.yml
  //   const { clusterDir, user_network } = res.locals;
  //   // LOOK INTO USER THE DOCKERODE NPM PACKAGE TO SPIN UP CONTAINERS
  //   // https://github.com/apocas/dockerode
  //   // https://stackoverflow.com/questions/40961073/starting-and-stopping-docker-container-from-other-container
  //   // https://docs.docker.com/engine/api/sdk/
  //   // *** https://github.com/apocas/dockerode-compose

  //   try {
  //     const projectName = `${clusterDir}-kafkasonar-metrics`
  //     // due to an issue with dockerode-compose, create an network named projectName_${user_network}
  //     // cannot find good documentation for what is causing this issue, but this workout resolves it
  //     await docker.createNetwork({ Name: `${projectName}_${user_network}`})
  //     const ymlPath = `./user/${clusterDir}/docker/metrics-compose.yml`
  //     const compose = new DockerodeCompose(docker, ymlPath, projectName);
  //     await compose.pull();
  //     const state = await compose.up();
  //     console.log(state);
  //     return next();
  //   } catch (err) {
  //     return next({
  //       log: 'Error occured in dockerController.metricsComposeUp Middleware',
  //       message: { err: JSON.stringify(err, Object.getOwnPropertyNames(err))}
  //     });
  //   }
  // },
  runPrometheus: async (
    _req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const { clusterDir, user_network } = res.locals;
    try {
      const args = promContainerOpts(user_network, clusterDir);
      const { image, cmd, createOpts, startOpts } = args;
      // run prom
      await docker.pull(image);
      // https://www.npmjs.com/package/@types/dockerode?activeTab=code
      // https://docs.docker.com/engine/api/v1.37/#tag/Container/operation/ContainerCreate

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
      .then((data) => console.log('container removed'))
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
    // console.log('HERE ARE THE CONTAINERS --->', containers)
    const regex = new RegExp(clusterDir + '-kafkasonar-', 'g')
    
    const metricsContainersToKill = containers.filter((container) => {
      return container.Names[0].match(regex);
    })

    for (const container of containers) {
      if (container.Names[0].match(regex)) {
        console.log('CONTAINER TO DELETE', container.Names[0]);
        // curl --unix-socket /var/run/docker.sock http:/v1.43/containers/json
        const containerId = container.Id;
        // kill
        const message = await instance.post(`v1.43/containers/${containerId}/kill`)
        console.log(message.data);
        // remove
        // await instance.delete(`v1.43/containers/${containerId}/?force=true`)
      }
      // container.kill(container.Names[0])
    }
    return next();
  }
}

export default dockerController;