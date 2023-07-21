import { query } from '../models/appModel';
import { Request, Response, NextFunction } from 'express';

const clusterController = {
  getAllClusters: async (
    _req: Request,
    res: Response,
    next: NextFunction
  ): Promise<unknown> => {
    try {
      const request = 'SELECT * FROM clusters';
      // const values: any = [];
      const response: any = await query(request);
      res.locals.clusters = response.rows;
      return next();
    } catch (err) {
      return next({
        log: 'Error occured in clusterController.getAllClusters Middleware',
        message: { err: JSON.stringify(err, Object.getOwnPropertyNames(err)) },
      });
    }
  },
  getCluster: async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<unknown> => {
    try {
      const cluster_id = req.params.cluster_id;
      const request = 'SELECT * FROM clusters WHERE cluster_id = $1';
      const values: any[] = [cluster_id];
      const response: any = await query(request, values);
      res.locals.cluster = response.rows;
      return next();
    } catch (err) {
      return next({
        log: 'Error occured in clusterController.getCluster Middleware',
        message: { err: JSON.stringify(err, Object.getOwnPropertyNames(err)) },
      });
    }
  },
  postCluster: async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<unknown> => {
    try {
      const {
        client_id,
        bootstrap_hostname,
        port_number,
        auth_mechanism,
        username,
        password,
        app_cluster_id,
        user_network,
      } = req.body;
      const request =
        'INSERT INTO clusters (client_id, bootstrap_hostname, port_number, auth_mechanism, username, password, app_cluster_id, user_network) VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *';
      const values: any[] = [
        client_id,
        bootstrap_hostname,
        port_number,
        auth_mechanism,
        username,
        password,
        app_cluster_id,
        user_network,
      ];
      const response: any = await query(request, values);
      res.locals.cluster = response.rows;
      return next();
    } catch (err) {
      return next({
        log: 'Error occured in clusterController.postCluster Middleware',
        message: { err: JSON.stringify(err, Object.getOwnPropertyNames(err)) },
      });
    }
  },
  putCluster: async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<unknown> => {
    try {
      const cluster_id = req.params.cluster_id;
      const {
        client_id,
        bootstrap_hostname,
        port_number,
        auth_mechanism,
        username,
        password,
        app_cluster_id,
        user_network,
      } = req.body;
      const request =
        'UPDATE clusters SET client_id = $1, bootstrap_hostname = $2, port_number = $3, auth_mechanism = $4, username = $5, password = $6, app_cluster_id = $7, user_network = $8 WHERE cluster_id = $9 RETURNING *';
      const values: any[] = [
        client_id,
        bootstrap_hostname,
        port_number,
        auth_mechanism,
        username,
        password,
        app_cluster_id,
        user_network,
        cluster_id,
      ];
      const response: any = await query(request, values);
      res.locals.cluster = response.rows;
      return next();
    } catch (err) {
      return next({
        log: 'Error occured in clusterController.putCluster Middleware',
        message: { err: JSON.stringify(err, Object.getOwnPropertyNames(err)) },
      });
    }
  },
  deleteCluster: async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<unknown> => {
    try {
      const cluster_id = req.params.cluster_id;
      const request = 'DELETE FROM clusters WHERE cluster_id = $1 RETURNING *';
      const values: any[] = [cluster_id];
      const response: any = await query(request, values);
      res.locals.cluster = response.rows;
      return next();
    } catch (err) {
      return next({
        log: 'Error occured in clusterController.deleteCluster Middleware',
        message: { err: JSON.stringify(err, Object.getOwnPropertyNames(err)) },
      });
    }
  },
};

export default clusterController;
