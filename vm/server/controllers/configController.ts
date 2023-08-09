import pkg from 'fs-extra';
const { copySync, outputFileSync } = pkg;
import { Request, Response, NextFunction } from 'express';
import writePrometheusConfig from '../utils/writePrometheusConfig';
import writeBuffer from '../utils/writeBuffer';
import writeGrafanaDashboard from '../utils/writeGrafanaDashboard';
import writeGrafanaDashboardConfig from '../utils/writeGrafanaDashboardConfig';
import writeGrafanaDatasource from '../utils/writeGrafanaDatasource';

const configController = {
  // configPrometheus: write a custom prometheus configuration to store it in the user volume under the connected cluster's directory
  configPrometheus: async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    const { 
      client, 
      host, 
      port, 
      auth, 
      username, 
      password, 
      network, 
      brokerInfo 
    } = req.body;
    res.locals.network = network;
    const clusterDir = client;
    res.locals.clusterDir = clusterDir;
    // get number of brokers from user request and add to res.locals
    const numberOfBrokers = brokerInfo.length;
    if (numberOfBrokers <= 0) throw Error();
    res.locals.numberOfBrokers = numberOfBrokers;
    /* 
      shape of jmxPorts is as follows:
      [ { broker: number, port: string, host: string }, ...]
    */
    // create prometheus targets based on jmxPorts
    const targets = brokerInfo.map(jmxObj => {
      const { host, port } = jmxObj;
      return `${host}:${port}`;
    });
    // insert targets into a custom yml
    const prometheusConfigYml = writePrometheusConfig(targets);
    // convert to buffer 
    const configBuffer = writeBuffer(prometheusConfigYml);
    try {
      // we are currently in backend; want to write to backend/user/configs/prometheus
      outputFileSync(`./user/${clusterDir}/configs/prometheus/prometheus.yml`, configBuffer);
      return next();
    } catch (err) {
      return next({
        log: 'Error occurred in configController.configPrometheus Middleware',
        message: { err: JSON.stringify(err, Object.getOwnPropertyNames(err))}
      });
    }
  },
  /*
   writeGrafanaDashboard: write a custom grafana dashboard to store it in the user volume under the
   connected cluster's directory, then copy the static dashboards to that same directory
  */
  writeGrafanaDashboard: async (
    req: Request,
    res: Response,
    next: NextFunction
    ): Promise<void> => {
      // get the number of brokers from previous middleware
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
        // copy over the grafana.ini to allow for the embedding of iframes on the ui
        copySync(`./static/configs/grafana/grafana.ini`, `./user/${clusterDir}/configs/grafana/grafana.ini`)
        return next();
      } catch (err) {
        return next({
          log: 'Error occurred in configController.writeGrafanaDashboard Middleware',
          message: { err: JSON.stringify(err, Object.getOwnPropertyNames(err))}
        });
      }
  },
  /*
   writeGrafanaDashboardConfig: write a custom grafana dashboard config to store it in the user volume under the
   connected cluster's directory
  */
  writeGrafanaDashboardConfig: async (
    _req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const { clusterDir } = res.locals;
    // write the dashboard config
    const grafDashboardConfigYml = writeGrafanaDashboardConfig(clusterDir);
    // convert it to a buffer
    const grafDashboardConfigBuffer = writeBuffer(grafDashboardConfigYml);
    try {
      // store it in the user volume under the cluster's directory
      outputFileSync(`./user/${clusterDir}/configs/grafana/provisioning/dashboards/kafka-sonar.yml`, grafDashboardConfigBuffer);
      return next();
    } catch (err) {
      return next({
        log: 'Error occurred in configController.writeGrafanaDashboardConfig Middleware',
        message: { err: JSON.stringify(err, Object.getOwnPropertyNames(err))}
      });
    }
  },
  /*
   writeGrafanaDatasource: write a custom grafana datasource to store it in the user volume under the
   connected cluster's directory
  */
  writeGrafanaDatasource: async (
    _req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const { clusterDir } = res.locals;
    // write the datasource file
    const grafDatasourceYml = writeGrafanaDatasource(clusterDir);
    // convert it to a buffer
    const grafDatasourceBuffer = writeBuffer(grafDatasourceYml);
    try {
      // store it in the user volume under the cluster's directory
      outputFileSync(`./user/${clusterDir}/configs/grafana/provisioning/datasources/datasource.yml`, grafDatasourceBuffer);
      return next();
    } catch (err) {
      return next({
        log: 'Error occurred in configController.writeGrafanaDatasource Middleware',
        message: { err: JSON.stringify(err, Object.getOwnPropertyNames(err))}
      });
    }
  }
};

export default configController;