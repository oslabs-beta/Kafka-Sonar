import axios from 'axios';
import { Buffer } from 'buffer';
import fs from 'fs';

// PROMETHEUS CONTROLLER METHODS:
  // promController.initConfig - initializes the prometheus config (next middleware spins up Prometheus based on that config, next middleware spins up Grafana)
  // promController.query - queries Prometheus instance each minute, next middleware modifies data if needed, next middleware saves to DB, nextmiddleware sends to FE if needed

// START UP PROMETHEUS IN A MIDDLEWARE AND THEN GRAFANA AFTER THAT:
// https://www.reddit.com/r/docker/comments/mwtl92/automatically_spinning_up_containers_on_post/
// https://www.howtogeek.com/devops/how-to-get-started-using-the-docker-engine-api/
// ***** CAN invoke Docker commands from the backend: https://docs.docker.com/desktop/extensions-sdk/guides/use-docker-socket-from-backend/

const writeMany = (jmxArr) => {
  // shape of user input
  // recall that the final implementation of this will use sockets, not HTTP (ask Upasana about that)
  // req.body.jmx = [{port, host}, {port, host}, ...]

  // create targets array based on user input
  const targets = JSON.stringify(jmxArr.map(obj => {
    const { host, port } = obj;
    return `${host}:${port}`;
  }));

  const ymlString = `
  global:
    scrape_interval: 15s
  
  rule_files:
  
  scrape_configs:
    - job_name: "kafka"
  
      static_configs:
        - targets: ${targets}`
  const data = new Uint8Array(Buffer.from(ymlString));
  // @ts-ignore
  fs.writeFileSync('./demo-cluster/configs/prometheus/test.yml', data, (err: undefined) => {
    if (err) console.log('ERROR', err);
    console.log('the file has been saved!');
  });
}

const test = [
  { host: 'kafka1', port: '8081' },
  { host: 'kafka2', port: '8081' },
  { host: 'kafka3', port: '8081' },
]
writeMany(test);

// now all we need to do is figure out how to spin up docker containers on an api call
// middleware flow should be ->
// write promeheus config.yml
// spin up prometheus container on localhost:9090
// spin up Grafana on localhost:3000


const getPromMetrics = async () => {
  const promBaseURL = 'http://localhost:9090/api/v1/query?query='
  // const data = await axios.get('http://localhost:9090/api/v1/query?query=sum(kafka_controller_activecontrollercount)')
  const data = await axios.get('http://localhost:9090/api/v1/query?query=kafka_jvm_heap_usage')
  console.log(data.data.data.result);
}

// getPromMetrics();

/* 
MOST IMPORTANT

What metrics do we want to alert on? 
  CLUSTER LEVEL
  Offline brokers > 0

  BROKER LEVEL
  Offline replicas > 0
  URPs > 0
  Out-of-sync replicas > 0

What do we want to store in the TimescaleDB?
  CLUSTER LEVEL
  Messages in per Broker
  Bytes in per Broker
  Bytes out per Broker
  Messages in per Topic
  Bytes in per Topic
  Bytes out per Topic
  BROKER LEVEL
*/

/* Outstanding questions:
- How often do we want to fetch this data? Every minute in the background, or what?

- Saving dataflow for each metric we want to store:
  - query Prometheus via HTTP request
  - do any transformations we want to/need to on the result of that query
  - send that data to the FE
  - send that data to the DB

  */