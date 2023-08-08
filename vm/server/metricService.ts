import axios from 'axios';
import { query } from './models/appModel';
import cache from 'memory-cache';

interface Metric {
  env: string;
  __name__: string;
  instance: string;
  job: string;
  service: string;
  request?: string;
  aggregate?: string;
  scope?: string;
}

interface MetricEntry {
  endpoint: string;
  metric_name: string;
  env: string;
  instance: string;
  job: string;
  service: string;
  request: string;
  aggregate: string;
  scope: string;
  value: number;
  timestamp: number;
}

const storeMetrics = async (): Promise<void> => {
  const metricNames = [
    'freePhysicalMemorySize', 'systemCpuLoad', 'heapUsage', 'activeControllerCount', 
    'onlineBrokersCount', 'offlineBrokersCount', 'produceRequestPerSec', 'bytesInPerSec', 
    'fetchConsumerPerSec', 'bytesOutPerSec', 'fetchRequestMetricsTime', 'fetchConsumerReqMetricsTime', 
    'fetchFollowerReqMetricsTime', 'produceRequestMetricsTime', 'offlinePartitionsCount', 'underReplicatedPartitions',
    'underMinISR', 'partitionCount', 'leaderCount', 'uncleanLeaderElectionsPerSec',
  ];

  try {
    const currentClusterId: string = cache.get('connectedClusterId'); 
    for (let metricName of metricNames) {
      const url: string = 
        metricName === 'offlineBrokersCount' 
        ? `http://localhost:3333/api/prom/${metricName}/${currentClusterId}` 
        : `http://localhost:3333/api/prom/${metricName}`;

      const response = await axios.get(url);
      const metrics = response.data;

      const metricEntries: MetricEntry[] = [];
      for (let i = 0; i < metrics.length; i++) {
        let metric: Metric = metrics[i].metric;
        const timestamp: number = metrics[i].value[0];
        const value: number = parseFloat(metrics[i].value[1]); // Parse value as float

        if (Object.keys(metric).length === 0) {
          // Populate fields if metric object is empty
          metric = {
            env: process.env.ENV || "",
            __name__: metricName,
            instance: "N/A",
            job: "N/A",
            service: "N/A"
          };
        }

        const metricEntry: MetricEntry = {
          endpoint: metricName,
          metric_name: metric.__name__,
          env: metric.env,
          instance: metric.instance,
          job: metric.job,
          service: metric.service,
          request: metric.request || "N/A",
          aggregate: metric.aggregate || "N/A",
          scope: metric.scope || "N/A",
          value,
          timestamp
        };
        
        metricEntries.push(metricEntry);
      }

      // Execute batch insert
      await Promise.all(metricEntries.map(async (metricEntry) => {
        await query(`
            INSERT INTO metrics_table (endpoint, metric_name, env, instance, job, service, request, aggregate, scope, value, timestamp, cluster_id)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, TO_TIMESTAMP($11), $12)
            ON CONFLICT DO NOTHING`,
          [
            metricEntry.endpoint,
            metricEntry.metric_name,
            metricEntry.env,
            metricEntry.instance,
            metricEntry.job,
            metricEntry.service,
            metricEntry.request,
            metricEntry.aggregate,
            metricEntry.scope,
            metricEntry.value,
            metricEntry.timestamp,
            currentClusterId,
          ]
        );
      }));
    }

  } catch (error) {
    console.error(`Failed to fetch and store metrics: ${error}`);
    throw error;
  }
};

export { storeMetrics };