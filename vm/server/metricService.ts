import axios from 'axios';
import { query } from './models/appModel';
import cache from 'memory-cache';
import { CONFIG } from '../config';

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

// Responsible for fetching and storing metric data into the `metrics_table` database table
// Fetches metric data using predefined metric names, processes the data, and then inserts it as new entries
const storeMetrics = async (): Promise<void> => {
  // Predefined metric names to fetch data for
  const metricNames = [
    'freePhysicalMemorySize', 'systemCpuLoad', 'heapUsage', 'activeControllerCount', 
    'onlineBrokersCount', 'offlineBrokersCount', 'produceRequestPerSec', 'bytesInPerSec', 
    'fetchConsumerPerSec', 'bytesOutPerSec', 'fetchRequestMetricsTime', 'fetchConsumerReqMetricsTime', 
    'fetchFollowerReqMetricsTime', 'produceRequestMetricsTime', 'offlinePartitionsCount', 'underReplicatedPartitions',
    'underMinISR', 'partitionCount', 'leaderCount', 'uncleanLeaderElectionsPerSec',
  ];

  try {
    // Get the current cluster ID from cache
    const currentClusterId: string = cache.get('connectedClusterId'); 

    // Loop through each metric name to fetch and store its data
    for (let metricName of metricNames) {

      // Construct the appropriate URL based on the metric name
      const url: string = 
        metricName === 'offlineBrokersCount' 
        ? `http://localhost:${CONFIG.METRICS_PORT}/api/prom/${metricName}/${currentClusterId}` 
        : `http://localhost:${CONFIG.METRICS_PORT}/api/prom/${metricName}`;

      // Fetch metric data from the constructed URL
      const response = await axios.get(url);
      const metrics = response.data;
      const metricEntries: MetricEntry[] = [];

      for (let i = 0; i < metrics.length; i++) {
        let metric: Metric = metrics[i].metric;
        const timestamp: number = metrics[i].value[0];
        const value: number = parseFloat(metrics[i].value[1]); // Parse value as float

        // Fallback for metrics that don't have a predefined structure
        if (Object.keys(metric).length === 0) {
          metric = {
            env: CONFIG.ENV || "",
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

      // Insert the processed metric data into the database, in a batch manner
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