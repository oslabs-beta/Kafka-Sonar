import pkg from 'fs-extra';
const { outputFileSync } = pkg;
import { Request, Response, NextFunction } from 'express';
import writeMetricsCompose from '../utils/writeMetricsCompose';
import writeBuffer from '../utils/writeBuffer';
import Dockerode from 'dockerode';
import DockerodeCompose from 'dockerode-compose';

const docker = new Dockerode({ socketPath: '/var/run/docker.sock'});


const dockerController = {
  writeMetricsCompose: async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    const { userData: { user_network } } = req.body;
    const { clusterDir } = res.locals;
    // write custom prometheus/grafana docker-compose and convert to buffer
    const customCompose = writeMetricsCompose(user_network, clusterDir);
    const composeBuffer = writeBuffer(customCompose);
    try {
      outputFileSync(`./user/${clusterDir}/docker/metrics-compose.yml`, composeBuffer);
      return next();
    } catch (err) {
      return next({
        log: 'Error occured in configController.writeMetricsCompose Middleware',
        message: { err: JSON.stringify(err, Object.getOwnPropertyNames(err))}
      });
    }
  },
  metricsComposeUp: async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    // docker compose is stored in ./user/${clusterDir}/docker/metrics-compose.yml
    const { clusterDir } = res.locals;
    // LOOK INTO USER THE DOCKERODE NPM PACKAGE TO SPIN UP CONTAINERS
    // https://github.com/apocas/dockerode
    // https://stackoverflow.com/questions/40961073/starting-and-stopping-docker-container-from-other-container
    // https://docs.docker.com/engine/api/sdk/
    // *** https://github.com/apocas/dockerode-compose

    try {
      console.log('HERE IS OUR DIRECTORY --------->', __dirname);
      const path = `./user/${clusterDir}/docker/metrics-compose.yml`
      const compose = new DockerodeCompose(docker, path, `${clusterDir}-kafkasonar-metrics`);
      // const compose = new DockerodeCompose(docker, path);
      await compose.pull();
      const state = await compose.up();
      console.log(state);
      return next();
    } catch (err) {
      return next({
        log: 'Error occured in configController.metricsComposeUp Middleware',
        message: { err: JSON.stringify(err, Object.getOwnPropertyNames(err))}
      });
    }
  }
}

export default dockerController;