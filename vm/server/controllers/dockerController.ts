import pkg from 'fs-extra';
const { outputFileSync } = pkg;
import { Request, Response, NextFunction } from 'express';
import writeMetricsCompose from '../utils/writeMetricsCompose';
import writeBuffer from '../utils/writeBuffer';
// import { createDockerDesktopClient } from '@docker/extension-api-client';
// // Note: This line relies on Docker Desktop's presence as a host application.
// const client = createDockerDesktopClient();
// function useDockerDesktopClient() {
//   return client;
// }
// const ddClient = useDockerDesktopClient();


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
    try {
      const cd = {
        cmd: `cd`,
        options: [`./user/${clusterDir}/docker`]
      };
      const compose = {
        cmd: `docker-compose`,
        options: [`-f`, `metrics-compose.yml`, `up`],
      };
      res.locals.commands = { cd, compose }
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