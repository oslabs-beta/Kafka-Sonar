import express from 'express';
import { Request, Response, NextFunction } from 'express';
import promController from '../controllers/promController';

const promRouter = express.Router();

// "ID": 1
promRouter.get(
  '/freePhysicalMemorySize',
  promController.getFreePhysicalMemorySize,
  (_req: Request, res: Response, _next: NextFunction): void => {
    res.status(200).json(res.locals.memory);
  }
);
// "ID": 2
promRouter.get(
  '/systemCpuLoad',
  promController.getSystemCpuLoad,
  (_req: Request, res: Response, _next: NextFunction): void => {
    res.status(200).json(res.locals.cpuLoad);
  }
);
// "ID": 3
promRouter.get(
  '/heapUsage',
  promController.getHeapUsage,
  (_req: Request, res: Response, _next: NextFunction): void => {
    res.status(200).json(res.locals.heapUsage);
  }
);
// "ID": 4
promRouter.get(
  '/activeControllerCount',
  promController.getActiveControllerCount,
  (_req: Request, res: Response, _next: NextFunction): void => {
    res.status(200).json(res.locals.activeControllerCount);
  }
);
// "ID": 5
promRouter.get(
  '/onlineBrokersCount',
  promController.getOnlineBrokersCount,
  (_req: Request, res: Response, _next: NextFunction): void => {
    res.status(200).json(res.locals.onlineBrokersCount);
  }
);
// "ID": 6
promRouter.get(
  '/offlineBrokersCount/:currentClusterId',
  promController.getOfflineBrokersCount,
  (_req: Request, res: Response, _next: NextFunction): void => {
    res.status(200).json(res.locals.offlineBrokersCount);
  }
);
// "ID": 7
promRouter.get(
  '/produceRequestPerSec',
  promController.getProduceRequestPerSec,
  (_req: Request, res: Response, _next: NextFunction): void => {
    res.status(200).json(res.locals.produceRequestPerSec);
  }
);
// "ID": 8
promRouter.get(
  '/bytesInPerSec',
  promController.getBytesInPerSec,
  (_req: Request, res: Response, _next: NextFunction): void => {
    res.status(200).json(res.locals.bytesInPerSec);
  }
);
// "ID": 9
promRouter.get(
  '/fetchConsumerPerSec',
  promController.getFetchConsumerPerSec,
  (_req: Request, res: Response, _next: NextFunction): void => {
    res.status(200).json(res.locals.fetchConsumerPerSec);
  }
);
// "ID": 10
promRouter.get(
  '/bytesOutPerSec',
  promController.getBytesOutPerSec,
  (_req: Request, res: Response, _next: NextFunction): void => {
    res.status(200).json(res.locals.bytesOutPerSec);
  }
);
// // "ID": 11
// promRouter.get(
//   '/requestMetricsTime/:request',
//   promController.getRequestMetricsTime,
//   (_req: Request, res: Response, _next: NextFunction): void => {
//     res.status(200).json(res.locals.requestMetricsTime);
//   }
// );
// "ID": 11a
promRouter.get(
  '/fetchRequestMetricsTime',
  promController.getFetchRequestMetricsTime,
  (_req: Request, res: Response, _next: NextFunction): void => {
    res.status(200).json(res.locals.fetchRequestMetricsTime);
  }
);
// "ID": 11b
promRouter.get(
  '/fetchConsumerReqMetricsTime',
  promController.getFetchConsumerReqMetricsTime,
  (_req: Request, res: Response, _next: NextFunction): void => {
    res.status(200).json(res.locals.fetchConsumerReqMetricsTime);
  }
);
// "ID": 11c
promRouter.get(
  '/fetchFollowerReqMetricsTime',
  promController.getFetchFollowerReqMetricsTime,
  (_req: Request, res: Response, _next: NextFunction): void => {
    res.status(200).json(res.locals.fetchFollowerReqMetricsTime);
  }
);
// "ID": 11d
promRouter.get(
  '/produceRequestMetricsTime',
  promController.getProduceRequestMetricsTime,
  (_req: Request, res: Response, _next: NextFunction): void => {
    res.status(200).json(res.locals.produceRequestMetricsTime);
  }
);
// "ID": 12
promRouter.get(
  '/offlinePartitionsCount',
  promController.getOfflinePartitionsCount,
  (_req: Request, res: Response, _next: NextFunction): void => {
    res.status(200).json(res.locals.offlinePartitionsCount);
  }
);
// "ID": 13
promRouter.get(
  '/underReplicatedPartitions',
  promController.getUnderReplicatedPartitions,
  (_req: Request, res: Response, _next: NextFunction): void => {
    res.status(200).json(res.locals.underReplicatedPartitions);
  }
);
// "ID": 14
promRouter.get(
  '/underMinISR',
  promController.getUnderMinISR,
  (_req: Request, res: Response, _next: NextFunction): void => {
    res.status(200).json(res.locals.underMinISR);
  }
);
// "ID": 15
promRouter.get(
  '/partitionCount',
  promController.getPartitionCount,
  (_req: Request, res: Response, _next: NextFunction): void => {
    res.status(200).json(res.locals.partitionCount);
  }
);
// "ID": 16
promRouter.get(
  '/leaderCount',
  promController.getLeaderCount,
  (_req: Request, res: Response, _next: NextFunction): void => {
    res.status(200).json(res.locals.leaderCount);
  }
);
// "ID": 17
promRouter.get(
  '/uncleanLeaderElectionsPerSec',
  promController.getUncleanLeaderElectionsPerSec,
  (_req: Request, res: Response, _next: NextFunction): void => {
    res.status(200).json(res.locals.uncleanLeaderElectionsPerSec);
  }
);

export default promRouter;