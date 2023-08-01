import axios from 'axios';
import { Buffer } from 'buffer';
import fs from 'fs';
import { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
dotenv.config();

const prometheusUrl = process.env.PROMETHEUS_URL;
const env = process.env.ENV;

// const prometheusUrl = 'http://host.docker.internal:9090';
// const env = 'cluster-demo';

// PROMETHEUS CONTROLLER METHODS:
// promController.initConfig - initializes the prometheus config (next middleware spins up Prometheus based on that config, next middleware spins up Grafana)
// promController.query - queries Prometheus instance each minute, next middleware modifies data if needed, next middleware saves to DB, nextmiddleware sends to FE if needed

// START UP PROMETHEUS IN A MIDDLEWARE AND THEN GRAFANA AFTER THAT:
// https://www.reddit.com/r/docker/comments/mwtl92/automatically_spinning_up_containers_on_post/
// https://www.howtogeek.com/devops/how-to-get-started-using-the-docker-engine-api/
// ***** CAN invoke Docker commands from the backend: https://docs.docker.com/desktop/extensions-sdk/guides/use-docker-socket-from-backend/

// const writeMany = (jmxArr) => {
//   // shape of user input
//   // recall that the final implementation of this will use sockets, not HTTP (ask Upasana about that)
//   // req.body.jmx = [{port, host}, {port, host}, ...]

//   // create targets array based on user input
//   const targets = JSON.stringify(jmxArr.map(obj => {
//     const { host, port } = obj;
//     return `${host}:${port}`;
//   }));

//   const ymlString = `
//   global:
//     scrape_interval: 15s

//   rule_files:

//   scrape_configs:
//     - job_name: "kafka"

//       static_configs:
//         - targets: ${targets}
//   `
//   const data = new Uint8Array(Buffer.from(ymlString));
//   try  {
//     fs.writeFileSync('../demo-cluster/configs/prometheus/test.yml', data)
//   } catch (error) {
//     console.log('ERROR', error);
//   }
// }

// const test = [
//   { host: 'kafka1', port: '8081' },
//   { host: 'kafka2', port: '8081' },
//   { host: 'kafka3', port: '8081' },
// ]
// writeMany(test);

/* Metrics Retrieval Start */

const promController = {
  getFreePhysicalMemorySize: async (
    _req: Request,
    res: Response,
    next: NextFunction
  ): Promise<unknown> => {
    const query = `kafka_jvm_os_freephysicalmemorysize{env="${env}"}`;
    try {
      const response = await axios.get(
        `${prometheusUrl}/api/v1/query?query=${query}`
      );

      if (response.data.status !== 'success') {
        throw new Error(
          `Prometheus query failed with status ${response.data.status}`
        );
      }

      res.locals.memory = response.data.data.result;
      return next();
    } catch (err) {
      return next({
        log: 'Error occured in promController.getFreePhysicalMemorySize Middleware',
        message: { err: JSON.stringify(err, Object.getOwnPropertyNames(err)) },
      });
    }
  },
};

export default promController;

/* Metrics Retrieval End */

// now all we need to do is figure out how to spin up docker containers on an api call
// middleware flow should be ->
// write promeheus config.yml
// write docker dashboard based on user-defined input (# of brokers)
// spin up custom prometheus/grafana docker compose using those files (prom on localhost:9090, grafana on localhost:3000)

// const getPromMetrics = async (query) => {
//   const promBaseURL = 'http://localhost:9090/api/v1/query?query='
//   query = promBaseURL + query;
//   const data = await axios.get(query)
//   //const data = await axios.get('http://localhost:9090/api/v1/query?query=kafka_jvm_heap_usage')
//   console.log(data.data.data.result);
// }

// getPromMetrics('sum=(kafka_controller_activecontrollercount');

/* Outstanding questions:
- How often do we want to fetch this data? Every minute in the background, or what?

- Saving dataflow for each metric we want to store:
  - query Prometheus via HTTP request
  - do any transformations we want to/need to on the result of that query
  - send that data to the FE
  - send that data to the DB

  */
