import fs from 'fs';
import pkg from 'fs-extra';
const { copySync, outputFileSync } = pkg;
import { Request, Response, NextFunction } from 'express';
import writePrometheusConfig from '../utils/writePrometheusConfig';
import writeBuffer from '../utils/writeBuffer';
import writeGrafanaDashboard from '../utils/writeGrafanaDashboard';

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
    const targets = jmxPorts.map(jmxObj => {
      const { jmx_hostname, jmx_port_number } = jmxObj;
      return `${jmx_hostname}:${jmx_port_number}`;
    });
    // insert targets into a custom yml
    const prometheusConfigYml = writePrometheusConfig(targets);
    // convert to buffer 
    const configBuffer = writeBuffer(prometheusConfigYml);
    try {
      // we are currently in root/vm/server/controllers/configController.ts
      // want to write to root/vm/user/configs/prometheus
      outputFileSync(`./user/${client_id}/configs/prometheus/prometheus.yml`, configBuffer);
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
      const { userData: { clientData: { client_id } } } = req.body;
      const grafanaDashboardJson = writeGrafanaDashboard(numberOfBrokers);
      const dashboardBuffer = writeBuffer(grafanaDashboardJson);
      try {
        // write the custom dashboard
        outputFileSync(`./user/${client_id}/configs/grafana/dashboards/health.json`, dashboardBuffer);
        // copy all static grafana files into this specific cluster's directory
        // first copy over static dashboards
        copySync(`./static/configs/grafana/dashboards/brokers_jvm_os.json`, `./user/${client_id}/configs/grafana/dashboards/brokers_jvm_os.json`);
        copySync(`./static/configs/grafana/dashboards/performance.json`, `./user/${client_id}/configs/grafana/dashboards/performance.json`);
        // then copy over all provisioning files
        copySync(`./static/configs/grafana/provisioning`, `./user/${client_id}/configs/grafana/provisioning/`)
        return next();
      } catch (err) {
        return next({
          log: 'Error occured in configController.writeGrafanaDashboard Middleware',
          message: { err: JSON.stringify(err, Object.getOwnPropertyNames(err))}
        });
      }
    }
};

export default configController;