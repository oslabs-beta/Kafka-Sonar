import axios from 'axios';
import { Buffer } from 'buffer';
import fs from 'fs';
import { Request, Response, NextFunction } from 'express';
import writePrometheusConfig from '../utils/writePrometheusConfig';

const configController = {
  configPrometheus: async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    const { userData: { jmxPorts } } = req.body;
    const { userData: { clientData: { client_id } } } = req.body;
    // get number of brokers from user request and add to res.locals
    const numberOfBrokers = jmxPorts.length;
    if (numberOfBrokers <= 0) throw Error();
    res.locals.numberOfBrokers = numberOfBrokers;
    /* 
      shape of jmxPorts is as follows:
      [ { broker: number, port: string, host: string }, ...]
    */
    // create prometheus targets based on jmxPorts
    const targets = JSON.stringify(jmxPorts.map(jmxObj => {
      const { host, port } = jmxObj;
      return `${host}:${port}`;
    }));
    // insert targets into a custom yml
    const prometheusConfigYml = writePrometheusConfig(targets);
    const configBuffer = new Uint8Array(Buffer.from(prometheusConfigYml));
    try {
      // we are currently in root/vm/server/controllers/configController.ts
      // want to write to root/vm/user/configs/prometheus
      fs.writeFileSync(`./user/configs/prometheus/${client_id}-prometheus.yml`, configBuffer);
      return next();
    } catch (err) {
      return next({
        log: 'Error occured in configController.configPrometheus Middleware',
        message: { err: JSON.stringify(err, Object.getOwnPropertyNames(err))}
      });
    }
  },

  writeGrafanaDashboard: async (
    req: Request,
    res: Response,
    next: NextFunction
    ): Promise<void> => {
      // get the number of brokers from preivous middleware
      const { numberOfBrokers } = res.locals;
    }
};

export default configController;