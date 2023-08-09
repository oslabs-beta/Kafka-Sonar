import { query } from '../models/appModel';
import { Request, Response, NextFunction } from 'express';

const clusterController = {
  postCluster: async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<unknown> => {
    try {
      const { client, host, port, auth, username, password, network } =
        req.body;
      const request =
        'INSERT INTO clusters (client_id, bootstrap_hostname, port_number, auth_mechanism, username, password, user_network) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *';
      const values: any[] = [
        client,
        host,
        port,
        auth,
        username,
        password,
        network,
      ];
      const response = await query(request, values);
      res.locals.cluster_id = response.rows[0].cluster_id;
      return next();
    } catch (err) {
      return next({
        log: 'Error occurred in clusterController.postCluster Middleware',
        message: { err: JSON.stringify(err, Object.getOwnPropertyNames(err)) },
      });
    }
  },
  postUserCluster: async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<unknown> => {
    try {
      const { user_id } = req.params;
      const request =
        'INSERT INTO users_in_clusters (user_id, cluster_id) VALUES ($1,$2) RETURNING *';
      const values: string[] = [user_id, res.locals.cluster_id];
      const response = await query(request, values);
      return next();
    } catch (err) {
      return next({
        log: 'Error occurred in clusterController.postUserCluster Middleware',
        message: { err: JSON.stringify(err, Object.getOwnPropertyNames(err)) },
      });
    }
  },
  postJmxPort: async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<unknown> => {
    try {
      const { brokerInfo } = req.body;
      const { cluster_id } = res.locals;
      // iterate through brokerInfo and make a query for each broker
      for (const broker of brokerInfo) {
        const request =
          'INSERT INTO jmx_ports (cluster_id, jmx_hostname, jmx_port_number) VALUES ($1,$2,$3) RETURNING *';
        const values: string[] = [cluster_id, broker.host, broker.port];
        await query(request, values);
      }
      return next();
    } catch (err) {
      return next({
        log: 'Error occurred in clusterController.postJmxPort Middleware',
        message: { err: JSON.stringify(err, Object.getOwnPropertyNames(err)) },
      });
    }
  },
  getUserClusters: async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<unknown> => {
    try {
      const { user_id } = req.params;
      const request =
        'SELECT * FROM clusters JOIN users_in_clusters ON clusters.cluster_id = users_in_clusters.cluster_id WHERE users_in_clusters.user_id = $1';
      const values: string[] = [user_id];
      const response = await query(request, values);
      res.locals.clusters = response.rows;
      return next();
    } catch (err) {
      return next({
        log: 'Error occurred in clusterController.getUserClusters Middleware',
        message: { err: JSON.stringify(err, Object.getOwnPropertyNames(err)) },
      });
    }
  },
  deleteCluster: async (
    req: Request,
    _res: Response,
    next: NextFunction
  ): Promise<unknown> => {
    try {
      const { cluster_id } = req.params;
      const request = 'DELETE FROM clusters WHERE cluster_id = $1 RETURNING *';
      const values: string[] = [cluster_id];
      const response = await query(request, values);
      return next();
    } catch (err) {
      return next({
        log: 'Error occurred in clusterController.deleteCluster Middleware',
        message: { err: JSON.stringify(err, Object.getOwnPropertyNames(err)) },
      });
    }
  },
  deleteUserCluster: async (
    req: Request,
    _res: Response,
    next: NextFunction
  ): Promise<unknown> => {
    try {
      const { user_id, cluster_id } = req.params;
      const request =
        'DELETE FROM users_in_clusters WHERE user_id = $1 AND cluster_id = $2 RETURNING *';
      const values: any[] = [user_id, cluster_id];
      const response: any = await query(request, values);
      console.log('deleteUserCluster response-->', response.rows);
      return next();
    } catch (err) {
      return next({
        log: 'Error occured in clusterController.deleteUserCluster Middleware',
        message: { err: JSON.stringify(err, Object.getOwnPropertyNames(err)) },
      });
    }
  },
  deleteJmxPort: async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<unknown> => {
    try {
      const { user_id, cluster_id } = req.params;
      const request = 'DELETE FROM jmx_ports WHERE cluster_id = $1 RETURNING *';
      const values: string[] = [cluster_id];
      const response: any = await query(request, values);
      res.locals.cluster = response.rows;
      return next();
    } catch (err) {
      return next({
        log: 'Error occured in clusterController.deleteJmxPort Middleware',
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
  getJmxPorts: async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<unknown> => {
    try {
      const { cluster_id } = req.params;
      const request = 'SELECT * FROM jmx_ports WHERE cluster_id = $1';
      const values: any = [cluster_id];
      const response: any = await query(request, values);
      res.locals.clusters = response.rows;
      return next();
    } catch (err) {
      return next({
        log: 'Error occured in clusterController.getJmxPorts Middleware',
        message: { err: JSON.stringify(err, Object.getOwnPropertyNames(err)) },
      });
    }
  },
};

export default clusterController;
