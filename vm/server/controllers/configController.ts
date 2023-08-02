import pkg from 'fs-extra';
const { copySync, outputFileSync } = pkg;
import { Request, Response, NextFunction } from 'express';
import writePrometheusConfig from '../utils/writePrometheusConfig';
import writeBuffer from '../utils/writeBuffer';
import writeGrafanaDashboard from '../utils/writeGrafanaDashboard';
import writeGrafanaDashboardConfig from '../utils/writeGrafanaDashboardConfig';
import writeGrafanaDatasource from '../utils/writeGrafanaDatasource';

const configController = {
  configPrometheus: async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    const { userData: { jmxPorts } } = req.body;
    const { userData: { clientData: { client_id } } } = req.body;
    const { userData: { user_network } } = req.body;
    res.locals.user_network = user_network;
    const clusterDir = client_id;
    res.locals.clusterDir = clusterDir;
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
      const { host, port } = jmxObj;
      return `${host}:${port}`;
    });
    // insert targets into a custom yml
    const prometheusConfigYml = writePrometheusConfig(targets);
    // convert to buffer 
    const configBuffer = writeBuffer(prometheusConfigYml);
    try {
      // we are currently in root/vm/server/controllers/configController.ts
      // want to write to root/vm/user/configs/prometheus
      outputFileSync(`./user/${clusterDir}/configs/prometheus/prometheus.yml`, configBuffer);
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
      const { numberOfBrokers, clusterDir } = res.locals;
      // write the custom dashboard and convert it into a buffer
      const grafanaDashboardJson = writeGrafanaDashboard(numberOfBrokers);
      const dashboardBuffer = writeBuffer(grafanaDashboardJson);
      try {
        // write the custom dashboard
        outputFileSync(`./user/${clusterDir}/configs/grafana/dashboards/health.json`, dashboardBuffer);
        // copy all static grafana files into this specific cluster's directory
        // first copy over static dashboards
        copySync(`./static/configs/grafana/dashboards/brokers_jvm_os.json`, `./user/${clusterDir}/configs/grafana/dashboards/brokers_jvm_os.json`);
        copySync(`./static/configs/grafana/dashboards/performance.json`, `./user/${clusterDir}/configs/grafana/dashboards/performance.json`);
        // copy over the grafana.ini to allow for the embedding of iframs on ui
        copySync(`./static/configs/grafana/grafana.ini`, `./user/${clusterDir}/configs/grafana/grafana.ini`)
        return next();
      } catch (err) {
        return next({
          log: 'Error occured in configController.writeGrafanaDashboard Middleware',
          message: { err: JSON.stringify(err, Object.getOwnPropertyNames(err))}
        });
      }
  },

  writeGrafanaDashboardConfig: async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const { clusterDir } = res.locals;
    const grafDashboardConfigYml = writeGrafanaDashboardConfig(clusterDir);
    const grafDashboardConfigBuffer = writeBuffer(grafDashboardConfigYml);
    try {
      // write to ./user/clusterDir/configs/grafana/provisioning/dashboards/kafka-sonar.yml
      outputFileSync(`./user/${clusterDir}/configs/grafana/provisioning/dashboards/kafka-sonar.yml`, grafDashboardConfigBuffer);
      return next();
    } catch (err) {
      return next({
        log: 'Error occured in configController.writeGrafanaDashboardConfig Middleware',
        message: { err: JSON.stringify(err, Object.getOwnPropertyNames(err))}
      });
    }
  },
  writeGrafanaDatasource: async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const { clusterDir } = res.locals;
    const grafDatasourceYml = writeGrafanaDatasource(clusterDir);
    const grafDatasourceBuffer = writeBuffer(grafDatasourceYml);
    try {
      outputFileSync(`./user/${clusterDir}/configs/grafana/provisioning/datasources/datasource.yml`, grafDatasourceBuffer);
      return next();
    } catch (err) {
      return next({
        log: 'Error occured in configController.writeGrafanaDatasource Middleware',
        message: { err: JSON.stringify(err, Object.getOwnPropertyNames(err))}
      });
    }
  }
};

export default configController;