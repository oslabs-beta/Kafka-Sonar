import { Buffer } from 'buffer';
import fs, { write } from 'fs';
import { Request, Response, NextFunction } from 'express';
import writeMetricsCompose from '../utils/writeMetricsCompose';
import writeBuffer from '../utils/writeBuffer';

const dockerController = {
  writeMetricsCompose: async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    const { userData: { network } } = req.body;
    const { userData: { clientData: { client_id } } } = req.body;
    const customCompose = writeMetricsCompose(network, client_id);
    const composeBuffer = writeBuffer(customCompose);
    try {
      fs.writeFileSync(`./user/docker/${client_id}-metrics-compose.yml`, composeBuffer);
      return next();
    } catch (err) {
      return next({
        log: 'Error occured in configController.configPrometheus Middleware',
        message: { err: JSON.stringify(err, Object.getOwnPropertyNames(err))}
      });
    }
  }
}

export default dockerController;