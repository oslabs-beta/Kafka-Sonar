import axios from 'axios';
import { Buffer } from 'buffer';
import fs from 'fs';
import { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
dotenv.config();

const prometheusUrl = process.env.PROMETHEUS_URL;
const env = process.env.ENV;
const numberOfBrokers = process.env.NUMBER_OF_BROKERS;

const promController = {
  // "ID": 1
  getFreePhysicalMemorySize: async (_req: Request, res: Response, next: NextFunction): Promise<unknown> => {
    const query = `kafka_jvm_os_freephysicalmemorysize{env="${env}"}`;
    return fetchData(query, 'memory', res, next);
  },
  // "ID": 2
  getSystemCpuLoad: async (_req: Request, res: Response, next: NextFunction): Promise<unknown> => {
    const query = `kafka_jvm_os_systemcpuload{env="${env}"}`;
    return fetchData(query, 'cpuLoad', res, next);
  },
  // "ID": 3
  getHeapUsage: async (_req: Request, res: Response, next: NextFunction): Promise<unknown> => {
    const query = `kafka_jvm_heap_usage{env="${env}", type="used"}`;
    return fetchData(query, 'heapUsage', res, next);
  },
  // "ID": 4
  getActiveControllerCount: async (_req: Request, res: Response, next: NextFunction): Promise<unknown> => {
    const query = `sum(kafka_controller_activecontrollercount{env="${env}"})`;
    return fetchData(query, 'activeControllerCount', res, next);
  },
  // "ID": 5
  getOnlineBrokersCount: async (_req: Request, res: Response, next: NextFunction): Promise<unknown> => {
    const query = `count((kafka_server_brokerstate{env="${env}"}) == 3 or (kafka_server_brokerstate{env="${env}"}) == 4)`;
    return fetchData(query, 'onlineBrokersCount', res, next);
  },
  // "ID": 6
  getOfflineBrokersCount: async (req: Request, res: Response, next: NextFunction): Promise<unknown> => {
    // Frontend sends clusterId and we use it to query the database
    const { currentClusterId } = req.params;
    // And then we query for the number of brokers
    const portsArr: any = await axios.get(`http://localhost:3332/api/clusters/jmxports/${currentClusterId}`);
    console.log('Ports Array ----> ', portsArr.data);
    const numberOfBrokers = portsArr.data.length;
    console.log('numb brokers ----> ', numberOfBrokers);
    
    const query = `${numberOfBrokers}-count((kafka_server_brokerstate{env="${env}"}) == 3 or (kafka_server_brokerstate{env="${env}"}) == 4)`;
    // const query = `3-count((kafka_server_brokerstate{env="${env}"}) == 3 or (kafka_server_brokerstate{env="${env}"}) == 4)`;
    return fetchData(query, 'offlineBrokersCount', res, next);
  },
  // "ID": 7
  getProduceRequestPerSec: async (_req: Request, res: Response, next: NextFunction): Promise<unknown> => {
    const query = `sum(kafka_network_request_per_sec{aggregate=~"OneMinuteRate",request=~"Produce",env="${env}"})`;
    return fetchData(query, 'produceRequestPerSec', res, next);
  },
  // "ID": 8
  getBytesInPerSec: async (_req: Request, res: Response, next: NextFunction): Promise<unknown> => {
    const query = `sum(kafka_server_broker_topic_metrics_bytesinpersec_rate{topic=""}) by (broker)`;
    return fetchData(query, 'bytesInPerSec', res, next);
  },
  // "ID": 9
  getFetchConsumerPerSec: async (_req: Request, res: Response, next: NextFunction): Promise<unknown> => {
    const query = `sum(kafka_network_request_per_sec{aggregate=~"OneMinuteRate",request=~"FetchConsumer",env="${env}"})`;
    return fetchData(query, 'fetchConsumerPerSec', res, next);
  },
  // "ID": 10
  getBytesOutPerSec: async (_req: Request, res: Response, next: NextFunction): Promise<unknown> => {
    const query = `sum(kafka_server_broker_topic_metrics_bytesoutpersec_rate{topic=""}) by (broker)`;
    return fetchData(query, 'bytesOutPerSec', res, next);
  },
  // "ID": 11
  getFetchRequestMetricsTime: async (req: Request, res: Response, next: NextFunction): Promise<unknown> => {
    const query = `kafka_network_request_metrics_time_ms{request=~"Fetch", aggregate=~"Mean", scope=~"Total",env="${env}"}`;
    return fetchData(query, 'fetchRequestMetricsTime', res, next);
  },
  // "ID": 12
  getFetchConsumerReqMetricsTime: async (req: Request, res: Response, next: NextFunction): Promise<unknown> => {
    const query = `kafka_network_request_metrics_time_ms{request=~"FetchConsumer", aggregate=~"Mean", scope=~"Total",env="${env}"}`;
    return fetchData(query, 'fetchConsumerReqMetricsTime', res, next);
  },
  // "ID": 13
  getFetchFollowerReqMetricsTime: async (req: Request, res: Response, next: NextFunction): Promise<unknown> => {
    const query = `kafka_network_request_metrics_time_ms{request=~"FetchFollower", aggregate=~"Mean", scope=~"Total",env="${env}"}`;
    return fetchData(query, 'fetchFollowerReqMetricsTime', res, next);
  },
  // "ID": 14
  getProduceRequestMetricsTime: async (req: Request, res: Response, next: NextFunction): Promise<unknown> => {
    const query = `kafka_network_request_metrics_time_ms{request=~"Produce", aggregate=~"Mean", scope=~"Total",env="${env}"}`;
    return fetchData(query, 'produceRequestMetricsTime', res, next);
  },
  // "ID": 15
  getOfflinePartitionsCount: async (_req: Request, res: Response, next: NextFunction): Promise<unknown> => {
    const query = `sum(kafka_controller_offlinepartitionscount{env="${env}"})`;
    return fetchData(query, 'offlinePartitionsCount', res, next);
  },
  // "ID": 16
  getUnderReplicatedPartitions: async (_req: Request, res: Response, next: NextFunction): Promise<unknown> => {
    const query = `sum(kafka_server_replica_manager_underreplicatedpartitions{env="${env}"})`;
    return fetchData(query, 'underReplicatedPartitions', res, next);
  },
  // "ID": 17
  getUnderMinISR: async (_req: Request, res: Response, next: NextFunction): Promise<unknown> => {
    const query = `sum(kafka_cluster_partition_underminisr{env="${env}"})`;
    return fetchData(query, 'underMinISR', res, next);
  },
  // "ID": 18
  getPartitionCount: async (_req: Request, res: Response, next: NextFunction): Promise<unknown> => {
    const query = `kafka_server_replica_manager_partitioncount{env="${env}"}`;
    return fetchData(query, 'partitionCount', res, next);
  },
  // "ID": 19
  getLeaderCount: async (_req: Request, res: Response, next: NextFunction): Promise<unknown> => {
    const query = `kafka_server_replica_manager_leadercount{env="${env}"}`;
    return fetchData(query, 'leaderCount', res, next);
  },
  // "ID": 20
  getUncleanLeaderElectionsPerSec: async (_req: Request, res: Response, next: NextFunction): Promise<unknown> => {
    const query = `kafka_controller_stats_uncleanleaderelectionspersec{aggregate="OneMinuteRate",env="${env}"}`;
    return fetchData(query, 'uncleanLeaderElectionsPerSec', res, next);
  },

};

const fetchData = async (query: string, field: string, res: Response, next: NextFunction): Promise<unknown> => {
  try {
    const response = await axios.get(`${prometheusUrl}/api/v1/query?query=${query}`);

    if (response.data.status !== 'success') {
      throw new Error(`Prometheus query failed with status ${response.data.status}`);
    }

    res.locals[field] = response.data.data.result;

    return next();
  } catch (err) {
    return next({
      log: `Error occurred in promController.${field} Middleware`,
      message: { err: JSON.stringify(err, Object.getOwnPropertyNames(err)) },
    });
  }
};

export default promController;