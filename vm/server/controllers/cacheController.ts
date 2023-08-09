import { Request, Response, NextFunction } from 'express';
import cache from 'memory-cache';

const cacheController = {
  // cacheClusterId: cache the connected cluster's PK in the DB for metrics scraping
  cacheClusterId: async (
    req: Request,
    _res: Response,
    next: NextFunction
  ): Promise<void> => {
    const { cluster_id } = req.params;
    cache.put('connectedClusterId', Number(cluster_id));
    return next();
  },
  // clearCache: clear the cache on disconnect
  clearCache: async (
    _req: Request,
    _res: Response,
    next: NextFunction
  ): Promise<void> => {
    cache.clear();
    return next();
  },
}

export default cacheController;