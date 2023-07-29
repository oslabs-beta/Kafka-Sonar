import pkg from 'fs-extra';
const { outputFileSync } = pkg;
import { Request, Response, NextFunction } from 'express';
import writeMetricsCompose from '../utils/writeMetricsCompose';
import writeBuffer from '../utils/writeBuffer';


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
  sendMetricsComposeUp: async (
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
      // const command = {
      //   cmd: `docker compose`,
      //   args: [`-f`, `http://localhost:3333/backend/user/${clusterDir}/docker/metrics-compose.yml`, `up`],
      //   // options: {
      //   //   cwd: `./user/${clusterDir}/docker`
      //   // }
      //}
      const TASK = `insert dockerode package action here`
      // res.locals.command = command
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