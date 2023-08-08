import { Request, Response, NextFunction } from 'express';
import cache from 'memory-cache';

const cacheController = {
  cacheClusterId: async (
    req: Request,
    _res: Response,
    next: NextFunction
  ): Promise<void> => {
    const { cluster_id } = req.params;
    console.log(typeof cluster_id, "is the type of the cluster_id on req.params")
    cache.put('connectedClusterId', Number(cluster_id));
    return next();
  },
  clearCache: async (
    _req: Request,
    _res: Response,
    next: NextFunction
  ): Promise<void> => {
    cache.clear();
    return next();
  },
  testCache: async (
    _req: Request,
    _res: Response,
    next: NextFunction
  ): Promise<void> => {
    console.log('TEST CACHE ROUTE', cache.size());
    return next();
  },
}

export default cacheController;